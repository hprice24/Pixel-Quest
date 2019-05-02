//lovingly stolen from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
//...and modified heavily

// Create the canvas
// declares variable to hold the canvas object/API

//################ SETUP CANVAS ##################

//create the canvas element
var canvas = document.createElement("canvas");
//takes canvas gets its context and puts that value in the ctx variable
var ctx = canvas.getContext("2d");
// set canvas width height
canvas.width = 512;
canvas.height = 480;
//appends the canvas to the document object
document.body.appendChild(canvas);

//################ Global variables ##################
var monstersCaught = 0;
var now;
var delta;
var allMonsters = [];
// this creates an array for projectiles to be stored in 
var allProjectiles = [];
var wave = 10;
var explodeX;
var explodeY;
var shot = false;

// for animations
var timer;
var timerThen = Math.floor(Date.now() / 1000);
var timeToDie = 30;
var timerNow;
var currentTimer;
var countDown;

//################ Setting up images ##################
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// projectile image
var projectileReady = false;
var projectileImage = new Image();
projectileImage.onload = function () {
	projectileReady = true;
};

projectileImage.src = "images/fireball.png";

// explode image 
var explodeReady = false;
var explodeImage = new Image();
explodeImage.onload = function () {
	explodeReady = true;
};
explodeImage.src = "images/explode.png";

//################ Game Objects ##################
var hero = {
	name: "Joseph",
	gravity: 9.8,
	speed: 256, // movement in pixels per second
	// if the space bar is pressed these messages will show up in the console
	messages: ["Run away!", "Oh Nooooo!", "Your next line is:"],
	speak: function () {
		console.log(this.messages[randNum(3)]);
	},
	jump: function () {
		this.y -= 25;
	}
};

// this sets the gravity and the position for the monsters
function Monster(gravity, damage, life) {
	this.gravity = 100;
	// randomizes the x position of the monster when it spawns
	this.x = (Math.random() * canvas.width);
	this.y = 0;
	this.jump = function () {
		this.y = 0;
	}
	allMonsters.push(this);
}

// this is what specifies how the fireball functions
function Projectile() {
	this.speed = 25;
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;
	this.fired = false;
	allProjectiles.push(this);
}

// this creates new fireball objects to put it in the array 
var projectile = new Projectile();

// these are the different variables that will become the monsters in the game 
var Grendel = new Monster(9.8, 10, 5);
var Barney = new Monster(4, 1000, 100000);
var Homework = new Monster(1000, 10000, 25);

console.log(Grendel.gravity);

//################ Setup Keyboard controls ##################
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

//################ Functions ##################
var reset = function () {
	// hero.x = canvas.width / 2;
	// hero.y = canvas.height / 2;
	hero.x = canvas.width - 64;
	hero.y = canvas.height - 64;

	// Throw the monster somewhere on the screen randomly
	Monster.x = 32 + (Math.random() * (canvas.width - 64));
	Monster.y = 32 + (Math.random() * (canvas.height - 64));
	monsterWave(100);
};
// generate random number
var randNum = function (x) {
	return Math.floor(Math.random() * x);
};
//speedup hero
var speedUp = function (x) {
	hero.speed += x;
};

