/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="../config/constants.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />

// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotmachinebg.png" },
    { id: "reset", src: "assets/images/resetbutton.png" }
];

// Load slotMachineAtlas
// slotMachineAtlas has sprite objects in arrays
var slotMachineAtlas = {

    "images": [
        "assets/images/slotMachineAtlas.png"
    ],

    "frames": [
        [2, 2, 63, 63, 0, 0, 0],
        [2, 67, 49, 49, 0, 0, 0],
        [53, 67, 49, 49, 0, 0, 0],
        [67, 2, 63, 63, 0, 0, 0],
        [104, 67, 49, 49, 0, 0, 0],
        [132, 2, 63, 63, 0, 0, 0],
        [155, 67, 49, 49, 0, 0, 0],
        [197, 2, 63, 63, 0, 0, 0],
        [206, 67, 49, 49, 0, 0, 0],
        [262, 2, 63, 63, 0, 0, 0],
        [327, 2, 63, 63, 0, 0, 0]
    ],

    "animations": {
        "bell": [0],
        "betmaxbutton": [1],
        "betonebutton": [2],
        "berry": [3],
        "bettenbutton": [4],
        "blank": [5],
        "resetbutton": [6],
        "cherry": [7],
        "spinbutton": [8],
        "lemon": [9],
        "orange": [10]
    }

}

// Game Variables
var background: createjs.Bitmap;
var reset: createjs.Bitmap;
var spriteSheet: createjs.SpriteSheet;

// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this); 
    assets.loadManifest(manifest);

    // Load Spitesheet object refers to all the properties of my slotMachineAtlas
    spriteSheet = new createjs.SpriteSheet(slotMachineAtlas);

    //Setup statistics object
    setupStats();
}

// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop); 

    // calling main game function
    main();
}

// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps

    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '330px';
    stats.domElement.style.top = '10px';

    document.body.appendChild(stats.domElement);
}


// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring

    stage.update();

    stats.end(); // end measuring
}

// Callback function that allows me to respond to button click events
function pinkButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("clicked");
}

// Our Main Game Function
function main()
{
    // Adding Slot Machine Graphics
    background = new createjs.Bitmap(assets.getResult("background"));
    stage.addChild(background); 
}