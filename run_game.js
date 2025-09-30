const canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let last = performance.now();
let xm = 0;

let length = 400;

let explosions = [];

let color = [Math.random()*255, Math.random()*255, Math.random()*255];

let platforms = [[10, 0, color.slice(), 400], [408, 0, color.slice(), 400], [806, 0, color.slice(), 400], [1204, 0, color.slice(), 400]];

let background = [];

let posx = 0;
let posy = 0;

let vely = 0;

let height = 0;


let keys = {};
let mouse = { x: 0, y: 0, held: [false, false, false] };

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function draw_circle(x, y, radius, color1) {
  ctx.fillStyle = color1;        // color
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

let start = true;

let running = true;
function loop() {
  if (!running) return;

  let now = performance.now();
  let dt = (now - last) / 1000; // seconds since last frame
  last = now;

  if (dt > 1) dt = 1/60;

  if (start) {
    length = 400;

    explosions = [];

    color = [Math.random()*255, Math.random()*255, Math.random()*255];

    platforms = [[10, 0, color.slice(), 400], [408, 0, color.slice(), 400], [806, 0, color.slice(), 400], [1204, 0, color.slice(), 400]];

    background = [];

    posx = 0;
    posy = 0;

    vely = 0;

    height = 0;
    start = false;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < color.length; i++) {
    color[i] += (Math.random()*10 - 5)*dt*60;
    color[i] = Math.min(255, color[i]);
    color[i] = Math.max(0, color[i]);
  }

  if (explosions.length > 0) {
    for (let i = 0; i < explosions.length; i++) {
      explosions[i][0] += explosions[i][2]*dt*60;
      explosions[i][1] += explosions[i][3]*dt*60;
      explosions[i][3] += 0.5;
      if (explosions[i][1] > 10000) {
        start = true;
      }
    }
  }

  if (Math.random() < 0.05*dt*60) {
    let a = Math.random()*100;
    background.push([1200, Math.random()*600 + posy/a, color.slice(), a]);
  }

  if (background.length > 0) {
    for (let i = 0; i < background.length; i++) {
      if (explosions.length === 0) background[i][0] -= background[i][3]/20*(posx/5000 + 4)/5*dt*60;
      if (background[i][0] < -i[3]) {
        background.splice(i, 1);
      }
    }
  }

  if (explosions.length === 0) posx += (posx/5000 + 7)*dt*60;
  if (explosions.length === 0) posy += vely;

  vely += 0.5*(dt*60)**2;

  let n = true;

  for (let i of platforms) {
    if (i[0] + length + i[3] > posx + 1200) {
      n = false;
    }
    if (i[0] < posx && posx < i[0] + i[3] && posy > i[1] && explosions.length === 0) {
      if (posy > i[1] + 10) {
        for (let i = 0; i < 50; i++) {
          let angle = Math.random()*100;
          explosions.push([600, 400, Math.sin(angle)*Math.random()*15 + posx/5000 + 4, Math.cos(angle)*Math.random()*15])
        }
      } else {
        posy = i[1];
        vely = 0;
        if (mouse.held[0]) {
          vely = -10*(dt*60);
        }
      }
    }
    if (i[0] < posx - 2000) {
      platforms.splice(platforms.indexOf(i), 1);
    }
  }

  if (vely > 10) {
    vely = 10;
  }

  if (n) {
    height += Math.random()*150 - 75
    platforms.push([posx - length + 1200 - 15, height, color.slice(), length]);
    length = Math.random()*400 + 100;
  }

  for (let i of background) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
  };

  for (let i of platforms) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0] - posx + 600, i[1] - posy + 400, i[3], 1200);
  };

  for (let i of explosions) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(i[0], i[1], 10, 10);
  };

  if (explosions.length === 0) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(580, 380, 20, 20);
  }

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Score " + String(Math.floor(posx/10)), 0, 50);

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Speed " + String(Math.floor(posx/5000 + 4)), 0, 100);
  

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
