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

class RotCircle {
    constructor(radius, freq) {
        this.radius = radius;
        this.x = 0;
        this.y = 0;
        this.x_p = radius;
        this.y_p = 0;
        this.freq = freq;
    }

    update(x, y, t) {
        this.x = x;
        this.y = y;
        this.x_p = this.x + this.radius * Math.cos(t * this.freq);
        this.y_p = this.y - this.radius * Math.sin(t * this.freq);

        return [this.x_p, this.y_p];
    }

    show() {
        stroke(255, 100);
        noFill();
        ellipse(this.x, this.y, 2 * this.radius);
        stroke(255);
        line(this.x, this.y, this.x_p, this.y_p);
    }
}


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
let freqArray = [];

let c = getCoeff_sin(1);
freqArray[0] = new RotCircle(ogRadius * c, 1);
freqArray[0].update(200, 200, 0);

function draw() {

    termValP.html("# of terms: " + termSlider.value())

    background(0);

    let sVal = termSlider.value();

    if (sVal > freqArray.length) {
        for (let term = freqArray.length + 1; term <= sVal; ++term) {
            let c = getCoeff_sin(term);
            freqArray.push(new RotCircle(ogRadius * c, term));
        }
    }
    else {
        for (let term = (freqArray.length - sVal); term > 0; --term) {
            freqArray.pop();
        }
    }

    prevPos = [centerX, centerY];

    for (let i = 0; i < freqArray.length; ++i) {
        prevPos = freqArray[i].update(prevPos[0], prevPos[1], time);
        freqArray[i].show();
    }
    
    waveCache.unshift(freqArray[freqArray.length - 1].y_p);

    beginShape();
    for (let i = 0; i < waveCache.length; ++i) {
        vertex(centerX + ogRadius + 150 + i, waveCache[i]);
    }
    endShape();

    line(freqArray[sVal - 1].x_p, waveCache[0], centerX + ogRadius + 150, waveCache[0]);

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

var coeff_dict =
[
    {
        name: "square",
        coeffs_cos: [0, 0, 0, 0, 0],                        //start from coeff 0
        coeffs_sin: [4/(Math.PI), 0, 4/(3*Math.PI), 0, 4/(5*Math.PI)]      //start from coeff 1
    },
    {
        name: "triangle",
        coeffs_cos: [0, 0, 0, 0, 0],
        coeffs_sin: [8/(Math.pow(Math.PI, 2)), 0, 8/(Math.pow(Math.PI, 2)) * (-1/9), 0, 8/(Math.pow(Math.PI, 2)) * (1/25)]
    },
    {
        name: "reverse sawtooth",
        coeffs_cos: [0, 0, 0, 0, 0],
        coeffs_sin: [-(2/Math.PI), 1/Math.PI, -(2/(3*Math.PI)), 2/(4*Math.PI), -(2/(5*Math.PI))]
    }
];

/* function getCoeff_sin(wavestr, iteration) {             //works: 02.02 - 01:34
    if (iteration > numberOfTerms || iteration > 5) {
        throw "number of iterations too high";
    }
    for (let i = 0; i < coeff_dict.length; ++i) {
        if (coeff_dict[i].name === wavestr) {
            return coeff_dict[i].coeffs_sin[(iteration -1)];
        }
    }
} */

/*
function fourierTerm(posX, posY, iteration, t) {
    if (iteration <= numberOfTerms) {
        background(0);
        translate(posX, posY);
        stroke(255);
        noFill();
        var c = getCoeff_sin(wave, iteration);
        var adaptedRadius = ogRadius * c;
        circle(0, 0, 2 * adaptedRadius);
        var newX = adaptedRadius * Math.sin(t * iteration);
        var newY = adaptedRadius * Math.cos(t * iteration);
        fourierTerm(newX, newY, iteration + 1, t);
    }
    else {return 0;};
}
*/