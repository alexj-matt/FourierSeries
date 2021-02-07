//for simplicity assume T = 2 * pi
//possible waves: square, triangle, reverse sawtooth

//change if you want to

let ogRadius = 75;
let centerX = 200;
let centerY = 200;
let windowWidth = 800
let windowHeight = 400;

//dont change

let termSlider;
let wave = "square";

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    termSlider = createSlider(1, 50, 1);
    termSlider.position(10, windowHeight + 10);
    termSlider.style('width', '160px');

    termValP = createP();
    termValP.position(200, windowHeight - 7);

    squareButton = createButton("square");
    squareButton.position(10, windowHeight + 50);
    squareButton.mousePressed(update2square);
    triangleButton = createButton("triangle");
    triangleButton.position(110, windowHeight + 50);
    triangleButton.mousePressed(update2triangle);
    revSawButton = createButton("reverse sawtooth");
    revSawButton.position(210, windowHeight + 50);
    revSawButton.mousePressed(update2revSaw);
}

let time = 0;
let waveCache = [];

// i assume x and y return the value of where the "center of translation" is
function draw() {

    termValP.html("# of terms: " + termSlider.value())

    let x = centerX;
    let y = centerY;
    background(0);
    translate(x, y);

    let sVal = termSlider.value();

    for (let term = 1; term <= sVal; ++term) {
        let radius = getCoeff_sin(term);
        let x_p = radius * Math.cos(time * term);
        let y_p = - radius * Math.sin(time * term);

        stroke(255, 100);
        noFill();
        ellipse(0, 0, 2 * radius);
        stroke(255);
        line(0, 0, x_p, y_p);

        translate(x_p, y_p);
    }
    
    waveCache.unshift(y);

    beginShape();
    for (let i = 0; i < waveCache.length; ++i) {
        vertex(centerX + ogRadius + 150 + i, waveCache[i]);
    }
    endShape();

    line(x, waveCache[0], centerX + ogRadius + 150, waveCache[0]);

    if (waveCache.length > 400) {
        waveCache.pop();
    }

    time += 0.03;
}

function update2square() {
    wave = "square";
    freqArray = [];

    for (let term = 1; term <= termSlider.value(); ++term) {
        let c = getCoeff_sin(term);
        freqArray.push(new RotCircle(ogRadius * c, term));
    }
}

function update2triangle() {
    wave = "triangle";
    freqArray = []

    for (let term = 1; term <= termSlider.value(); ++term) {
        let c = getCoeff_sin(term);
        freqArray.push(new RotCircle(ogRadius * c, term));
    }
}

function update2revSaw() {
    wave = "reverse sawtooth";
    freqArray = []

    for (let term = 1; term <= termSlider.value(); ++term) {
        let c = getCoeff_sin(term);
        freqArray.push(new RotCircle(ogRadius * c, term));
    }
}

function getCoeff_sin(iteration) {
    switch (wave) {
        case "square":
            if (iteration%2 === 1) {
                return 4/(iteration*Math.PI);
            }
            else {
                return 0;
            }
        case "triangle":
            let uber = iteration%4;
            if (uber === 2 || uber === 0) {
                return 0;
            }
            if (uber === 1) {
                return 8/(Math.pow(Math.PI, 2) * Math.pow(iteration, 2));
            }
            else {
                return -8/(Math.pow(Math.PI, 2) * Math.pow(iteration, 2));
            }
        case "reverse sawtooth":
            if (iteration%2 === 1) {
                return -2/(iteration*Math.PI);
            }
            else {
                return 2/(iteration*Math.PI);
            }
    }
}