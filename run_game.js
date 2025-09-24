const canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let platforms = [[10, 0, [0, 0, 255]], [408, 0, [0, 0, 255]], [806, 0, [0, 0, 255]], [1204, 0, [0, 0, 255]]];

let posx = 0;
let posy = 0;

let vely = 0;

let color = [0, 0, 255];

let keys = {};
let mouse = { x: 0, y: 0, held: [false, false, false] };

let height = 0;

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function draw_circle(x, y, radius, color) {
  ctx.fillStyle = color;        // color
  ctx.beginPath();              // start a new path
  ctx.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("touchstart", e => {
  let t = e.touches[0];
  mouse.x = t.clientX - canvas.getBoundingClientRect().left;
  mouse.y = t.clientY - canvas.getBoundingClientRect().top;
  mouse.held[0] = true;
  e.preventDefault();
});

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("touchmove", e => {
  let touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  mouse.x = touch.clientX - rect.left;
  mouse.y = touch.clientY - rect.top;
  e.preventDefault();
});

canvas.addEventListener("touchend", e => {
  mouse.held[0] = false;
  e.preventDefault();
});

canvas.addEventListener("mousedown", e => mouse.held[e.button] = true);
canvas.addEventListener("mouseup", e => mouse.held[e.button] = false);

let running = true;
function loop() {
  if (!running) return;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (keys["a"] || mouse.held[0] || mouse.x) {
    let a = 1;
  }

  for (let i = 0; i < color.length; i++) {
    color[i] += Math.random()*10 - 5;
    color[i] = Math.min(255, color[i]);
    color[i] = Math.max(0, color[i]);
  }

  height += Math.random()*20 - 10;

  posx += posx/10000 + 7;
  posy += vely;

  vely += 0.5;

  let n = true;

  for (let i of platforms) {
    if (i[0] > posx + 1200) {
      n = false;
    }
    if (i[0] < posx && posx < i[0] + 400 && posy > i[1]) {
      if (posy > i[1] + 20) {
        running = false;
      } else {
        posy = i[1];
        vely = 0;
        if (mouse.held[0]) {
          vely = -10;
        }
      }
    }
  }

  if (n) {
    platforms.push([posx + 1600 - posx/10000 - 7, height, color.slice()]);
  }


  for (let i of platforms) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0] - posx + 600, i[1] - posy + 300, 400, 600);
  };

  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.fillRect(580, 280, 20, 20);

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Score " + String(Math.floor(posx/10)), 0, 50);
  

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