// this allows the hero to move according to key commands
var input = function (modifier) {
	// checks for user input
	if ("w" in keysDown) { // Player holding up
		// hero.y -= hero.speed * modifier;\
		hero.jump();
	}
	if ("s" in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if ("a" in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if ("d" in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	if (" " in keysDown) { // Player holding right
		hero.speak();
		projectile.fired = true;
	}
}

//this function populates an array using a range of values
function range(start, end) {
	var arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}
//this function creats a wave of monsters that are spawned at the beginning of the game 
function monsterWave(wave) {
	for (monster in range(1, wave)) {
		// "monster" is a new variable that is related to "Monster", JS is case sensitive
		monster = new Monster();
	}
}

// ############ Update ############
var update = function (modifier) {
	// this allows the projectile to be fired
	if (projectile.fired == true) {
		projectile.y -= projectile.speed;
	}
	if (projectile.y < 0) {
		projectile.fired = false;
	}
	if (projectile.fired == false) {
		projectile.x = hero.x;
		projectile.y = hero.y;
	}
	// these are the updates!!!!
	// these are the jump conditions
	if (hero.y > canvas.height) {
		// console.log("he fell of the screen...")
		hero.y = 448;
		hero.gravity = 0;
	}
	if (hero.y < canvas.height - 32) {
		// console.log("he's in the air!...")
		hero.gravity = 9.8;
	}
	// this conditional statement prevents the hero from staying off of the screen of the game on the right
	if (hero.x >= canvas.width - 32) {
		hero.x = canvas.width - 32;
		console.log("he's off the screen...");
		console.log(hero.x);
	}
	// // this conditional statement prevents the hero from staying off of the screen of the game on the left 
	if (hero.x <= 0) {
		hero.x = 0;
		console.log("he's off the screen...");
		console.log(hero.x);
	}
	// this prevents the hero from going off of the top of the screen
	if (hero.y <= 0) {
		hero.y = 0;
		console.log("he's off the top of the screen...");
		console.log(hero.y);
	}
	// // this allows the monster to wrap around when it goes off the bottom of the screen
	// if (Monster.y > canvas.height) {

	// 	Monster.y = 0;
	// }
	// // this is where the gravity is applied to the monster
	// Monster.y += Monster.gravity;
	// // this is where the gravity is applied to the hero
	// hero.y += hero.gravity;
	for (monster in allMonsters) {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(allMonsters[monster].x, allMonsters[monster].y, allMonsters[monster].hitpoints * 5, 50);
		if (allMonsters[monster].y <= canvas.height) {
			allMonsters[monster].y += allMonsters[monster].gravity * modifier;
		}
		if (allMonsters[monster].y > canvas.height) {
			allMonsters[monster].jump();
			allMonsters[monster].x = randNum(canvas.width);
		}
		// console.log(allMonsters[monster.x]);
		// 	// Collision detection
		// 	if (
		// 		hero.x <= (monster.x + 32)
		// 		&& monster.x <= (hero.x + 32)
		// 		&& hero.y <= (monster.y + 32)
		// 		&& monster.y <= (hero.y + 32)
		// 	) {
		// 		++monstersCaught;
		// 		reset();
		// 	}
		// };

		for (monster in allMonsters) {
			if (
				hero.x <= (allMonsters[monster].x + 64) &&
				allMonsters[monster].x <= (hero.x + 64) &&
				hero.y <= (allMonsters[monster].y + 64) &&
				allMonsters[monster].y <= (hero.y + 64)
			) {
				hero.hitpoints -= 15;
				allMonsters.splice(monster, 1);
				// console.log("collision");
				// console.log(allMonsters);
				// console.log(allMonsters);
			}
			// this is for the collision of the projectile
			if (
				projectile.x <= (allMonsters[monster].x + 32) &&
				allMonsters[monster].x <= (projectile.x + 32) &&
				projectile.y <= (allMonsters[monster].y + 32) &&
				allMonsters[monster].y <= (projectile.y + 32)
			)
			// if (projectile.type == "fire") 
			{
				shot = true;
				++monstersCaught;
				timeToDie += 5;
				explodeX = allMonsters[monster].x;
				explodeY = allMonsters[monster].y;
				// console.log(monster);
				// console.log("shot monster");
				allMonsters.splice(monster, 1);
				// console.log(allMonsters);
			}
			// this creates the timer which will reset the game when it ends
			timerNow = Math.floor(Date.now() / 1000);
			currentTimer = timerNow - timerThen;
			countDown = timeToDie - currentTimer;
		}
		if (countDown < 0) {
			alert("times up");
		}
		if (allMonsters.length == 0) {
			console.log("next wave is ready!");
			monsterWave(wave);
			monsterWave += 10;
		}
	}
}; //end of update function

// ########### Render #############
// this is what draws the things displayed in the game onto the canvas
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (projectileReady) {
		ctx.drawImage(projectileImage, projectile.x, projectile.y);
		// console.log("it works");
	}
	// if (monsterReady) {
	// 	ctx.drawImage(monsterImage, monster.x, monster.y);
	// }
	//render monsters
	if (monsterReady) {
		for (monster in allMonsters) {
			ctx.drawImage(monsterImage, allMonsters[monster].x, allMonsters[monster].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	// frames
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	// this is the code that places the text for the clock in the coordinates listed below
	ctx.fillText("Time Left: " + countDown, 256, 32);
};

// this sets the clock at the beginning of the game to zero 
var tick = 0

// this is the function which allows the clock at the top right of the news to work 
var ticker = function () {
	var now = Date.now();
	var delta = now - then;
	tick = tick + delta;
	// this ensures that the numbers displayed at the top are whole numbers
	return Math.floor(tick / 1000)
}

// ############# Main loop function ###############
var main = function () {
	now = Date.now();
	var delta = now - then;

	input(delta / 1000);
	update(delta / 1000);
	render();
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// have to define the delta variable outside of the loop for it to work 
reset();
main();