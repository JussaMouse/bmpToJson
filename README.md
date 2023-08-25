Usage: `node bmpInspect.js file.bmp file.json`
where file.bmp is the path of the file to load and
file.json is the path of the file to save to.

Input:
This program is compatibile with .bmp files
exported by GIMP with default settings (24bit)

The following byte offsets are assumed:
10: the offset of start of the pixel array (4 bytes)
18: width (4 bytes)
22: height (4 bytes)

The order of the pixels is left to right, bottom row to top
Each pixel is 3 bytes
There are bytes padding the end of each row of
pixels such that the byte length of the row is a multiple of 4
The order of the bytes is blue, green, red.

Output:
The JSON output is structured like so:
{
"name": "leaf3",
"width": 32,
"height": 32,
"palette": [
"ffffff",
"000000"
],
"pixels": [
[0, 0, 0],
[1, 1, 1]  
 ]
}

-name is a string taken from the .bmp file name
-width is a number
-height is a number
-palette is a 1-D array of hex strings for all colors in the image
-pixels\[row][col] is a 2-D array of numbers that correspond to the
colors in palette. for example if pixels\[1][2] has a value of 0,
it means that the pixel on the second row from the bottom (1), in
the third column (2) has the color FFFFFF (pixels\[0])
