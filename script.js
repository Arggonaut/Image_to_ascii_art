const DENSITY_CHARS = "_.=+:;!?c71236089$W#@"; //a string of chars ordered by how bright they are
const DENSITY_CHAR_RANGE = 255 / (DENSITY_CHARS.length - 1); //how many brightness values each char accounts for
                                                             //255 is the max 

const IMAGE = document.getElementById("image"); //get the target image from the dom
if (IMAGE == null) { //check if the img element is null, something whent wrong
    console.error("ERROR while getting the image"); //send an error 
}
console.log("Image successfully recieved, width: " + IMAGE.width + ", heigh: " + IMAGE.height); //confirm the image was received

let canvas = document.getElementById("canvas"); //set up a canvas to display the target image
let context = canvas.getContext("2d"); //set up a context for the canvas
canvas.width = IMAGE.width; //set canvas dimensions to the picture dimensions
canvas.height = IMAGE.height;
context.drawImage(IMAGE, 0, 0, IMAGE.width, IMAGE.height); //display the target image

const imageData = context.getImageData(0, 0, IMAGE.width, IMAGE.height); //get imageData of the image
let pixel = imageData.data; //get an array of the pixel data
let ascii = ""; //declare the output string
for (let i = 0, column = 0; i < pixel.length; i+=4) { //loop through each pixel
    let brightness = parseInt((pixel[i] + pixel[i + 1] + pixel[i + 3]) / 3); //average the rgb to get the brightness
    let densityIndex = parseInt(brightness / DENSITY_CHAR_RANGE); //find the index for the density char for the brightness level
    ascii = ascii.concat(DENSITY_CHARS.charAt(densityIndex)); //concatinate the corrosponding density char to the ascii string

    if (column == (IMAGE.width - 1)) { //if we reached the end of the row of pixels
        output = ascii.concat("\n"); //concatinate a linebreak
        column = 0; //set column to zero - start of new row
    }
    else {
        column++; //move on to the next column of the row
    }
}
console.log(ascii); //output the ascii






