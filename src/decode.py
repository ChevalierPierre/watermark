#!/usr/bin/env python3
print("enter decode script")

import sys
import cv2
from imwatermark import WatermarkDecoder
import sys
bgr = cv2.imread(sys.argv[1])

decoder = WatermarkDecoder('bytes', 32)
watermark = decoder.decode(bgr, 'dwtDct')
print(watermark.decode('utf-8'))
