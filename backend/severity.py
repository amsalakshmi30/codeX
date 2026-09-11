"""
severity.py  -  ESTIMATE how much of a leaf looks diseased
==========================================================
IMPORTANT: this is an *estimated* severity score based on simple image
processing, NOT a laboratory / agronomic measurement. It is meant as a
reasonable college-project prototype only.

Method (documented so it can be explained in the viva):
  1. Segment the LEAF away from the background (a leaf is green-ish / has
     reasonable saturation).  -> leaf_mask
  2. Inside the leaf, find pixels that look diseased: strong yellow / brown /
     dark / bleached areas (typical of blight, mosaic, spots).  -> disease_mask
  3. severity_ratio = diseased_leaf_pixels / total_leaf_pixels
  4. Map the ratio to Low / Medium / High:
        <= 20%           -> Low
        21% .. 50%       -> Medium
        > 50%            -> High

We work in HSV colour space because Hue/Saturation/Value separate "colour"
from "brightness", which makes green-vs-yellow-vs-brown easy to threshold.
"""
import numpy as np
import cv2


def _to_bgr(path_or_pil):
    if hasattr(path_or_pil, "convert"):          # a PIL image
        rgb = np.asarray(path_or_pil.convert("RGB"))
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    return cv2.imread(path_or_pil)


def estimate_severity(path_or_pil):
    """
    Returns a dict:
       {'affected_percent': float, 'severity': 'Low'/'Medium'/'High',
        'leaf_pixels': int}
    """
    bgr = _to_bgr(path_or_pil)
    if bgr is None:
        return {"affected_percent": 0.0, "severity": "Low", "leaf_pixels": 0}

    bgr = cv2.resize(bgr, (256, 256))
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    H, S, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]

    # ---- 1. leaf mask: reasonably saturated & not too dark (drops background) ----
    leaf_mask = (S > 40) & (V > 40)
    # keep the largest blob so scattered background specks are ignored
    leaf_mask = _largest_blob(leaf_mask)
    leaf_pixels = int(leaf_mask.sum())
    if leaf_pixels < 500:            # almost nothing that looks like a leaf
        return {"affected_percent": 0.0, "severity": "Low", "leaf_pixels": leaf_pixels}

    # ---- 2. healthy-green pixels inside the leaf ----
    #   Hue in OpenCV is 0-179; healthy green ~ 35-85
    green = (H >= 35) & (H <= 85) & (S > 45)
    # diseased = inside leaf but NOT healthy green
    #   (yellow mosaic, brown/black blight lesions, bleached spots)
    yellow_brown = ((H < 35) | (H > 90)) & leaf_mask          # off-green hues
    dark_lesion  = (V < 60) & leaf_mask                       # necrotic / black
    disease_mask = (leaf_mask & (~green)) | yellow_brown | dark_lesion
    disease_mask = disease_mask & leaf_mask

    affected = float(disease_mask.sum()) / float(leaf_pixels) * 100.0
    affected = max(0.0, min(100.0, affected))

    if affected <= 20:
        sev = "Low"
    elif affected <= 50:
        sev = "Medium"
    else:
        sev = "High"
    return {"affected_percent": round(affected, 1), "severity": sev,
            "leaf_pixels": leaf_pixels}


def _largest_blob(mask):
    """Keep only the biggest connected region of a boolean mask."""
    m = mask.astype("uint8")
    num, labels, stats, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
    if num <= 1:
        return mask
    # index 0 is background; pick the largest of the rest
    biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    return labels == biggest


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        print(estimate_severity(sys.argv[1]))
