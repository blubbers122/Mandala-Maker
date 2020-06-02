
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
var thickness = 8
var color = "#000000"
var sides = 1
var lines = [[],[],[],[]]

window.onresize = updateCanvasDimensions

function updateCanvasDimensions() {

  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth
}

function updateThickness(newThickness) {
  thickness = newThickness
}

function updateSides(value) {
  sides = parseInt(value)
}

function updateColor(newColor, mode) {
  var hexValue = (newColor * 256**2).toString(16).slice(0,2)
  if (hexValue == "0") hexValue = "00"
  color = color.slice(1)
  if (mode == "r") {
    color = "#" + hexValue + color.slice(2,6)
  }
  else if (mode == "g") {
    color = "#" + color.slice(0,2) + hexValue + color.slice(4,6)
  }
  else if (mode == "b") {
    color = "#" + color.slice(0,4) + hexValue
  }
  else {
    color = newColor
  }
  hexDisplay = document.querySelector("#hex-input")
  hexDisplay.value = color
}

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

function startPosition(e){
  drawing = true;
  // firstLine.push([e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop])
  // secondLine.push([canvas.width - e.clientX + canvas.offsetLeft, e.clientY - canvas.offsetTop])
  // thirdLine.push([e.clientX - canvas.offsetLeft, canvas.height - e.clientY + canvas.offsetTop])
  // fourthLine.push([canvas.width - e.clientX + canvas.offsetLeft, canvas.height - e.clientY + canvas.offsetTop])
  lines.forEach((line, i) => {
    sides < 3 ? line.push(oneOrTwoSides(i, e.clientX, e.clientY)) : line.push(ThreeOrMoreSides(i, e.clientX, e.clientY))
  });
  draw(e);
}

function finishedPosition(){
  drawing = false
  ctx.beginPath();
  lines = [[],[],[],[]]
  console.log(lines)
}

// make dict of functions to return x or y value based on index and sides

function oneOrTwoSides(i, xPos, yPos) {
  if (i == 0 || i == 2) {
    var x = xPos - canvas.offsetLeft
  }
  else {
    var x = canvas.width - xPos + canvas.offsetLeft
  }
  if (i == 0 || i == 1) {
    var y = yPos - canvas.offsetTop
  }
  else {
    var y = canvas.height - yPos + canvas.offsetTop
  }
  return [x,y]
}

function ThreeOrMoreSides(i, xPos, yPos) {

}


function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = thickness
  ctx.strokeStyle = color
  ctx.lineCap = "round";

  for (i = 0; i < sides * 2; i++) {
    var coords = oneOrTwoSides(i, e.clientX, e.clientY)
    lines[i].push([coords[0], coords[1]])
    ctx.moveTo(lines[i][lines[i].length-2][0], lines[i][lines[i].length-2][1])
    ctx.lineTo(coords[0],coords[1])
    ctx.stroke();
  }
}

canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishedPosition)
canvas.addEventListener("mouseleave", finishedPosition)
canvas.addEventListener("mousemove", draw)

updateCanvasDimensions()
