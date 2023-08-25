# Usage:

```shell
node bmpInspect.js file.bmp
```

where file.bmp is the path of the file to load. The JSON output will be saved to file.json, overwriting it if it already exists.

# Input:

This program is compatibile with .bmp files
exported by GIMP with default settings (24bit/ no alpha channel). Byte offsets and other information about the spec can be found at [Wikipedia: BMP file format](https://en.wikipedia.org/wiki/BMP_file_format).

# Output:

```shell
node bmpToJson.js square.bmp
```

The JSON output (square.json) is structured like so:

```JSON
{
  "name": "square",
  "width": 3,
  "height": 3,
  "palette": [
    "0000ff",
    "00ff00",
    "ff0000"
  ],
  "pixels": [
    [0, 0, 0],
    [1, 1, 1],
    [2, 2, 2]
  ]
}
```

The image it represents is 3 pixels by 3 pixels in size. The top row is red, the middle row is green, and the bottom row is blue. The value in `pixels[row][col]` is the index of the corresponding color (hex string) in `palette`.

So for example if `palette[3]` has a value of 'FFFFFF', and `pixels[0][4]` has a value of 3, it means that the 5th pixel of the first (bottom) row is white.
