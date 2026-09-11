"""
predict.py  -  the full prediction pipeline (used by app.py and the CLI)
========================================================================
    Uploaded image
      -> preprocess (resize + the model rescales pixels)
      -> CNN softmax over all classes
      -> Leaf / No-Leaf decision
           * predicted class is 'no_leaf'            -> No Leaf Detected
           * OR confidence below LEAF_CONF_THRESHOLD -> No Leaf Detected
      -> otherwise: Plant + Healthy/Diseased + Disease name
      -> if Diseased: estimate severity (severity.py)  Low / Medium / High
      -> if Healthy : severity = None
"""
import os
import numpy as np

import utils
from severity import estimate_severity

# If the network is less sure than this about ANY leaf class, we treat the
# picture as "not a leaf we know". Tunable; 0.45 works well for this small model.
LEAF_CONF_THRESHOLD = 0.45

_model = None
_class_names = None


def _lazy_load():
    """Load the model + labels once and cache them."""
    global _model, _class_names
    if _model is None:
        from tensorflow import keras
        path = utils.ensure_local_model()          # supports optional GCS download
        if not path or not os.path.exists(path):
            raise FileNotFoundError(utils.MODEL_PATH)
        _model = keras.models.load_model(path)
        _class_names = utils.load_class_names()
    return _model, _class_names


def predict(path_or_pil, restrict_classes=None):
    """
    Run the whole pipeline on one image and return a result dict:

      {'is_leaf': bool, 'plant': str|None, 'status': str, 'disease': str|None,
       'severity': str, 'confidence': float, 'affected_percent': float|None,
       'top_class': str, 'all_scores': {class: prob}}

    `restrict_classes` (optional): a list of class names to restrict the decision
    to — used by the three-zone system to pass the *expected plant* as a prior.
    The `no_leaf` class is always kept so a zone can still report No Leaf. The
    remaining probabilities are renormalised before choosing the winner.
    """
    model, class_names = _lazy_load()

    x = utils.load_image_for_model(path_or_pil)
    probs = model.predict(x, verbose=0)[0]

    if restrict_classes:
        allowed = set(restrict_classes) | {utils.NO_LEAF_CLASS}
        mask = np.array([1.0 if c in allowed else 0.0 for c in class_names])
        masked = probs * mask
        s = masked.sum()
        if s > 0:
            probs = masked / s      # renormalise over the allowed classes

    top = int(np.argmax(probs))
    top_class = class_names[top]
    confidence = float(probs[top]) * 100.0
    scores = {c: round(float(p) * 100, 2) for c, p in zip(class_names, probs)}

    # ---------------- Leaf / No-Leaf decision ----------------
    is_no_leaf_class = (top_class == utils.NO_LEAF_CLASS)
    low_conf = (float(probs[top]) < LEAF_CONF_THRESHOLD)
    if is_no_leaf_class or low_conf:
        return {"is_leaf": False, "plant": None, "status": "No Leaf",
                "disease": None, "severity": "Not Applicable",
                "confidence": round(confidence, 1),
                "affected_percent": None, "top_class": top_class,
                "all_scores": scores}

    # ---------------- It IS a known leaf ----------------
    meta = utils.parse_class(top_class)
    result = {"is_leaf": True, "plant": meta["plant"], "status": meta["status"],
              "disease": meta["disease"], "confidence": round(confidence, 1),
              "top_class": top_class, "all_scores": scores}

    if meta["status"] == "Healthy":
        result["severity"] = "None"
        result["affected_percent"] = None
    else:
        sev = estimate_severity(path_or_pil)
        result["severity"] = sev["severity"]
        result["affected_percent"] = sev["affected_percent"]
    return result


def format_result(r):
    """Pretty multi-line string for the terminal / logs."""
    if not r["is_leaf"]:
        return "Result: No Leaf Detected  (confidence {:.1f}%)".format(r["confidence"])
    lines = [
        f"Plant: {r['plant']}",
        f"Leaf Status: {r['status']}",
    ]
    if r["status"] == "Diseased":
        lines.append(f"Disease: {r['disease']}")
        lines.append(f"Severity: {r['severity']}  (estimated affected area: {r['affected_percent']}%)")
    else:
        lines.append("Severity: None")
    lines.append(f"Confidence: {r['confidence']:.1f}%")
    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        raise SystemExit(1)
    print(format_result(predict(sys.argv[1])))
