const DENSITY_CHARS = "_.=+:;!?c71236089$W#@";
const DENSITY_CHAR_RANGE = 255 / (DENSITY_CHARS.length - 1);

const IMAGE = document.getElementById("image");
if (IMAGE == null) {
    console.error("ERROR while getting the image");
}
console.log("Image successfully recieved, width: " + IMAGE.width + ", heigh: " + IMAGE.height);
console.log(IMAGE.width * IMAGE.height + " pixels")

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

canvas.width = IMAGE.width;
canvas.height = IMAGE.height;
context.drawImage(IMAGE, 0, 0, IMAGE.width, IMAGE.height);
const imageData = context.getImageData(0, 0, IMAGE.width, IMAGE.height);
let pixel = imageData.data;
let output = "";
for (let i = 0, column = 0; i < pixel.length; i+=4) {
    let brightness = parseInt((pixel[i] + pixel[i + 1] + pixel[i + 3]) / 3);
    let densityIndex = parseInt(brightness / DENSITY_CHAR_RANGE);
    output = output.concat(DENSITY_CHARS.charAt(densityIndex));

    if (column == (IMAGE.width - 1)) {
        console.log(temp);
        output = "";
        column = 0;
    }
    else {
        column++
    }
}






