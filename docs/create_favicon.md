# Create favicon.ico

To create the Favourite Icon (the little icon on the tab), use the following 
[ImageMagick](https://imagemagick.org/#gsc.tab=0) command:

(Example uses the `orange-house.jpg`)

```bash
magick public/images/orange-house.jpg \                                                                                                                                                                                                             
    -resize 171x256 \                                                                                                                                                                                                                                                                                 
    -gravity center \                                                                                                                                                                                                                                                                                 
    -background transparent \                                                                                                                                                                                                                                                                       
    -extent 256x256 \                                                                                                                                                                                                                                                                                 
    -define icon:auto-resize=256,48,32,16 \                                                                                                                                                                                                                                                           
    public/favicon.ico
```