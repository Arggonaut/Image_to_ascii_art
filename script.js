const DENSITY_CHARS = "_.=+:;!?c71236089$W#@"; //a string of chars ordered by how bright they are
const DENSITY_CHAR_RANGE = 255 / (DENSITY_CHARS.length - 1); //how many brightness values each char accounts for
                                                             //255 is the max 

let input = document.getElementById("input"); 
let input_image = document.createElement("img");
let display = document.getElementById("displayImage");
let scale_input = document.getElementById("scale_input");
let scale = scale_input.valueAsNumber;
let convert_button = document.getElementById("convert_button");
let resized_image = document.getElementById("resized_image");

let height_to_width_ratio = 1;

input.addEventListener("change", (event) => {
    let image_file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image_file);

    reader.onload = (event) => {
        let image_URL = event.target.result
        input_image.src = image_URL;
        console.log("Image recieved with width: " + input_image.width + " and height: " + input_image.height);

        height_to_width_ratio = input_image.height / input_image.width;
        const DISPLAY_WIDTH = 128;

        let displayURL = resizeImage(input_image, DISPLAY_WIDTH, DISPLAY_WIDTH * height_to_width_ratio);
        display.src = displayURL;   
    }
})

scale_input.addEventListener("change", (event) => {
    scale = scale_input.valueAsNumber;
})

convert_button.addEventListener("click", (event) => {

    let width = 2 ** scale;
    let height = width * height_to_width_ratio;

    let resizedURL = resizeImage(input_image, width, height);
    resized_image.src = resizedURL;
})

   
   








//////
// const imageData = context.getImageData(0, 0, IMAGE.width, IMAGE.height); //get imageData of the image
// let pixel = imageData.data; //get an array of the pixel data
// let ascii = ""; //declare the output string
// for (let i = 0, column = 0, row = 1; i < pixel.length; i+=4) { //loop through each pixel
//     let brightness = parseInt((pixel[i] + pixel[i + 1] + pixel[i + 3]) / 3); //average the rgb to get the brightness
//     let densityIndex = parseInt(brightness / DENSITY_CHAR_RANGE); //find the index for the density char for the brightness level
//     ascii = ascii.concat(DENSITY_CHARS.charAt(densityIndex)); //concatinate the corrosponding density char to the ascii string


//     if (column == (IMAGE.width - 1)) { //if we reached the end of the row of pixels
//         console.log(row);
//         row++;
//         ascii = ascii.concat("\n"); //concatinate a linebreak
//         column = 0; //set column to zero - start of new row
//     }
//     else {
//         column++; //move on to the next column of the row
//     }
// }
// console.log(ascii); //output the ascii



function resizeImage(input, width, height) {
    const newCanvas = document.createElement("canvas");
    // newCanvas.style = "display: none";
    newCanvas.width = width;
    newCanvas.height = height;
    const newContext = newCanvas.getContext("2d");

    newContext.drawImage(input, 0, 0, width, height);
    return newCanvas.toDataURL();
}




