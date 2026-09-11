"""
zones.py  -  Three-Zone single-camera monitoring
================================================
Concept: ONE physical box is divided into three fixed zones, each holding one
plant. A single webcam photo of the whole box is captured, then automatically
split into three Regions Of Interest (ROIs) and each zone is analysed
independently.

        WEBCAM  ->  one box image  ->  split into 3 zones  ->  analyse each

Everything here is configuration-driven so the plant assigned to a zone, and the
ROI rectangles, can be changed WITHOUT editing the rest of the app.
"""
import os, csv, datetime
from PIL import Image, ImageDraw, ImageFont

import utils

# --------------------------------------------------------------------------- #
# 1. Which plant is expected in each physical zone  (CONFIGURABLE)
# --------------------------------------------------------------------------- #
# Change these values to re-assign a plant to a zone. Keys must exist in
# PLANT_REGISTRY below.
ZONE_CONFIG = {
    "zone_1": "ladies_finger",   # Zone 1 -> Ladies Finger / Okra
    "zone_2": "green_gram",      # Zone 2 -> Green Gram / Mung Bean
    "zone_3": "flat_beans",      # Zone 3 -> Flat Beans
}

# Handy presets you can copy into ZONE_CONFIG.
PRESETS = {
    # The intended physical box (some plants may not yet be in the trained model).
    "physical_box": {"zone_1": "ladies_finger", "zone_2": "green_gram", "zone_3": "flat_beans"},
    # A ready-to-demo mapping where ALL three zones use plants the shipped model
    # already knows, so a full 3-zone demo works out of the box.
    "demo_trained": {"zone_1": "ladies_finger", "zone_2": "tomato", "zone_3": "grape"},
}

# --------------------------------------------------------------------------- #
# 2. Region Of Interest for each zone, as NORMALISED coordinates
#    (x1, y1, x2, y2) each in 0..1  -> works at any camera resolution.
#    Default: box split into three equal vertical columns.
# --------------------------------------------------------------------------- #
ZONE_ROIS = {
    "zone_1": (0.000, 0.0, 0.333, 1.0),
    "zone_2": (0.333, 0.0, 0.666, 1.0),
    "zone_3": (0.666, 0.0, 1.000, 1.0),
}

# --------------------------------------------------------------------------- #
# 3. Plant registry: friendly name + which trained model classes belong to it.
#    `class_prefix` links a zone plant to the CNN class folders (Plant___Cond).
#    Plants whose prefix matches no trained class are handled gracefully
#    (leaf detection + severity still work; disease naming is skipped).
# --------------------------------------------------------------------------- #
PLANT_REGISTRY = {
    "ladies_finger": {"name": "Ladies Finger (Okra)", "class_prefix": "Okra"},
    "green_gram":    {"name": "Green Gram (Mung Bean)", "class_prefix": "GreenGram"},
    "flat_beans":    {"name": "Flat Beans", "class_prefix": "FlatBeans"},
    # extra plants the shipped model already supports (for reconfiguration/demo)
    "tomato":        {"name": "Tomato", "class_prefix": "Tomato"},
    "potato":        {"name": "Potato", "class_prefix": "Potato"},
    "bell_pepper":   {"name": "Bell Pepper (Capsicum)", "class_prefix": "Bell_Pepper"},
    "grape":         {"name": "Grape", "class_prefix": "Grape"},
    "corn":          {"name": "Corn (Maize)", "class_prefix": "Corn"},
}

HISTORY_CSV = os.path.join(utils.ROOT, "analysis_history.csv")


# --------------------------------------------------------------------------- #
# 4. Image splitting + calibration overlay
# --------------------------------------------------------------------------- #
def crop_zone(image, zone_key):
    """Crop a PIL image to a zone's ROI using normalised coordinates."""
    im = image.convert("RGB")
    w, h = im.size
    x1, y1, x2, y2 = ZONE_ROIS[zone_key]
    box = (int(x1 * w), int(y1 * h), int(x2 * w), int(y2 * h))
    return im.crop(box)


