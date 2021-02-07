//for simplicity assume T = 2 * pi

//change if you want to
let ogRadius = 75;
let centerX = 200;
let centerY = 200;
//let numberofTerms;
let numberOfTerms = 5;
let wave = "rev_sawtooth";


//dont change
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
        name: "rev_sawtooth",
        coeffs_cos: [0, 0, 0, 0, 0],
        coeffs_sin: [-(2/Math.PI), 1/Math.PI, -(2/(3*Math.PI)), 2/(4*Math.PI), -(2/(5*Math.PI))]
    }
];
let time = 0;
let waveCache = [];

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
    createCanvas(800, 800);
    //numberOfTerms = createSlider(1, 5, 1);
}

let circArr = []; //or maybe freqArray
for (let i = 1; i <= numberOfTerms; ++i) {
    var c = getCoeff_sin(wave, i);
    circArr[i-1] = new RotCircle(ogRadius * c, i);
}

circArr[0].update(200, 200, 0);


function draw() {   //translation should be reset every call of draw
    background(0);

    prevPos = [centerX, centerY];
    for (let term = 0; term < circArr.length; ++term) {
        prevPos = circArr[term].update(prevPos[0], prevPos[1], time);
        circArr[term].show();
        //console.log(circArr[2].radius);
        
        if (term == (circArr.length -1)) {
            waveCache.unshift(circArr[term].y_p);
        }
    }

    beginShape();
    for (let i = 0; i < waveCache.length; ++i) {
        vertex(centerX + ogRadius + 150 + i, waveCache[i]);
    }
    endShape();

    line(circArr[numberOfTerms - 1].x_p, waveCache[0], centerX + ogRadius + 150, waveCache[0]);

    if (waveCache.length > 400) {
        waveCache.pop();
    }

    //fourierTerm(150, 150, 1, time);

    time += 0.03;
}

function getCoeff_sin(wavestr, iteration) {             //works: 02.02 - 01:34
    if (iteration > numberOfTerms || iteration > 5) {
        throw "number of iterations too high";
    }
    for (let i = 0; i < coeff_dict.length; ++i) {
        if (coeff_dict[i].name === wavestr) {
            return coeff_dict[i].coeffs_sin[(iteration -1)];
        }
    }
}

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