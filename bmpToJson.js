const { readFileSync, writeFileSync } = require("fs");

// get file name from (only) argument
const bmpFilePath = process.argv[2];

// load the file
const bmpFile = readFileSync(bmpFilePath);

// convert the file contents to a hex string
const buf = Buffer.from(bmpFile, "hex");
var hexString = buf.toString("hex");

// put the individual bytes in an array
const hexArray = [];
for (let i = 0; i < hexString.length; i++) {
  if (i % 2 == 0) {
    hexArray.push(hexString.slice(i, i + 2));
  }
}

// return an integer from an offset (index in hexArray) and a number of bytes
// eg. use offset=18, n=4 to return the image width
function intFromBytes(hexArray, offset, n) {
  offset -= 1;
  let hex = "";
  for (let i = offset + n; i > offset; i--) {
    hex += hexArray[i];
  }
  return parseInt(hex, 16);
}

const width = intFromBytes(hexArray, 18, 4);
const height = intFromBytes(hexArray, 22, 4);
const pixelArrayOffset = intFromBytes(hexArray, 10, 4);
const pixelRowBytes = 3 * width;
const pixelRowPadding = (4 - (pixelRowBytes % 4)) % 4;
var pixelBytes = hexArray.slice(pixelArrayOffset);

// array of hex color strings in pixelArray[row][col]
// ex: pixelArray[0][0]='ffffff' means bottom left pixel
// of the image is white
let pixelArray = [];

let i = 0;
for (let row = 0; row < height; row++) {
  pixelArray[row] = [];
  for (let col = 0; col < width; col++) {
    pixelArray[row][col] = "";
    pixelArray[row][col] +=
      pixelBytes[i + 2] + pixelBytes[i + 1] + pixelBytes[i];

    i += 3;
    //test
    // if (i < 500) console.log(`${i / 3}: ${pixelArray[row][col]}`);
    if (col == width - 1) i += pixelRowPadding;
  }
  // console.log("new row");
}

// put the unique colors in a palette array
let palette = [];
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    const color = pixelArray[row][col];
    if (!palette.includes(color)) palette.push(color);
  }
}

// replace the hex colors in the pixel array with 0, 1, 2...
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    let colorIndex = 0;
    const ofColor = (element) => element == pixelArray[row][col];
    pixelArray[row][col] = palette.findIndex(ofColor);
  }
}

// display the array top to bottom in the console
let display = "";
for (let row = 0; row < height; row++) {
  for (let col = 0; col < width; col++) {
    display += `${pixelArray[height - 1 - row][col]} `;
  }
  display += "\n";
  if (row == height - 1) {
    display += "\n";
    for (let i = 0; i < palette.length; i++) {
      if (i % 3 == 0) display += "\n";
      display += `${i}: ${palette[i]}`;
      if (i < palette.length - 1) display += ", ";
    }
    display += "\n\n";
    display += `width: ${width}, height: ${height}`;
  }
}

const name = bmpFilePath.split("/").pop().split(".")[0];

const output = {
  name: name,
  width: width,
  height: height,
  palette: palette,
  pixels: pixelArray,
};

const jsonData = JSON.stringify(output, null, 2);
const outputFile = output.name + ".json";

writeFileSync(outputFile, jsonData, "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON to file:", err);
  } else {
    console.log("JSON data has been written to", outputFile);
  }
});

console.log(display);
// console.log(pixelBytes.toString());
