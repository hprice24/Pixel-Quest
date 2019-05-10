// ########### Setup Canvas ############

//create the canvas element
var canvas = document.createElement("canvas");
//takes canvas gets its context and puts that value in the ctx variable
var ctx = canvas.getContext("2d");
// set canvas width height
canvas.width = 512;
canvas.height = 480;
//appends the canvas to the document object
document.body.appendChild(canvas);

// ############ Global Variables ############

var deaths = 0;
var gravity = 0.25;
var startLevel2 = false;
var startLevel1 = false;
var startGame = true;
var allBats = [];
var allPlatforms = [];
// for sounds 
var deathAudio;
deathAudio = new sound("fpAudio/audioDeath.mp3");
var lavaAudio;
lavaAudio = new sound("fpAudio/audioLava.mp3");
var level1Audio;
level1Audio = new sound("fpAudio/audioPlatform.mp3");

// ############ Setup Keyboard Controls ###########

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

// ############ Setting Up Images ###########

// Menu Image 
var menuReady = false;
var menuImage = new Image();
menuImage.onload = function () {
	menuReady = true;
}
menuImage.src = "fpImages/menu.png"

// Background Image 1
var bg1Ready = false;
var bg1Image = new Image();
bg1Image.onload = function () {
	bg1Ready = true;
};
bg1Image.src = "fpImages/background1.png";

// Adventurer Image 
var adventurerReady = false;
var adventurerImage = new Image();
adventurerImage.onload = function () {
	adventurerReady = true;
};
adventurerImage.src = "fpImages/adventurer.png";

// Bat Image  
var batReady = false;
var batImage = new Image();
batImage.onload = function () {
	batReady = true;
};
batImage.src = "fpImages/bat.png";

// ############ Sounds ##############

// This is what allows certain sound files to play 
function sound(src) {
	// this creates the audio elements in the page 
	this.sound = document.createElement("audio")
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	};
	this.stop = function () {
		this.sound.pause();
	};
}

// ############ Game Objects #############
var adventurer = {
	name: "Indiana Jones",
	gravity: gravity,
	height: 26,
	width: 16,
	velX: 0,
	velY: 0,
	direction: 1,
	speed: 3, //movement in pixels per second
	// this adds friction which prevents the adventurer from sliding 
	coFriction: 0.1,
	friction: function () {
		if (this.velX > 0.5) {
			this.velX -= this.coFriction;
		}
		else if (this.velX < -0.5) {
			this.velX += this.coFriction;
		}
		else {
			this.velX = 0;
		}
	},
	// this function allows the adventurer to jump in the air and applies negative velocity to him
	grounded: true,
	jump: function () {
		this.velY -= 6;
	}
};

// this is what creates the bats in the screen for level 2
function Bat() {
	this.gravity = 2;
	this.x = (Math.random() * canvas.width - 100);
	this.y = (Math.random() * (canvas.width - 100));
	// this.velX = (Math.floor(Math.random()*10));
	// this.velY = (Math.floor(Math.random()*10));
	allBats.push(this);
}

// this is the function that creates the platforms
function Platform(x, y, w, h, direction, type) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.direction = direction;
	this.type = type;
	allPlatforms.push(this);
}

// this is the list of platform objects
var startingPlatform = new Platform(460, 400, 52, 2, 1, "normal");
var platform1 = new Platform(260, 400, 52, 2, 1, "moving");
var platform2 = new Platform(90, 400, 50, 2, 1, "normal");
var platform3 = new Platform(0, 320, 20, 2, 1, "normal");
var platform4 = new Platform(50, 250, 20, 2, 1, "normal");
var platform5 = new Platform(0, 175, 20, 2, 1, "normal");
var platform6 = new Platform(100, 100, 20, 2, 1, "normal");
var platform7 = new Platform(300, 200, 40, 2, 1, "moving");
var platform8 = new Platform(375, 120, 20, 2, 1, "normal");
var finalPlatform = new Platform(460, 70, 52, 2, 1, "normal");

// ############ Functions ##############

// this is the reset function for when the hero dies 
var reset = function () {
	deathAudio.play();
	adventurer.velY = 0;
	adventurer.velX = 0;
	adventurer.x = canvas.width - 30;
	adventurer.y = canvas.height - 120;
}

// this is what allows the character to move
var input = function () {
	// checks for user input
	if ("w" in keysDown && adventurer.grounded == true) { // Player holding up
		adventurer.jump();
		adventurer.grounded = false;
	}
	if ("a" in keysDown) { // Player holding left
		// adventurer.velX = -5;
		adventurer.velX = -adventurer.speed;
	}
	if ("d" in keysDown) { // Player holding right
		// adventurer.velX = 5;
		adventurer.velX = adventurer.speed;
	}
	if (" " in keysDown) {
		startLevel1 = true;
		startGame = false;
	}
};

