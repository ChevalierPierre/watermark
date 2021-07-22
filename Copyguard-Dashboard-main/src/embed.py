#!/usr/bin/env python3
print("enter embed script")
import sys
import cv2
from imwatermark import WatermarkEncoder

bgr = cv2.imread(sys.argv[1])
wm = sys.argv[2]

encoder = WatermarkEncoder()
encoder.set_watermark('bytes', wm.encode('utf-8'))
bgr_encoded = encoder.encode(bgr, 'dwtDct')

cv2.imwrite(sys.argv[3], bgr_encoded)