#!/usr/bin/env bash

mkdir -p magick-temp
for f in *.png
do    
    convert "$f" -set option:distort:viewport 34x34-1-1 -virtual-pixel Edge -filter point -distort SRT 0 +repage magick-temp/"$f"
done

mv ../minecraft-faithful.png ../minecraft-faithful.png.bak
magick montage -background transparent -geometry +1+1 magick-temp/*.png ../minecraft-faithful.png
rm magick-temp/*.png
rm -d magick-temp

