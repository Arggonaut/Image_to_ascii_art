const canvas = document.getElementById("ascii_canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
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

    draw(context) {
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

    #brightness_to_char(brightness) {
        const density_index = parseInt(brightness / this.#density_char_range);
        return this.#density_array[density_index];
    }

    #scan_image(cell_size) {
        this.#image_cell_array = [];
        for (let y = 0; y < this.#height; y += cell_size) {
            for (let x = 0; x < this.#width; x += cell_size) {
                const x_postition = x * 4;
                const y_postition = y * 4;
                const pixel_index = (y_postition * this.#width) + x_postition;

                if (this.#pixels.data[pixel_index + 3] > (this.#MAX_COLOR_VALUE / 2)) {
                    const red = this.#pixels.data[pixel_index];
                    const green = this.#pixels.data[pixel_index + 1];
                    const blue = this.#pixels.data[pixel_index + 2];
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const brightness = (red + green + blue) / 3;
                    const density_char = this.#brightness_to_char(brightness);

                    this.#text_verson.concat(density_char);
                    this.#image_cell_array.push(new Cell(x, y, density_char, color));
                }
            }
            this.#text_verson.concat("\n");
        }
    }

    #draw_ascii() {
        this.#context.clearRect(0, 0, this.#width, this.#height);
        for (let i = 0; i < this.#image_cell_array.length; i++) {
            this.#image_cell_array[i].draw(this.#context);
        }
    }

    draw(cell_size) {
        this.#scan_image(cell_size);
        console.log(this.#image_cell_array);
        this.#draw_ascii();
    }
    
}

scale_input.addEventListener("change", (event) => {
    ascii.draw(scale_input.valueAsNumber);
})

input.addEventListener("change", (event) => {
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
    canvas.width = input_image.width;
    canvas.height = input_image.height;
    ascii = new Convert_To_Ascii(context, input_image.width, input_image.height);
    ascii.draw(10);
}