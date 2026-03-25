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
let ascii_canvas = document.getElementById("ascii_canvas");
let ascii_text_area = document.getElementById("ascii_output");

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

    let resized_width = 2 ** scale;
    let resized_height = resized_width * height_to_width_ratio / 2;

    ascii_text_area.cols = resized_width;
    ascii_text_area.rows = resized_height;

    let resizedURL = resizeImage(input_image, resized_width, resized_height);
    resized_image.src = resizedURL;
    
    let ascii_canvas_context = ascii_canvas.getContext("2d"); 
    ascii_canvas.width = resized_image.width; 
    ascii_canvas.height = resized_image.height;
    ascii_canvas_context.drawImage(resized_image, 0, 0, resized_image.width, resized_image.height); 
    const imageData = ascii_canvas_context.getImageData(0, 0, resized_image.width, resized_image.height); //get imageData of the image

    let pixel = imageData.data; //get an array of the pixel data
    let ascii = ""; //declare the output string
    for (let i = 0, column = 0, row = 1; i < pixel.length; i+=4) { //loop through each pixel
        let brightness = parseInt((pixel[i] + pixel[i + 1] + pixel[i + 3]) / 3); //average the rgb to get the brightness
        let densityIndex = parseInt(brightness / DENSITY_CHAR_RANGE); //find the index for the density char for the brightness level
        ascii = ascii.concat(DENSITY_CHARS.charAt(densityIndex)); //concatinate the corrosponding density char to the ascii string


        if (column == (resized_image.width - 1)) { //if we reached the end of the row of pixels
            console.log(row);
            row++;
            ascii = ascii.concat("\n"); //concatinate a linebreak
            column = 0; //set column to zero - start of new row
        }
        else {
            column++; //move on to the next column of the row
        }
    }
    ascii_text_area.textContent = ascii;


})

   
   










function resizeImage(input, width, height) {
    const newCanvas = document.createElement("canvas");
    // newCanvas.style = "display: none";
    newCanvas.width = width;
    newCanvas.height = height;
    const newContext = newCanvas.getContext("2d");

    newContext.drawImage(input, 0, 0, width, height);
    return newCanvas.toDataURL();
}




