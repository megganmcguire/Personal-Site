/**
 * Created by Meggan McGuire on October 07, 2017.
 */

//requires p5.js; import relegated to html environment

/* Setup; assumes input is received via html form ====================================================*/
function onload() {
    maxLength = document.getElementById('maxLength');
    maxHeight = document.getElementById('maxHeight');
}

/*function that interacts with the html environment and pulls together all of the pieces below
functionality of individual pieces of the populate function is described as pieces are introduced below*/
function populate() {
    rainFall = [];
    rainFallLength = maxLength.value;
    rainFallMaxHeight = maxHeight.value;
    rainFallGenerator();
    bucket = 0;
    maxDim = rainFall.reduce(function (a, b) {
        return Math.max(a, b);
    });
    squares = [];
    canvasWidth = rainFall.length * 50 + 100;
    canvasHeight = maxDim * 50 + 100;
    structurePainter();
    for (var k = maxDim; k >= 1; k--) {
        oneDimFiller(k);
    }
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvasHome');
    background(34, 139, 34);
    function draw() {
        for (var i = 0; i < squares.length; i++) {
            squares[i].display();
        }
        base.display();
    }
    rainFallString = rainFallStringify();
    $('#rainArray').text(rainFallString);
    $('#bucket').text(bucket);
}

// initial parameters for structure of problem, length and maxHeight are assigned values here for the initial page load 
var rainFall = [];          //this is the array that determines the structure of the problem
var rainFallLength = 15;    //length of the array
var rainFallMaxHeight = 5;  //max value of any array element

//populate rainFall array with randomly generated values based on length and height constraints
var rainFallGenerator = function () {
    for (let a = 0; a < rainFallLength; a++) {
        var random = Math.floor(Math.random() * rainFallMaxHeight + Math.random()) ;
        rainFall.push(random);
    }
};

//populate array for the initial page load
rainFallGenerator();

//this is the counter for how many blocks of rain are collected
var bucket = 0;

//determine the maximum value of the randomly generated elements in rainFall array; needed for canvas height
var maxDim = rainFall.reduce(function (a, b) {
    return Math.max(a, b);
});

//setup the canvas
var canvasWidth = rainFall.length * 50 + 100;
var canvasHeight = maxDim * 50 + 100;

//this array contains a list of both the structure and water blocks that will be painted later
var squares = [];

//based on the values in rainFall, this identifies the structure blocks that will be painted later; 
//water identification occurs in oneDimFiller below
var structurePainter = function () {
    for (let n = 0; n < rainFall.length; n++) {
        for (let m = 1; m <= rainFall[n]; m++) {
            squareSolid = new squareMaker(50 * n + 50, canvasHeight - 50  - (50 * m), 'black');
            squares.push(squareSolid);
        }
    }
};

//call the function for the initial page load
structurePainter();

/*this is the primary function.  It performs the rainwater counting process and paints the rain 
blocks to the canvas as they are identified. This process is executed for one horizontal layer
at a time.  See the for loop below for executing all needed layers.
To accomplish this, we set up a left "marker" and a right "marker" that look for solid structure
blocks.  Then actions are performed for the gaps between those two markers, identifying the water
blocks.*/
var oneDimFiller = function (dim) {
    //we have two nested loops.  this first loop identifies the left "marker"
    for (var i = 0; i < rainFall.length; i++) {
        //edge case for the end of the array; we assume no water can occur there
        if (i == rainFall.length - 1) {
            bucket += 0;
        }
        //this conditional is the confirmation that the left marker has found a structure block
        if (rainFall[i] >= dim) {
            
            //now we perform a second loop to find the right "marker"
            for (var j = i + 1; j < rainFall.length; j++) {
                
                //this conditional is the confirmation that the right marker has found a structure block
                if (rainFall[j] >= dim) {
                    
                    bucket += j - i - 1;  //this counts the amount of water blocks between the left/right markers

                    //while we have the water block(s) identified, go ahead and push them to the array to be painted later to the canvas
                    if (j - i - 1 !== 0) {
                        for (var k = i + 1; k < j; k++) {
                            var squareWater = new squareMaker(50 * k + 50, canvasHeight - 50 - 50 * dim, 'blue');
                            squares.push(squareWater);
                        }
                    }

                    //move the left marker to the location of the right marker
                    i = j;
                }
            }
        }
    }
};

//This loop performs each individual horizontal layer
for (var k = maxDim; k >= 1; k--) {
    oneDimFiller(k);
}



// drawing functionality =================================================================
//all of our drawing amounts to drawing squares either as black for structure or blue for water
//p5 uses the display method to perform the painting
function squareMaker(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.display = function () {
        stroke(255, 50);
        if (this.color == 'blue') {
            fill(187, 217, 238);
        } else if (this.color == 'black') {
            fill(0);
        } else {
            noFill();
        }
        rect(this.x, this.y, 50, 50);
    };
}


//adjust the array in order to display results in the html environment
var rainFallStringify = function() {
    var string = '';
    for (let a=0; a<rainFall.length;a++){
        if (a == 0){
            string = string + rainFall[a];
        } else {
            string = string + ", " + rainFall[a];
        }

    }
    return string;
}
var rainFallString = rainFallStringify();

//this is called on page load to setup the initial example
function setup() {
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvasHome');
    background(34, 139, 34);
    $('#rainArray').append(rainFallString);
    $('#bucket').append(bucket);

}

//for visual aid, draw a grey base for the structure
var base = {
    display: function () {
        noStroke();
        fill(127, 128, 118);
        rect(0, canvasHeight - 50, canvasWidth, 50);
    }
};

//loop through all of the collected squares and actually paint them to the canvas
function draw() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].display();
    }
    base.display();     //and draw the base
}

