// variables 

var mouseX = 0
var mouseY = 0

// functions 

function playButton(xL, xR, yT, yB) {
	this.xLeft = xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
}

// will need to change this once I add a button
var playButton = new playButton(30, 400, 0, 480);

function checkClicked() {
	if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= MouseY && MouseY <= this.yBottom) return true;
}

function mouseClicked(e) {
	MouseX = e.playButton;
	MouseY = e.playbutton;
	// MouseX = e.pageX - canvas.offsetLeft;
	// MouseY = e.pageY - canvas.offsetTop;
	if (checkClicked() == true) level1();
}

document.addEventListener("click", mouseClicked, false);