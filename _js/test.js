console.log("Hello World!");
// The var tag specifies a variable in the js, a variable is a label with a value
var x = 42;
// variables have to start with a letter can have "y1" can't have "1y"
x = 543;
var y = 54;
var z = x + y;
var myVariable = 'Bobby';
var myOthervariable = ' Boy';
var heroHitpoints = 100;
var heroName = "Cronk";
var heroClass = "Barbarian";
console.log(x + y);
console.log(myVariable + myOthervariable)
// alert(z);

console.log(Math.floor(Math.random()*20));

// functions are one of the most powerful tools that we will use in JS, these are specified by the function tag
// in this function "square" is the name and the variable is "x"
const square = function (x) {
    return x * x;
};

console.log(square(12));
    // ---> 144

var myHeading = document.querySelector('h1');
myHeading.textContent = (Math.floor(Math.random()*20)+1);