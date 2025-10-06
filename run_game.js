const canvas = document.createElement("canvas");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let last = performance.now();

let length = 400;

let explosions = [];

let color = [Math.random()*255, Math.random()*255, Math.random()*255];

let platforms = [[10, 0, color.slice(), 400, []], [408, 0, color.slice(), 400, []], [806, 0, color.slice(), 400, []], [1204, 0, color.slice(), 400, []]];

let background = [];

let posx = 0;
let posy = 0;

let vely = 0;

let height = 0;

let render1 = false;


let keys = {};
let mouse = { x: 0, y: 0, held: [false, false, false] };

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function only_positive(numb) {
  if (numb >= 0) {
    return numb;
  } else {
    return 0;
  }
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function draw_circle(x, y, radius, color1) {
  ctx.fillStyle = color1;        // color
  ctx.beginPath();              // start a new path
  ctx.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;
});

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

let dt = 0.016;

let start = true;

let time1 = 0;

let stage = "menue";

let running = true;
function loop() {
  if (!running) return;

  let now = performance.now();
  let dt_now = (now - last) / 1000; // seconds since last frame
  last = now;

  if (dt_now > 1/20) dt_now = 1/60;

  if (time1 == 0) dt = dt_now;
  if (time1 > 0 && time1 < 10) dt = dt*0.75 + dt_now*0.25;


  time1 += 1;

  if (start) {
    length = 400;

    explosions = [];

    color = [Math.random()*255, Math.random()*255, Math.random()*255];

    platforms = [[10, 0, color.slice(), 400, []], [408, 0, color.slice(), 400, []], [806, 0, color.slice(), 400, []], [1204, 0, color.slice(), 400, []]];

    background = [];

    posx = 0;
    posy = -1000;

    vely = 0;

    height = 0;
    start = false;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);



  // PLAY MODE
  
  if (stage === "play") {

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
    background.push([1800, Math.random()*600 + posy/a, color.slice(), a]);
  }

  if (background.length > 0) {
    for (let i = 0; i < background.length; i++) {
      if (explosions.length === 0) background[i][0] -= background[i][3]/20*(posx/5000 + 4)/5*dt*60;
      if (background[i][0] < -i[3]) {
        background.splice(i, 1);
      }
    }
  }

  if (explosions.length === 0) posx += (posx/5000 + 5.5)*dt*60;
  if (explosions.length === 0) posy += vely*dt*60;

  vely += 0.6*dt*60;

  let n = true;

  for (let i of platforms) {
    if (i[0] + length + i[3] > posx + 1200) {
      n = false;
    }
    if (i[0] < posx && posx < i[0] + i[3] + 20 && posy > i[1] && explosions.length === 0) {
      if (posy > i[1] + 10 + only_positive(vely)) {
        for (let i = 0; i < 50; i++) {
          let angle = Math.random()*100;
          explosions.push([600, 400, Math.sin(angle)*Math.random()*15 + posx/5000 + 4, Math.cos(angle)*Math.random()*15])
        }
      } else {
        posy = i[1];
        vely = 0;
        if (mouse.held[0]) {
          vely = -13;
        }
      }
      for (let j of i[4]) {
        if (posx > j + i[0] - 20 && posx < j + i[0] + 20 && posy > i[1] - 20) {
          for (let i = 0; i < 50; i++) {
            let angle = Math.random()*100;
            explosions.push([600, 400, Math.sin(angle)*Math.random()*15 + posx/5000 + 4, Math.cos(angle)*Math.random()*15])
          }
        }
      }
    }
    if (i[0] < posx - 2000) {
      platforms.splice(platforms.indexOf(i), 1);
    }
  }

  if (mouse.x < 100 && mouse.y > 100 && mouse.y < 200 && mouse.held[0]) {
      stage = "paused";
  }

  if (n) {
    height += Math.random()*150 - 75;
    if (Math.random() < 0.25) {
      void_length = Math.random()*100 + 50;
    } else {
      void_length = 0;
    }
    
    if (Math.random() > 0.25) {
      platforms.push([posx - length + 1200 - 15, height, color.slice(), length, []]);
    } else {
      platforms.push([posx - length + 1200 - 15 + void_length, height, color.slice(), length - void_length, [length/2 - void_length/2]]);
    }
    length = Math.random()*400 + 100;
  }
  render1 = true;
  }

  //PAUSED

  if (stage == "paused") {
    if (1100 < mouse.x && mouse.y < 100 && mouse.held[0]) {
      stage = "menue";
      start = true;
    }
    if (550 < mouse.x && mouse.x < 650 && 250 < mouse.y && mouse.y < 350 && mouse.held[0]) {
      stage = "play";
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(1100, 0, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Main Menue", 1125, 50);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 250, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Unpause", 575, 300);

    render1 = true;
  }


  // MAIN MENUE

  if (stage == "menue") {

    for (let i = 0; i < color.length; i++) {
    color[i] += (Math.random()*10 - 5)*dt*60;
    color[i] = Math.min(255, color[i]);
    color[i] = Math.max(0, color[i]);
    }

    if (Math.random() < 0.15*dt*60) {
      let a = Math.random()*100;
      background.push([1400, Math.random()*600 + posy/a, color.slice(), a]);
    }

    if (background.length > 0) {
      for (let i = 0; i < background.length; i++) {
        if (explosions.length === 0) background[i][0] -= background[i][3]/20*(posx/5000 + 4)*dt*60;
        if (background[i][0] < -i[3]) {
            background.splice(i, 1);
        }
      }
    }

    for (let i of background) {
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
    };
    
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(580, 420, 20, 20);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 424, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(592, 424, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 432, 12, 4);
    
    ctx.fillStyle = "rgb(" + Math.random()*255 + "," + Math.random()*255 + ","  + Math.random()*255 + ")";          // text color
    ctx.font = "100px Arial";          // font size and family
    ctx.fillText("Star Runner", 350, 300);

    ctx.fillStyle = "rgb(128, 0, 255)";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("By Michael Alexander Kaszynski", 500, 350);

    
    if (550 < mouse.x && mouse.x < 650 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play", 575, 500);
  }


  // RENDER GRAPICS IF REQUIRED
  
  if (render1) {

  for (let i of background) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
  };

  for (let i of platforms) {
    ctx.fillStyle = "rgb(" + (255 - (255 - i[2][0])*0.7) + "," + (255 - (255 - i[2][1])*0.7) + "," + (255 - (255 - i[2][2])*0.7) + ")";
    ctx.fillRect(i[0] - posx + 600 - 5, i[1] - posy + 400, i[3] + 10, 1200);
  };

  for (let i of platforms) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0] - posx + 600, i[1] - posy + 400 + 5, i[3], 1200);

    for (let j of i[4]) {
      ctx.beginPath();
      ctx.moveTo(i[0] - posx + 600 + j, i[1] - posy + 400 + 5 - 30);   // top vertex
      ctx.lineTo(i[0] - posx + 600 + j + 15, i[1] - posy + 400 + 5);  // bottom-right
      ctx.lineTo(i[0] - posx + 600 + j - 15, i[1] - posy + 400 + 5);   // bottom-left
      ctx.closePath();
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fill(); // or ctx.stroke() for outline
    }
  };

  for (let i of explosions) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(i[0], i[1], 10, 10);
  };

  if (explosions.length === 0) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(580, 380, 20, 20);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 384 + vely/6, 4, 4 - vely/8);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(592, 384 + vely/6, 4, 4 - vely/8);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 392, 12, 4);
  }

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Score " + String(Math.floor(posx/10)), 0, 50);

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText("Speed " + String(Math.floor(posx/5000 + 4)), 0, 100);

  if (stage == "play") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(0, 100, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Pause", 25, 150);
    }
  }

  render1 = false;

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
