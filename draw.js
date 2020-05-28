
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let drawing = false;
var thickness = 1
var color = "#000000"
var sides = 1

canvas.height = canvas.offsetHeight
canvas.width = canvas.offsetWidth

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
  draw(e);
}

function finishedPosition(){
  drawing = false
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;
  var lines = []

  ctx.lineWidth = thickness
  ctx.strokeStyle = color
  ctx.lineCap = "round";
  for (i = 0; i < sides; i++) {
    if (i == 0) {
      var x = e.clientX - canvas.offsetLeft
      var y = e.clientY - canvas.offsetTop
    }
    else {
      var x = canvas.width - e.clientX + canvas.offsetLeft
      var y = canvas.height - e.clientY + canvas.offsetTop
      ctx.moveTo()
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.moveTo(prevX, prevY)
  }


}

canvas.addEventListener("mousedown", startPosition)
canvas.addEventListener("mouseup", finishedPosition)
canvas.addEventListener("mousemove", draw)
