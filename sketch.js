(async () => {

    let doodleCanvas = (sketch) => {
        let strokeColor = 'red';
        let c;
        let doodle;
        let label = '';
        let labelIndex = 0;
        let myWidth = window.outerWidth;
        let myHeight = window.outerHeight - 100;
        const gotResults = (error, results) => {
            if (error) {
                console.error(error);
            } else {
                let newLabel = results[labelIndex % results.length].label;
                if (label === newLabel) {
                    labelIndex++;
                }
                label = results[labelIndex % results.length].label;
                console.log(results);
            }
        }
        sketch.setup = () => {
            c = sketch.createCanvas(myWidth, myHeight);
            doodle = sketch.createGraphics(myWidth, myHeight);
            sketch.background(0);
        }
        sketch.draw = () => {
            sketch.background(255);

            doodle.stroke(strokeColor);
            if (sketch.mouseIsPressed === true) {
                doodle.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
            }
            sketch.image(doodle, 0, 0);
            
            if(sketch.frameCount % 300 == 0) {
                mobileNet.predict(c, gotResults)
            }
            sketch.fill(0);
            sketch.textSize(32);
            sketch.text(label, 10, sketch.height - 20);

            sketch.noStroke();
            sketch.fill("red");
            sketch.rect(0, 0, 40, 40);
            if (strokeColor === "red") {
                sketch.fill("black");
                sketch.rect(10,10,20,20);
                sketch.fill("red");
            }
            sketch.fill("blue");
            sketch.rect(0, 40, 40, 40);
            if (strokeColor === "blue") {
                sketch.fill("black");
                sketch.rect(10,10 + 40,20,20);
                sketch.fill("blue");
            }
            sketch.fill("green");
            sketch.rect(0, (40*2), 40, 40);
            if (strokeColor === "green") {
                sketch.fill("black");
                sketch.rect(10,10 + (40*2),20,20);
                sketch.fill("green");
            }
            sketch.fill("pink");
            sketch.rect(0, (40*3), 40, 40);
            if (strokeColor === "pink") {
                sketch.fill("black");
                sketch.rect(10,10 + (40*3),20,20);
                sketch.fill("pink");
            }
            sketch.fill("orange");
            sketch.rect(0, (40*4), 40, 40);
            if (strokeColor === "orange") {
                sketch.fill("black");
                sketch.rect(10,10 + (40*4),20,20);
                sketch.fill("orange");
            }
            sketch.fill("yellow");
            sketch.rect(0, (40*5), 40, 40);
            if (strokeColor === "yellow") {
                sketch.fill("black");
                sketch.rect(10,10 + (40*5),20,20);
                sketch.fill("yellow");
            }
            sketch.fill("black");
            sketch.rect(0, (40*6), 40, 40);
            if (strokeColor === "black") {
                sketch.fill("white");
                sketch.rect(10,10 + (40*6),20,20);
                sketch.fill("black");
            }
        }

        sketch.mousePressed = () => {
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > 0 && sketch.mouseY < 40) {
                strokeColor = "red";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*1) && sketch.mouseY < (40*2)) {
                strokeColor = "blue";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*2) && sketch.mouseY < (40*3)) {
                strokeColor = "green";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*3) && sketch.mouseY < (40*4)) {
                strokeColor = "pink";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*4) && sketch.mouseY < (40*5)) {
                strokeColor = "orange";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*5) && sketch.mouseY < (40*6)) {
                strokeColor = "yellow";
            }
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > (40*6) && sketch.mouseY < (40*7)) {
                strokeColor = "black";
            }
        }
    }

    let mobileNet = await ml5.imageClassifier('DoodleNet');
    new p5(doodleCanvas);
})();
