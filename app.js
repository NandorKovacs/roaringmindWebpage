let ctx;
let width = 3840;
let height = 2160;

function main() {
  console.log("main");
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  const cnvs = document.getElementById("cnvs");

  cnvs.style.width = `${windowX}px`;
  cnvs.style.height = `${windowY}px`;

  ctx = cnvs.getContext("2d");


  // figure =

    requestAnimationFrame(frame);
}


let frameCount = 0;
let stepFrequency = 20;

function frame() {
  if (frameCount % 60 / stepFrequency == 0 && !initiated) {
    nextStep();
  }
  draw();
  requestAnimationFrame(frame);
}

function draw() {
  ctx.beginPath();


  for (let l of figure) {
    ctx.moveTo(l.a.x, l.a.y);
    ctx.lineTo(l.b.x, l.b.y);
  }

  ctx.stroke();
}

class Triangle {
  constructor(size, origin, rotation) {
    this.a = new Coordinate(origin.x, origin.y);
    this.b = new Coordinate(Math.cos(rotation * (Math.PI / 180)) * size + origin.x, Math.sin(rotation * (Math.PI / 180)) * size * -1 + origin.y);
    rotation += 60;
    this.c = new Coordinate(Math.cos((rotation) * (Math.PI / 180)) * size + origin.x, Math.sin(rotation * (Math.PI / 180)) * size * -1 + origin.y);
  }
}

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let figure = [];

let initiated = false;
let maxSteps = 5;
let currentSteps = 0;


function nextStep() {
  if (!initiated) {
    initiate();
  }

  if (currentSteps >= maxSteps) {
    return;
  }

  let newFigure = [];
  for (let l of figure) {
    let firstThird = getThird(l, 0);
    let secondThird = getThird(l, 1);
    let thirdThird = getThird(l, 2);
  
    newFigure.push(firstThird);
    newFigure.push(thirdThird);
  
    let triangle = new Triangle(getLineSize(secondThird), secondThird.a, getLineRotation(secondThird));

    newFigure.push(new Line(triangle.a, triangle.c));
    newFigure.push(new Line(triangle.c, triangle.b));
  }

  figure = newFigure;
  ++currentSteps;
}

function getLineSize(l) {
  return Math.sqrt(Math.pow(Math.abs(l.a.x - l.b.x), 2), Math.pow(Math.abs(l.a.y - l.b.y), 2));
}

function getLineRotation(l) {
  return Math.atan(Math.abs(l.a.x - l.b.x) / Math.abs(l.a.y, l.b.y));
}

function initiate() {
  let triangle = new Triangle(3840 / 3, new Coordinate(3840 / 3, 2160 / 4 * 3), 90);

  figure.push(new Line(triangle.a, triangle.b));
  figure.push(new Line(triangle.b, triangle.c));
  figure.push(new Line(triangle.c, triangle.a));

  initiated = true;
}

window.onload = main;
