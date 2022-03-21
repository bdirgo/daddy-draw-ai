(async () => {

    let doodleCanvas = (sketch) => {
        let strokeColor = 'red';
        let cnv;
        let doodle;
        let label = '';
        let labelIndex = 0;
        // Used to keep track of active touches.
        let currentTouches = new Array;
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

        // Finds the array index of a touch in the currentTouches array.
        var findCurrentTouchIndex = function (id) {
            for (var i = 0; i < currentTouches.length; i++) {
                if (currentTouches[i].id === id) {
                    return i;
                }
            }

            // Touch not found! Return -1.
            return -1;
        };
        sketch.touchStarted = () => {
            for (let index = 0; index < sketch.touches.length; index++) {
                const touch = sketch.touches[index];
                currentTouches.push({
                    id: touch.id,
                    x: touch.x,
                    y: touch.y,
                });
            }
        }
        sketch.touchMoved = () => {
            for (let index = 0; index < sketch.touches.length; index++) {
                const touch = sketch.touches[index];
                var currentTouchIndex = findCurrentTouchIndex(touch.id);
                if (currentTouchIndex >= 0) {
                    var currentTouch = currentTouches[currentTouchIndex];
    

                    doodle.strokeWeight(5)
                    doodle.stroke(strokeColor);
                    doodle.line(currentTouch.x, currentTouch.y, touch.x, touch.y);
    
                    // Update the touch record.
                    currentTouch.x = touch.x;
                    currentTouch.y = touch.y;
    
                    // Store the record.
                    currentTouches.splice(currentTouchIndex, 1, currentTouch);
                } else {
                    console.log('Touch was not found!');
                }
            }
        }
        sketch.touchEnded = () => {
            for (let index = 0; index < sketch.touches.length; index++) {
                const touch = sketch.touches[index];
                var currentTouchIndex = findCurrentTouchIndex(touch.identifier);
                if (currentTouchIndex >= 0) {
                    // var currentTouch = currentTouches[currentTouchIndex];

                    // Remove the record.
                    currentTouches.splice(currentTouchIndex, 1);
                } else {
                    console.log('Touch was not found!');

                }    
            }
        }
        sketch.setup = () => {
            cnv = sketch.createCanvas(myWidth, myHeight);
            doodle = sketch.createGraphics(myWidth, myHeight);
            sketch.background(0);
        }
        sketch.draw = () => {
            sketch.background(255);

            // doodle.strokeWeight(5)
            // doodle.stroke(strokeColor);
            // if (sketch.mouseIsPressed === true) {
            //     doodle.line(sketch.mouseX, sketch.mouseY, sketch.pmouseX, sketch.pmouseY);
            // }
            // for (let index = 0; index < sketch.touches.length; index++) {
            //     const touch = sketch.touches[index];
            //     doodle.line(touch.x, touch.y)
            // }

//   // for every touch event in the touches[], draw an ellipse
//   // (IOW draw a circle for every finger tip touching screen)
//   // do this first so info text goes *over* the ellipses
//   for(let i = 0; i < touches.length; i++) {
//     ellipse(touches[i].x ,touches[i].y, 250, 250);
//   }
  
//   // if no touches but touchstarted == true, then it's a regular
//   // mouse interaction, so draw an ellipse for the mouse location
//   if(touches.length == 0 && touchstarted)
//       ellipse(mouseX,mouseY, 250, 250);
  
//   // notify when touch event has ended
//   if(touchended) text("touch is NO", width/2,height/2);
  
//   // if we're in a touch event, give some info
//   if(touchstarted) {
//     text("touch is YES", width/2,height/2);
//     text("X,Y: "+mouseX+","+mouseY, width/2, height/2+30);
//     text("HUE: "+Math.round(bg)+", SAT: "+Math.round(sat), width/2, height/2+60);
//     text("touches detected: "+touches.length, width/2, height/2+90);
//   }



            sketch.image(doodle, 0, 0);
            
            if(sketch.frameCount % 300 == 0) {
                mobileNet.predict(cnv, gotResults)
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
