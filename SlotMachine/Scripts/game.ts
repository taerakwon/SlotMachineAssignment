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
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.border = "none";
var stage: createjs.Stage;
var stats: Stats;

var assets: createjs.LoadQueue;
var manifest = [
    { id: "background", src: "assets/images/slotmachinebg.png" }
];

// Preloading Sound
createjs.Sound.registerSound({ id: "buttonClick", src: "assets/audio/buttonClick.wav" });

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

// Slot Machine Background 
var background: createjs.Bitmap;

// Slot Machine Buttons
var reset: createjs.Bitmap;
var spriteSheet: createjs.SpriteSheet;
var spinButton: objects.Button;
var resetButton: objects.Button;
var betMaxButton: objects.Button;
var betTenButton: objects.Button;
var betOneButton: objects.Button;

// Slot Machine Labels
var playerCreditsLabel: objects.Label;
var playerBetLabel: objects.Label;
var spinResultLabel: objects.Label;
var jackpotLabel: createjs.Text;

// Reels
var reel1Sprite: createjs.Bitmap;
var reel2Sprite: createjs.Bitmap;
var reel3Sprite: createjs.Bitmap;

// Game Variables
var betLine = ["blank.png", "blank.png", "blank.png"];
var jackpot;
var playerCredit;
var playerBet;
var spinResult;
var bells = 0;
var cheeses = 0;
var cherries = 0;
var blueberries = 0;
var lemons = 0;
var oranges = 0;
var sevens = 0;
var blanks = 0;

// Default Jackpot Amount
jackpot = 5000;

// Player Credit Default Amount
playerCredit = 1000;

// Player Bet Default Amount
playerBet = 0;

// Player Spin Result Default Amount
spinResult = 0;

// Player Credit Function
function calcPlayerCredit()
{
    playerCredit = playerCredit - playerBet;
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
    createjs.Sound.play("buttonClick");
    if (playerCredit == 0) {
        if (confirm("You don't have any more credit!\nReplay?"));
        {
            resetAll();
        }
    }
    else if (playerBet > playerCredit) {
        alert("You don't have enough credit to place that bet");
    }
    else if (playerBet <= playerCredit && playerBet != 0) {
        calcPlayerCredit();
        Reels();
    }

}


// Reset Function

function resetAll() {
    betLine = ["blank.png", "blank.png", "blank.png"];
    jackpot = 5000;
    playerBet = 0;
    playerCredit = 1000;
    main();
}

// Click Event for Bet One Button
function betOneButtonClicked(event: createjs.MouseEvent)
{
    createjs.Sound.play("buttonClick");
    playerBet = 1;
    main();
}

// Click Event for Bet Ten Button
function betTenButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("buttonClick");
    playerBet = 10;
    main();
}

// Click Event for Bet Max Button
function betMaxButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("buttonClick");
    playerBet = playerCredit;
    main();
}

// Click Event for Reset Button
function resetButtonClicked(event: createjs.MouseEvent) {
    createjs.Sound.play("buttonClick");
    resetAll();
}

// Resets Reel C ounter
function resetCounts() {
    bells = 0;
    cheeses = 0;
    cherries = 0;
    blueberries = 0;
    lemons = 0;
    oranges = 0;
    sevens = 0;
    blanks = 0;
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var outCome = [0, 0, 0];
    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank.png";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "lemon.png";
                lemons++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "berry.png";
                blueberries++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "orange.png";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry.png";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "bell.png";
                bells++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "seven.png";
                sevens++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "cheese.png";
                cheeses++;
                break;
        }
    }
    determineWinnings();
    resetCounts();    
    main();
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (lemons == 3) {
            spinResult = playerBet * 10;
        }
        else if (blueberries == 3) {
            spinResult = playerBet * 20;
        }
        else if (oranges == 3) {
            spinResult = playerBet * 30;
        }
        else if (cherries == 3) {
            spinResult = playerBet * 40;
        }
        else if (bells == 3) {
            spinResult = playerBet * 50;
        }
        else if (sevens == 3) {
            spinResult = playerBet * 75;
        }
        else if (cheeses == 3) {
            spinResult = playerBet * 100;
            alert("Congratulations! JACKPOT!");
            playerCredit += jackpot;
            jackpot = 5000;            
        }
        else if (lemons == 2) {
            spinResult = playerBet * 2;
        }
        else if (blueberries == 2) {
            spinResult = playerBet * 2;
        }
        else if (oranges == 2) {
            spinResult = playerBet * 3;
        }
        else if (cherries == 2) {
            spinResult = playerBet * 4;
        }
        else if (bells == 2) {
            spinResult = playerBet * 5;
        }
        else if (sevens == 2) {
            spinResult = playerBet * 10;
        }
        else if (cheeses == 2) {
            spinResult = playerBet * 20;
        }
        else if (cheeses == 1) {
            spinResult = playerBet * 5;
        }
        else {
            spinResult = playerBet * 1;
        }
        playerCredit += spinResult;
    }
    else
    {
        // If there is even one blank on any reel
        spinResult = 0; // set the spin result to 0 
        jackpot += 1; // Add what player bet to the jackpot pool        
    }

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
    resetButton.on("click", resetButtonClicked, this);

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
    playerCreditsLabel = new objects.Label(playerCredit, 98, 311, false);
    playerCreditsLabel.color = "RED";
    playerCreditsLabel.textAlign = "right";
    stage.addChild(playerCreditsLabel);

    // Add playerBet Label
    playerBetLabel = new objects.Label(playerBet, 195, 311, false);
    playerBetLabel.color = "RED";
    playerBetLabel.textAlign = "right";
    stage.addChild(playerBetLabel);

    // Add spinResult Label
    spinResultLabel = new objects.Label(spinResult, 292, 311, false);
    spinResultLabel.color = "RED";
    spinResultLabel.textAlign = "right";
    stage.addChild(spinResultLabel);

    // Add total Jackpot amount Label
    jackpotLabel = new createjs.Text(jackpot, "bold 32px digital-7", "RED");
    jackpotLabel.x = 150;
    jackpotLabel.y = 64;
    stage.addChild(jackpotLabel);

    // Add reel1Sprite Bitmap
    reel1Sprite = new createjs.Bitmap("assets/images/"+betLine[0]);
    reel1Sprite.x = 54;
    reel1Sprite.y = 174;
    stage.addChild(reel1Sprite);

    // Add reel2Sprite Bitmap
    reel2Sprite = new createjs.Bitmap("assets/images/"+betLine[1]);
    reel2Sprite.x = 130;
    reel2Sprite.y = 174;
    stage.addChild(reel2Sprite);

    // Add reel3Sprite Bitmap
    reel3Sprite = new createjs.Bitmap("assets/images/"+betLine[2]);
    reel3Sprite.x = 206;
    reel3Sprite.y = 174;
    stage.addChild(reel3Sprite);    
}