// this allows me to push items into an array
function range(start, end) {
	var arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}

// ############ Update ###############  

var update = function () {
	// these are for the position of the adventurer 
	adventurer.y += adventurer.velY;
	adventurer.x += adventurer.velX;
	// conditional statements for the adventurer
	if (adventurer.x >= canvas.width - 20) {
		adventurer.x = canvas.width - 20;
		// console.log("he's off the screen...");
		// console.log(hero.x);
	}
	// // this conditional statement prevents the hero from staying off of the screen of the game on the left 
	if (adventurer.x <= 0) {
		adventurer.x = 0;
		// console.log("he's off the screen...");
		// console.log(hero.x);
	}
	// this prevents the hero from going off of the top of the screen
	if (adventurer.y <= 0) {
		adventurer.y = 0;
		// console.log("he's off the top of the screen...");
		// console.log(hero.y);
	}
	if (adventurer.y > canvas.height - 40 && startLevel1 == true) {
		// this restarts the adventurer from the beginning of the level
		++deaths;
		reset();
	}
	if (adventurer.y < canvas.height) {
		// console.log("he's in the air!...") 
		adventurer.velY += adventurer.gravity;
	}
	// if (adventurer.grounded == true) {
	// 	adventurer.velY = 0;
	// }

	// ############ Collision Detection #############

	for (plat in allPlatforms) {
		if (allPlatforms[plat].type == "moving") {
			allPlatforms[plat].velX = .5;
			allPlatforms[plat].x += allPlatforms[plat].velX * allPlatforms[plat].direction;
			if (allPlatforms[plat].x > canvas.width - allPlatforms[plat].w - 150 || allPlatforms[plat].x < 0) {
				allPlatforms[plat].direction = allPlatforms[plat].direction * -1;
			}
			if (allPlatforms[plat].x < canvas.width - allPlatforms[plat].w - 300 || allPlatforms[plat].x < 0) {
				allPlatforms[plat].direction = allPlatforms[plat].direction * -1;
			}
		}
		if (
			adventurer.x <= (allPlatforms[plat].x + allPlatforms[plat].w) &&
			allPlatforms[plat].x <= (adventurer.x + adventurer.width) &&
			adventurer.y <= (allPlatforms[plat].y + allPlatforms[plat].h) &&
			allPlatforms[plat].y <= (adventurer.y + adventurer.width) &&
			adventurer.velY > 0
		) {
			if (allPlatforms[plat].type == "moving") {
				adventurer.velX += allPlatforms[plat].velX * allPlatforms[plat].direction;
			}
			// this allows the hero to stand on the platform 
			adventurer.grounded = true;
			adventurer.velY = 0;
			adventurer.velX = 0;
			adventurer.y = allPlatforms[plat].y - adventurer.height;
		}
	}
};

	// ############ Render ###############
	var renderLevel1 = function () {
		if (bg1Ready && startLevel1 == true) {
			ctx.drawImage(bg1Image, 0, 0);
		}
		if (adventurerReady && startLevel1 == true) {
			ctx.drawImage(adventurerImage, adventurer.x, adventurer.y);
		}
		if (startLevel1 == true) {
			// this plays the lava audio whenever the first level starts
			lavaAudio.play();
		}
		for (plat in allPlatforms) {
			if (allPlatforms[plat].type == "normal") {
				ctx.fillStyle = "black";
			}
			if (allPlatforms[plat].type == "moving") {
				ctx.fillStyle = "blue";
			}
			ctx.fillRect(allPlatforms[plat].x, allPlatforms[plat].y, allPlatforms[plat].w, allPlatforms[plat].h);
		}
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Deaths: " + deaths, 16, 16);
	}

	var renderLevel2 = function () {

	}

	var renderMenu = function () {
		if (menuReady && startGame == true) {
			ctx.drawImage(menuImage, 0, 0)
		}
	}

	// ############ Main Loop Function ##############

	// this is run when the game starts
	var mainMenu = function () {
		now = Date.now();
		var delta = now - then;

		input(delta / 1000);
		update(delta / 1000);
		renderMenu();
		// then = now;

		// Request to do this again ASAP
		requestAnimationFrame(mainMenu);
	};

	// this is what runs when level 1 starts 
	var level1 = function () {
		now = Date.now();
		var delta = now - then;

		input(delta / 1000);
		if (startLevel1 == true) {
			update(delta / 1000);
		}
		renderLevel1();
		// then = now;

		// Request to do this again ASAP
		requestAnimationFrame(level1);
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	var then = Date.now();

	reset();
	level1();
	mainMenu();