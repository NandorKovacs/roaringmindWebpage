const canvas = document.getElementById("canvas");

let ctx;
let width = 3840;
let height = 2160;
let figure = [];


function main() {
  ///
  // Window & Canvas size
  width = window.innerWidth * window.devicePixelRatio;
  height = window.innerHeight * window.devicePixelRatio;

  canvas.width = width;
  canvas.height = height;

  ctx = canvas.getContext("2d");

  ///
  // Initial figure
  const size = Math.min(width / 3, height / 2);
  const triangle = new Triangle(size, new Coordinate(width / 2 - size / 2, height / 2 - size / 3), 0);

  figure.push(new Line(triangle.a, triangle.b));
  figure.push(new Line(triangle.b, triangle.c));
  figure.push(new Line(triangle.c, triangle.a));

  ///
  // Go!
  requestAnimationFrame(frame);
}

function frame() {
  draw();
  requestAnimationFrame(frame);
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();

  for (const l of figure) {
    // TODO: optimizacio. Mivel egy zart gorbet rajzolunk, nem kell a moveTo
    ctx.moveTo(l.a.x, l.a.y);
    ctx.lineTo(l.b.x, l.b.y);
  }

  ctx.stroke();
}

class Triangle {
  constructor(size, origin, rotation) {
    this.a = origin;
    this.b = new Coordinate(Math.cos(rotation * (Math.PI / 180)) * size + origin.x, Math.sin(rotation * (Math.PI / 180)) * size + origin.y);
    rotation += 60;
    this.c = new Coordinate(Math.cos(rotation * (Math.PI / 180)) * size + origin.x, Math.sin(rotation * (Math.PI / 180)) * size + origin.y);
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


function nextStep() {

  const newFigure = [];
  for (const l of figure) {
    const [firstThird, secondThird, thirdThird] = getThirds(l);

    newFigure.push(firstThird);
    newFigure.push(thirdThird);

    const triangle = new Triangle(getLineLength(secondThird), secondThird.a, getLineAngle(secondThird) - 60);

    newFigure.push(new Line(triangle.a, triangle.b));
    newFigure.push(new Line(triangle.b, triangle.c));
  }

  figure = newFigure;
  console.log(figure.length);
}

function getLineLength(l) {
  return Math.sqrt(Math.pow(l.a.x - l.b.x, 2) + Math.pow(l.a.y - l.b.y, 2));
}

function getLineAngle(l) {
  return Math.atan2(l.b.y - l.a.y, l.b.x - l.a.x) / Math.PI * 180;
}

function getThirds(l) {
  const xl = (l.b.x - l.a.x) / 3;
  const yl = (l.b.y - l.a.y) / 3;

  const aab = new Coordinate(l.a.x + xl, l.a.y + yl);
  const abb = new Coordinate(l.a.x + 2 * xl, l.a.y + 2 * yl);

  return [
    new Line(l.a, aab),
    new Line(aab, abb),
    new Line(abb, l.b)
  ];
}

document.addEventListener('keydown', (event) => {
  if (event.key == " ") {
    nextStep();
  }
}, false);

window.onload = main;
