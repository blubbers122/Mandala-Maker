
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
var thickness = 8
var color = "#000000"
var sides = 1
var lines = [[],[],[],[]]
var centerX = canvas.width / 2 + canvas.offsetLeft
var centerY = canvas.height / 2 + canvas.offsetTop

window.onresize = updateCanvasDimensions

function updateCanvasDimensions() {

  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth
  centerX = canvas.width / 2 + canvas.offsetLeft
  centerY = canvas.height / 2 + canvas.offsetTop
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
  drawing = true
  lines.forEach((line, i) => {
    sides < 3 ? line.push(oneOrTwoSides(i, e.clientX, e.clientY)) : line.push(threeOrMoreSides(i, angle, e.clientX, e.clientY))
  });
  draw(e);
}

function finishedPosition(){
  drawing = false
  ctx.beginPath();
  lines = [[],[],[],[],[],[],[],[]]
}

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

function threeOrMoreSides(i, angle, xPos, yPos) {
  var x, y
  var distanceFromOrigin = Math.hypot(x, y)
  x = distanceFromOrigin * Math.cos(angle) + centerX
  y = distanceFromOrigin * Math.sin(angle) + centerY
  console.log(distanceFromOrigin)

  console.log(x)
  console.log(y)
  console.log(angle)
  // coords of mouse
  if (i == 0) {
    x = xPos - centerX
    y = yPos - centerY



    return [xPos, yPos]
  }
  // coords of each rotation
  else if (i < 4){
    x = distanceFromOrigin * Math.cos(angle) + centerX
    y = distanceFromOrigin * Math.sin(angle) + centerY
    //change to return raw x and y
    return [x, y]
  }
  else {
    // for each reflection
    return [0, 0]
  }

}

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = thickness
  ctx.strokeStyle = color
  ctx.lineCap = "round";

  var mouseX = e.clientX
  var mouseY = e.clientY

  if (sides < 3) {
    for (let i = 0; i < sides * 2; i++) {
      var coords = oneOrTwoSides(i, mouseX, mouseY)
      lines[i].push([coords[0], coords[1]])
      ctx.moveTo(lines[i][lines[i].length-2][0], lines[i][lines[i].length-2][1])
      ctx.lineTo(coords[0],coords[1])
      ctx.stroke();
    }
  }
  else {
    var angle = Math.atan((mouseY - centerY) / (mouseX - centerX))
    console.log("angle is " + toString(angle))
    var sliceSize = (360 / sides) * Math.pi/180
    for (let i = 0; i < sides * 2; i++) {
      var coords = threeOrMoreSides(i, angle, mouseX, mouseY)
      lines[i].push([coords[0], coords[1]])
      ctx.moveTo(lines[i][lines[i].length-2][0], lines[i][lines[i].length-2][1])
      ctx.lineTo(coords[0],coords[1])
      ctx.stroke();
      angle += sliceSize
    }
  }
}

canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishedPosition)
canvas.addEventListener("mouseleave", finishedPosition)
canvas.addEventListener("mousemove", draw)

updateCanvasDimensions()
