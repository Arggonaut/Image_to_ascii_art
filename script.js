const canvas = document.getElementById("ascii_canvas");
const context = canvas.getContext("2d");
const output_div = document.getElementById("ascii_div");
const ascii_text = document.getElementById("ascii_text");
const input = document.getElementById("input"); 
const input_image = document.createElement("img");
const scale_input = document.getElementById("scale_input");

class Cell {
    constructor(x, y, char, color) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.color = color;
    }

    draw(context) { //draw the character at the cell's position
        context.fillStyle = this.color;
        context.fillText(this.char, this.x, this.y);
    }
}

class Convert_To_Ascii {
    #image_cell_array = [];
    #pixels = [];
    #context;
    #width;
    #height;
    #text_verson = "";
    #MAX_COLOR_VALUE = 255;
    #density_array =  "_.=+:;!c71236089$W#@";
    #density_char_range = parseInt(this.#MAX_COLOR_VALUE / (this.#density_array.length - 1));

    constructor(context, width, height) {
        this.#context = context;
        this.#width = width;
        this.#height = height;
        this.#context.drawImage(input_image, 0, 0, this.#width, this.#height);
        this.#pixels = this.#context.getImageData(0, 0, this.#width, this.#height);
    }

    #fit_text() { //fit the text output inside of the output_div
        let font_size = 20;
        ascii_text.style.fontSize = font_size + "px";

        //scale the font size until it matches or is just over
        while (ascii_text.scrollWidth < output_div.clientWidth) {
            font_size++;
            ascii_text.style.fontSize = font_size + "px";
        }

        //if it overshoots, scale it down
        while (ascii_text.scrollWidth > output_div.clientWidth) {
            font_size--;
            ascii_text.style.fontSize = font_size + "px";
        }
    }
    #brightness_to_char(brightness) { //map the brightness value to a density char and return that char
        const density_index = parseInt(brightness / this.#density_char_range);
        return this.#density_array[density_index];
    }

    #scan_image(cell_size) { //traverse through each pixel and assign a density char
        this.#image_cell_array = [];
        for (let y = 0; y < this.#height; y += cell_size) { //traverse through each row
            for (let x = 0; x < this.#width; x += cell_size) { //traverse through each column
                const x_postition = x * 4; //each pixel has 4 indexes in the array
                const y_postition = y * 4;
                const pixel_index = (y_postition * this.#width) + x_postition;

                if (this.#pixels.data[pixel_index + 3] > (this.#MAX_COLOR_VALUE / 2)) {
                    const red = this.#pixels.data[pixel_index];
                    const green = this.#pixels.data[pixel_index + 1];
                    const blue = this.#pixels.data[pixel_index + 2];
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const brightness = (red + green + blue) / 3;
                    const density_char = this.#brightness_to_char(brightness);

                    this.#image_cell_array.push(new Cell(x, y, density_char, color));
                    if (y % 2 == 0) { //font is about twice as tall as it is wide so only add every other row
                        this.#text_verson = this.#text_verson.concat(density_char);
                    }
                }
                else {
                    if (y % 2 == 0) {
                        this.#text_verson = this.#text_verson.concat(" ");
                    }
                }
            }
            if(y % 2 == 0) {
                this.#text_verson = this.#text_verson.concat("\n");
            }
        }
    }

    #draw_ascii() {//traverse each cell in the cell_array and use their draw method
        this.#context.clearRect(0, 0, this.#width, this.#height);
        for (let i = 0; i < this.#image_cell_array.length; i++) {
            this.#image_cell_array[i].draw(this.#context);
        }
    }

    draw(cell_size) {//set up and draw the outputs
        this.#text_verson = "";
        this.#scan_image(cell_size);
        ascii_text.textContent = this.#text_verson;
        this.#fit_text();
        console.log(ascii_text.scrollWidth);
        this.#draw_ascii();
    }
    
}

scale_input.addEventListener("change", (event) => {
    const scale = (2 * scale_input.valueAsNumber) - 1;
    ascii.draw(scale);
})

input.addEventListener("change", (event) => { //load the uploaded image
    let image_file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image_file);

    reader.onload = (event) => {
        let image_URL = event.target.result;
        input_image.src = image_URL;
    }
})

let ascii;
input_image.onload = function initialize(){
    console.log("Image recieved with width: " + input_image.width + " and height: " + input_image.height);
    let height_to_width_ratio = input_image.height / input_image.width
    canvas.width = 512;
    canvas.height = parseInt(height_to_width_ratio * canvas.width);

    console.log(canvas.width + " | " + canvas.height);
    output_div.style.height = canvas.height;

    ascii = new Convert_To_Ascii(context, canvas.width, canvas.height);
    ascii.draw(1);
}