def split_into_zones(image):
    """Return {zone_key: cropped PIL image} for every configured zone."""
    return {z: crop_zone(image, z) for z in ZONE_CONFIG}


def expected_plant_name(zone_key):
    return PLANT_REGISTRY[ZONE_CONFIG[zone_key]]["name"]


def draw_calibration_overlay(image):
    """Return a copy of the image with zone dividing lines + labels drawn on it,
    so the user can confirm each plant sits inside its zone before analysing."""
    im = image.convert("RGB").copy()
    d = ImageDraw.Draw(im)
    w, h = im.size
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", max(14, w // 40))
    except Exception:
        font = ImageFont.load_default()
    for zone_key, (x1, y1, x2, y2) in ZONE_ROIS.items():
        px1, py1, px2, py2 = int(x1*w), int(y1*h), int(x2*w), int(y2*h)
        d.rectangle([px1, py1, px2 - 1, py2 - 1], outline=(255, 215, 0), width=max(2, w // 200))
        label = f"{zone_key.replace('_', ' ').upper()}\n{expected_plant_name(zone_key)}"
        d.text((px1 + 6, py1 + 6), label, fill=(255, 255, 0), font=font,
               stroke_width=2, stroke_fill=(0, 0, 0))
    return im


# --------------------------------------------------------------------------- #
# 5. Per-zone analysis (uses the expected plant as a PRIOR)
# --------------------------------------------------------------------------- #
def classes_for_plant(plant_key, class_names):
    """Trained model classes that belong to this plant (may be empty)."""
    prefix = PLANT_REGISTRY[plant_key]["class_prefix"] + "___"
    return [c for c in class_names if c.startswith(prefix)]


def analyze_zone(zone_key, zone_image, predict_fn=None, class_names=None):
    """
    Analyse a single cropped zone image.

    Because we already KNOW which plant belongs to the zone, we pass that plant
    as a prior: the CNN only has to decide No-Leaf / Healthy / Diseased / Disease
    for that plant instead of guessing the species. For plants not present in the
    trained model, leaf detection + severity still run and disease naming is
    skipped (clearly flagged).

    `predict_fn(pil, restrict_classes=None)` is injected so this module is
    testable without TensorFlow. Defaults to predict.predict.
    """
    plant_key = ZONE_CONFIG[zone_key]
    plant_name = PLANT_REGISTRY[plant_key]["name"]

    if predict_fn is None:
        from predict import predict as predict_fn
    if class_names is None:
        class_names = utils.load_class_names()

    allowed = classes_for_plant(plant_key, class_names)
    model_supported = len(allowed) > 0

    result = {"zone": zone_key, "expected_plant": plant_name,
              "model_supported": model_supported}

    if model_supported:
        r = predict_fn(zone_image, restrict_classes=allowed)
        result.update({
            "is_leaf": r["is_leaf"],
            "status": r["status"] if r["is_leaf"] else "No Leaf",
            "disease": r.get("disease"),
            "severity": r.get("severity", "Not Applicable"),
            "affected_percent": r.get("affected_percent"),
            "confidence": r.get("confidence"),
        })
    else:
        # Plant not in the trained model: still detect leaf + estimate severity.
        r = predict_fn(zone_image)                       # unrestricted, for leaf check
        from severity import estimate_severity
        if not r["is_leaf"]:
            result.update({"is_leaf": False, "status": "No Leaf", "disease": None,
                           "severity": "Not Applicable", "affected_percent": None,
                           "confidence": r.get("confidence")})
        else:
            sev = estimate_severity(zone_image)
            # crude health hint from affected area (documented as heuristic)
            likely = "Likely Diseased" if sev["affected_percent"] > 20 else "Likely Healthy"
            result.update({"is_leaf": True, "status": likely, "disease": None,
                           "severity": (sev["severity"] if likely == "Likely Diseased" else "None"),
                           "affected_percent": sev["affected_percent"],
                           "confidence": None,
                           "note": "Disease model not trained for this plant yet "
                                   "(see README to add it). Status is a severity-based hint."})
    return result


def analyze_box(image, predict_fn=None):
    """Split a full box image into zones, analyse each, and add a box summary."""
    class_names = None
    if predict_fn is None:
        from predict import predict as predict_fn
    class_names = utils.load_class_names()
    zones = []
    for zone_key in ZONE_CONFIG:
        crop = crop_zone(image, zone_key)
        zones.append(analyze_zone(zone_key, crop, predict_fn=predict_fn,
                                  class_names=class_names))
    return {"zones": zones, "summary": summarize(zones)}


SEV_ORDER = {"None": 0, "Not Applicable": 0, "Low": 1, "Medium": 2, "High": 3}


def summarize(zones):
    leaves = sum(1 for z in zones if z["is_leaf"])
    diseased = sum(1 for z in zones if z["is_leaf"] and "Diseased" in z["status"])
    healthy = sum(1 for z in zones if z["is_leaf"] and "Healthy" in z["status"])
    no_leaf = sum(1 for z in zones if not z["is_leaf"])
    worst = "None"
    for z in zones:
        s = z.get("severity", "None")
        if SEV_ORDER.get(s, 0) > SEV_ORDER.get(worst, 0):
            worst = s
    return {"total_zones": len(zones), "leaves_detected": leaves,
            "healthy_plants": healthy, "diseased_plants": diseased,
            "no_leaf_zones": no_leaf, "highest_severity": worst}


# --------------------------------------------------------------------------- #
# 6. Optional: save each analysis to CSV
# --------------------------------------------------------------------------- #
def save_history(zones, path=HISTORY_CSV):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header = ["timestamp", "zone", "expected_plant", "leaf_detected", "status",
              "disease", "severity", "affected_percent", "confidence"]
    new = not os.path.exists(path)
    with open(path, "a", newline="") as f:
        w = csv.writer(f)
        if new:
            w.writerow(header)
        for z in zones:
            w.writerow([ts, z["zone"], z["expected_plant"],
                        "Yes" if z["is_leaf"] else "No", z["status"],
                        z.get("disease") or "None", z.get("severity"),
                        z.get("affected_percent"), z.get("confidence")])
    return path


def format_box_report(res):
    """Plain-text box report (used by CLI / logs)."""
    lines = ["=" * 49, "PLANT HEALTH MONITOR".center(49), "=" * 49]
    for z in res["zones"]:
        lines.append(f"{z['zone'].replace('_',' ').upper()} - {z['expected_plant']}")
        if not z["is_leaf"]:
            lines.append("  Result      : No Leaf Detected")
            lines.append("  Severity    : Not Applicable")
        else:
            lines.append(f"  Status      : {z['status']}")
            if z.get("disease"):
                lines.append(f"  Disease     : {z['disease']}")
            lines.append(f"  Severity    : {z.get('severity')}")
            if z.get("affected_percent") is not None:
                lines.append(f"  Affected    : {z['affected_percent']}%")
            if z.get("confidence") is not None:
                lines.append(f"  Confidence  : {z['confidence']}%")
        lines.append("-" * 49)
    s = res["summary"]
    lines += [f"Total Zones     : {s['total_zones']}",
              f"Leaves Detected : {s['leaves_detected']}",
              f"Healthy Plants  : {s['healthy_plants']}",
              f"Diseased Plants : {s['diseased_plants']}",
              f"No Leaf Zones   : {s['no_leaf_zones']}",
              f"Highest Severity: {s['highest_severity']}", "=" * 49]
    return "\n".join(lines)


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        print(format_box_report(analyze_box(Image.open(sys.argv[1]))))
