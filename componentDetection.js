const fs = require("fs");

function getByteArray(filePath) {
  let fileData = fs.readFileSync(filePath).toString("hex");
  let result = [];
  for (var i = 0; i < fileData.length; i += 2)
    result.push("0x" + fileData[i] + "" + fileData[i + 1]);
  return result;
}

result = getByteArray("cce-input.pgm");
var header = ["P2", "438 361", "1"];
onlyImage = [];

for (var i = 0; i < result.length; i++) {
  if (i > 14) {
    let string = result[i];
    let parsedInt = parseInt(string);
    if (parsedInt == 255) {
      parsedInt = 0;
    } else {
      parsedInt = 1;
    }
    onlyImage.push(parsedInt);
  }
}

var parsedImage = [];
var copyImage = [];
tempPixel = 0;

for (i = 0; i < 361; i++) {
  for (j = 0; j < 438; j++) {
    if (!parsedImage[i]) {
      parsedImage[i] = [];
      copyImage[i] = [];
    }
    parsedImage[i][j] = onlyImage[tempPixel];
    copyImage[i][j] = 0;
    tempPixel++;
  }
}

function recursiveAddSequence(i, j, array) {
  if (parsedImage[i + 1][j] == 1 && copyImage[i + 1][j] == 0) {
    array.push([i + 1, j]);
    copyImage[i + 1][j] = label;
  }
  if (parsedImage[i][j + 1] == 1 && copyImage[i][j + 1] == 0) {
    array.push([i, j + 1]);
    copyImage[i][j + 1] = label;
  }
  if (parsedImage[i - 1][j] == 1 && copyImage[i - 1][j] == 0) {
    array.push([i - 1, j]);
    copyImage[i - 1][j] = label;
  }
  if (parsedImage[i][j - 1] == 1 && copyImage[i][j - 1] == 0) {
    array.push([i, j - 1]);
    copyImage[i][j - 1] = label;
  }
}

let label = 0;
for (i = 1; i < 361 - 1; i++) {
  for (j = 1; j < 438 - 1; j++) {
    tempWidth = i;
    tempHeight = j;
    if (parsedImage[i][j] == 1 && copyImage[i][j] == 0) {
      console.log("Run " + i, j);
      label++;
      let arrayDilate = [];
      arrayDilate.push([i, j]);
      copyImage[i][j] = label;
      for (var x = 0; x < arrayDilate.length; x++) {
        recursiveAddSequence(arrayDilate[x][0], arrayDilate[x][1], arrayDilate);
      }
      console.log("end run");
    }
  }
}
console.log(label);
for (i = 0; i < 361; i++) {
  for (j = 0; j < 438; j++) {
    if (copyImage[i][j] == 1) {
      copyImage[i][j] = 0;
    }
    if (copyImage[i][j] == 2) {
      copyImage[i][j] = 0;
    }
    if (copyImage[i][j] == 3) {
      copyImage[i][j] = 0;
    }
    header.push(copyImage[i][j]);
  }
}

let finalResult = header
  .toString()
  .split(",")
  .join("\n");
fs.writeFile("dilation.pgm", finalResult, err => {
  if (err) throw err;
});
