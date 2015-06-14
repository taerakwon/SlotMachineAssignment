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
        [2, 67, 63, 63, 0, 0, 0],
        [2, 132, 63, 63, 0, 0, 0],
        [67, 2, 63, 63, 0, 0, 0],
        [132, 2, 63, 63, 0, 0, 0],
        [197, 2, 49, 49, 0, 0, 0],
        [197, 53, 49, 49, 0, 0, 0],
        [67, 67, 63, 63, 0, 0, 0],
        [132, 67, 63, 63, 0, 0, 0],
        [197, 104, 49, 49, 0, 0, 0],
        [67, 132, 63, 63, 0, 0, 0],
        [132, 132, 49, 49, 0, 0, 0],
        [183, 155, 49, 49, 0, 0, 0]
    ],

    "animations": {
        "bell": [0],
        "berry": [1],
        "blank": [2],
        "cheese": [3],
        "cherry": [4],
        "betmaxbutton": [5],
        "betonebutton": [6],
        "lemon": [7],
        "orange": [8],
        "bettenbutton": [9],
        "seven": [10],
        "resetbutton": [11],
        "spinbutton": [12]
    }

}


// Game Variables
var background: createjs.Bitmap;
var reset: createjs.Bitmap;
var spriteSheet: createjs.SpriteSheet;
var spinButton: objects.Button;
var resetButton: objects.Button;
var betMaxButton: objects.Button;
var betTenButton: objects.Button;
var betOneButton: objects.Button;
var playerCreditsLabel: objects.Label;
var playerBetLabel: objects.Label;
var spinResultLabel: objects.Label;
var playerCredit;
var playerBet;
var spinResult;


// Player Credit Default Amount
playerCredit = 1000;

// Player Bet Default Amount
playerBet = 0;

// Player Spin Result Default Amount
spinResult = 0;

// Player Credit Function
function calcPlayerCredit()
{

}


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


// Click Event for Spin Button
function spinButtonClicked(event: createjs.MouseEvent)
{

}

// Click Event for Bet One Button
function betOneButtonClicked(event: createjs.MouseEvent)
{
    playerBet = 1;
}

// Click Event for Bet Ten Button
function betTenButtonClicked(event: createjs.MouseEvent) {
    playerBet = 10;
}

// Click Event for Bet Max Button
function betMaxButtonClicked(event: createjs.MouseEvent) {
    playerBet = playerCredit;
}

// Click Event for Reset Button
function resetButtonClicked(event: createjs.MouseEvent) {
    playerBet = 0;
    playerCredit = 1000;
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

    // Add spinButton sprite
    spinButton = new objects.Button("spinbutton", 246, 336, false) // Not Centered, therefore false
    stage.addChild(spinButton);
    spinButton.on("click", spinButtonClicked, this); // Click event

    // Add resetButton sprite
    resetButton = new objects.Button("resetbutton", 191, 336, false);
    stage.addChild(resetButton);

    // Add betMaxButton sprite
    betMaxButton = new objects.Button("betmaxbutton", 136, 336, false);
    stage.addChild(betMaxButton);
    betMaxButton.on("click", betMaxButtonClicked, this);

    // Add betTenButton sprite
    betTenButton = new objects.Button("bettenbutton", 81, 336, false);
    stage.addChild(betTenButton);
    betTenButton.on("click", betTenButtonClicked, this);

    // Add betOneButton sprite
    betOneButton = new objects.Button("betonebutton", 26, 336, false);
    stage.addChild(betOneButton);
    betOneButton.on("click", betOneButtonClicked, this);

    // Add playerCredits Label
    playerCreditsLabel = new objects.Label(playerCredit, 55, 309, false);
    playerCreditsLabel.color = "RED";
    stage.addChild(playerCreditsLabel);

    // Add playerBet Label
    playerBetLabel = new objects.Label(playerBet, 184, 309, false);
    playerBetLabel.color = "RED";
    stage.addChild(playerBetLabel);

    // Add spinResult Label
    spinResultLabel = new objects.Label(spinResult, 282, 309, false);
    spinResultLabel.color = "RED";
    stage.addChild(spinResultLabel);
}