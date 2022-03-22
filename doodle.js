let doodle;
let doodleNet;
let isModelReady = false;
let previousFirstLabel = '';
let previousConfidence = 0;
let label = '';
let confidence = '';
let labelIndex = 0;
let selectedColor = 'white';
let uiButtonColors = ['white', 'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple'];
let uiButtons = [];
let buttonSize = 50;
// Used to keep track of active touches.
let currentTouches = [];
// Finds the array index of a touch in the currentTouches array.
const findCurrentTouchIndex = function (id) {
    for (var i = 0; i < currentTouches.length; i++) {
        if (currentTouches[i].id === id) {
            return i;
        }
    }
    // Touch not found! Return -1.
    return -1;
};
document.ontouchmove = function(event) {
    event.preventDefault();
}
function setup() {
    doodleNet = ml5.imageClassifier('DoodleNet', () => {
        console.log('model is ready!')
        isModelReady = true;
    });
    createCanvas(windowWidth, windowHeight);
    doodle = createGraphics(windowWidth, windowHeight - 36); 
    doodle.background(0);
    // Create UI Buttons
    for (let index = 0; index < uiButtonColors.length; index++) {
        const buttonColor = uiButtonColors[index];
        const uiButton = new ColorUIRect({
            color: buttonColor,
            x: 0,
            y: buttonSize * index,
            isSelected: buttonColor === selectedColor,
            isSelectedColor: 'black',
        })
        uiButtons.push(uiButton)
    }
}
function touchStarted() {
    // Update selected color based on click
    for (let index = 0; index < uiButtons.length; index++) {
        const button = uiButtons[index];
        button.clicked(mouseX, mouseY);
    }
    // Create a new scribble
    for (let index = 0; index < touches.length; index++) {
        const touch = touches[index];
        const newTouch = new Scribble({...touch, color: selectedColor});
        currentTouches.push(newTouch)
    }
    return false;
}
function touchMoved() {
    // The scribble has moved
    for (let index = 0; index < touches.length; index++) {
        const touch = touches[index];
        const currentTouchIndex = findCurrentTouchIndex(touch.id);
        if (currentTouchIndex >= 0) {
            const currentTouch = currentTouches[currentTouchIndex];
            currentTouch.drawTo({
                x: touch.x,
                y: touch.y
            });
        }
    }
    return false;
}
function touchEnded() {
    // Stop drawing the scribble
    for (let index = 0; index < touches.length; index++) {
        const touch = touches[index];
        const currentTouchIndex = findCurrentTouchIndex(touch.id);
        if (currentTouchIndex < 0) {
            // Remove the touch.
            currentTouches.splice(currentTouchIndex, 1);
        }
    }
    return false;
}
function draw() {
    background(0);
    // Draw the scribble and update the x/y of the scribble
    for (let index = 0; index < currentTouches.length; index++) {
        const currentTouch = currentTouches[index];
        currentTouch.show();
        currentTouch.moved();
    }
    image(doodle, 0, 0);
    if(isModelReady && frameCount % 300 == 0) {
        console.log(doodle)
        doodleNet.predict(doodle, gotResults)
    }
    drawPrediction();
    // Draw UI Buttons
    for (let index = 0; index < uiButtons.length; index++) {
        const button = uiButtons[index];
        button.show(button.color === selectedColor);
    }
    drawFPS();
}
const drawFPS = () => {
    let fps = frameRate();
    fill(255)
    stroke(0)
    textSize(22)
    text("FPS: " + fps.toFixed(2), 10,  height - 10)
}
const drawPrediction = () => {
    fill(255)
    stroke(0)
    textSize(22)
    text((confidence * 100).toFixed(2) + "% " + label, 10,  height - 36)
}
class ColorUIRect {
    constructor({color, x, y, isSelected, isSelectedColor}) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = buttonSize;
        this.height = buttonSize;
        this.isSelected = isSelected;
        this.isSelectedColor = isSelectedColor;
    }
    show(isSelected) {
        stroke(255)
        fill(this.color);
        rect(this.x, this.y, this.width, this.height);
        if (isSelected) {
            fill(this.isSelectedColor);
            rect((buttonSize / 4) + this.x, (buttonSize / 4) + this.y, buttonSize / 2, buttonSize / 2);
            fill(this.color);
        }
    }
    clicked(px, py) {
        if (
            px > this.x && 
            px < (this.x + this.width) && 
            py > this.y &&
            py < (this.y + this.height)) {
                this.isSelected = true;
                selectedColor = this.color;
            }
    }
}
class Scribble {
    constructor({x,y,id,color}) {
        this.x = x;
        this.y = y;
        this.dx = x;
        this.dy = y;
        this.id = id;
        this.color = color;
    }
    moved() {
        this.x = this.dx;
        this.y = this.dy;
    }
    show() {
        doodle.strokeWeight(4);
        doodle.stroke(this.color);
        doodle.line(this.x,this.y,this.dx,this.dy);
    }
    drawTo({x,y}) {
        this.dx = x;
        this.dy = y;
    }
}
const gotResults = (error, results) => {
    if (error) {
        label = '';
        console.error(error);
    } else {
        let firstResult = results[0].label;
        let firstConf = results[0].confidence;
        if (firstConf > previousConfidence) {
            labelIndex = 0;
            previousConfidence = firstConf;
        } else {
            if (previousFirstLabel === firstResult) {
                labelIndex++;
            } else {
                previousFirstLabel = firstResult;
                labelIndex = 0;
            }
        }
        label = results[labelIndex % results.length].label;
        confidence = results[labelIndex % results.length].confidence
        console.log(results);
    }
}