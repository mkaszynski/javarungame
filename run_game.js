const canvas = document.createElement("canvas");
canvas.width = 1400;
canvas.height = 700;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const scale = window.devicePixelRatio || 1;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px" + 100;
  canvas.width = w * scale;
  canvas.height = h * scale + 100;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

let skins = {red:true, orange:false, yellow:false, green:false, blue:false, purple:false, white:false, gray:false, gold:false, black:false, rainbow:false}

if (localStorage.getItem("unlocks") == null) {
  localStorage.setItem("unlocks", JSON.stringify(skins));
}

if (localStorage.getItem("plays") == null) {
  localStorage.setItem("plays", 0);
}

skins = JSON.parse(localStorage.getItem("unlocks"));

if (!("gray" in skins)) skins.gray = false;
if (!("gold" in skins)) skins.gold = false;
if (!("black" in skins)) skins.black = false;
if (!("rainbow" in skins)) skins.rainbow = false;

delete skins["grey"];

//resize();
//window.addEventListener("resize", resize);

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

function dis3d(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  const z = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y + z);
}

function color_sort(color) {
  let colors = [];
  colors.push([[128, 0, 255], "purple"]);
  colors.push([[0, 0, 225], "blue"]);
  colors.push([[0, 255, 255], "cyan"]);
  colors.push([[0, 225, 0], "green"]);
  colors.push([[255, 255, 0], "yellow"]);
  //colors.push([[255, 128, 0], "orange"]);
  colors.push([[225, 0, 0], "red"]);
  colors.push([[255, 0, 255], "pink"]);
  colors.push([[255, 255, 255], "white"]);
  //colors.push([[100, 100, 100], "grey"]);
  colors.push([[0, 0, 0], "black"]);
  
  let m = "";
  let n = 1000;
  for (i of colors) {
    if (dis3d(i[0], color) < n) {
      n = dis3d(i[0], color);
      m = i[1];
    }
  }
  return m;
}

function set_parameters_plat(color) {
  let col_str = color_sort(color);
  let he = 75;
  let sp = 0.15;
  let voi = 0.15;
  if (col_str == "green") {
    he = 25;
    voi = 0;
    sp = 0.2;
  }
  if (col_str == "blue") {
    he = 100;
    voi = 0;
    sp = 0;
  }
  if (col_str == "red" || col_str == "orange") {
    he = 75;
    voi = 0;
    sp = 0.3;
  }
  if (col_str == "yellow") {
    he = 75;
    voi = 0.4;
    sp = 0;
  }
  if (col_str == "black") {
    he = 100;
    voi = 0.5;
    sp = 0.5;
  }
  if (col_str == "white") {
    he = 25;
    voi = 0;
    sp = 0;
  }
  if (col_str == "purple" || col_str == "pink") {
    he = 25;
    voi = 0;
    sp = 0.3;
  }
  return [he, voi, sp];
}

let games_played = parseInt(localStorage.getItem("plays"), 10);

let time1 = 0;

function give_unlock(str_col) {
  let hint = "";
  if (str_col == "orange") {
    hint = "reach score 2000 to unlock";
  }
  if (str_col == "yellow") {
    hint = "reach score 4000 to unlock";
  }
  if (str_col == "green") {
    hint = "reach score 5500 to unlock";
  }
  if (str_col == "blue") {
    hint = "reach score 6500 to unlock";
  }
  if (str_col == "purple") {
    hint = "reach score 7500 to unlock";
  }
  if (str_col == "white") {
    hint = "reach score 9000 to unlock";
  }
  if (str_col == "gray") {
    hint = "play 100 games to unlock";
  }
  if (str_col == "gold") {
    hint = "play 300 games to unlock";
  }
  if (str_col == "black") {
    hint = "play 1000 games to unlock";
  }
  if (str_col == "rainbow") {
    hint = "unlock is unknown";
  }
  return hint;
}

function give_bet_col(str_col) {
  let out_col = "rgb(255, 0, 0)";
  if (str_col == "orange") {
    out_col = "rgb(0, 255, 0)";
  }
  if (str_col == "yellow") {
    out_col = "rgb(0, 128, 255)";
  }
  if (str_col == "green") {
    out_col = "rgb(255, 128, 0)";
  }
  if (str_col == "blue") {
    out_col = "rgb(255, 255, 0)";
  }
  if (str_col == "purple") {
    out_col = "rgb(128, 0, 255)";
  }
  if (str_col == "white") {
    out_col = "rgb(255, 255, 255)";
  }
  if (str_col == "gray") {
    out_col = "rgb(150, 150, 150)";
  }
  if (str_col == "gold") {
    out_col = "rgb(255, 200, 50)";
  }
  if (str_col == "black") {
    out_col = "rgb(50, 50, 50)";
  }
  if (str_col == "rainbow") {
    out_col = "rgb(" + (time1 % 253) + ", " + (time1 % 224) + ", " + (time1 % 297) + ")";
  }
  return out_col;
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

let hardness = 5.5;

let spike_prob = 0.15;
let void_prob = 0.15;
let plat_change = 75;

let dt = 0.016;

let start = true;

let stage = "menue";

let explore_speed = 0;

let person_color = "rgb(255, 0, 0)";

let running = true;
function loop() {
  if (!running) return;

  let now = performance.now();
  let dt_now = (now - last) / 1000; // seconds since last frame
  last = now;

  if (dt_now > 1/20) dt_now = 1/60;

  if (time1 == 0) dt = dt_now;
  if (time1 > 0 && time1 < 10) dt = dt*0.75 + dt_now*0.25;

  let hard_speed = posx/5000 + hardness;
  if (explore_speed > 0) {
    hard_speed = explore_speed;
  }


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

  if (explore_speed == 0 && hardness >= 5.5) {

  if (posx > 20000) {
    skins.orange = true;
  }
  if (posx > 40000) {
    skins.yellow = true;
  }
  if (posx > 55000) {
    skins.green = true;
  }
  if (posx > 65000) {
    skins.blue = true;
  }
  if (posx > 75000) {
    skins.purple = true;
  }
  if (posx > 90000) {
    skins.white = true;
  }
  
  //skins.rainbow = false;
  let rainbow_check = true;
  for (let i = 0; i < Object.keys(skins).length; i++) {
    if (skins[Object.keys(skins)[i]] == false && Object.keys(skins)[i] != "rainbow") {
      rainbow_check = false;
    }
  }
  if (rainbow_check == true) skins.rainbow = true;
  }
  if (games_played >= 100) {
    skins.gray = true;
  }
  if (games_played >= 300) {
    skins.gold = true;
  }
  if (games_played >= 1000) {
    skins.black = true;
  }
  
  if (time1 % 50 == 0) {
    localStorage.setItem("plays", games_played);
    localStorage.setItem("unlocks", JSON.stringify(skins));
    if (hardness >= 5.5 && explore_speed == 0 && localStorage.getItem("high_score") < posx/10) {
      localStorage.setItem("high_score", posx/10);
    }
  }

  let biome_stuff = set_parameters_plat(color);

  if (explore_speed > 0) {
    let spike_prob = biome_stuff[2];
    let void_prob = biome_stuff[1];
    let plat_change = biome_stuff[0];
  } else {
    let spike_prob = 0.15;
    let void_prob = 0.15;
    let plat_change = 75;
  }
  
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
      if (explosions.length === 0) background[i][0] -= background[i][3]/30*hard_speed/5*dt*60;
      if (background[i][0] < -i[3]) {
        background.splice(i, 1);
      }
    }
  }

  if (explosions.length === 0) posx += hard_speed*dt*60;
  if (explosions.length === 0) posy += vely*dt*60;

  vely += 1.1*dt*60;
  if (mouse.held[0]) {
    vely -= 0.6*dt*60;
  }

  let n = true;

  for (let i of platforms) {
    if (i[0] + length + i[3] > posx + 1800) {
      n = false;
    }
    if (i[0] < posx && posx < i[0] + i[3] + 20 && posy > i[1] && explosions.length === 0) {
      if (posy > i[1] + 10 + only_positive(vely)) {
        for (let i = 0; i < 50; i++) {
          let angle = Math.random()*100;
          explosions.push([600, 400, Math.sin(angle)*Math.random()*15 + hard_speed, Math.cos(angle)*Math.random()*15]);
        }
        if (posx > 3000) {
          games_played += 1;
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
            explosions.push([600, 400, Math.sin(angle)*Math.random()*15 + hard_speed, Math.cos(angle)*Math.random()*15]);
          }
          if (posx > 3000) {
          games_played += 1;
          }
        }
      }
    }
    if (i[0] < posx - 2000) {
      platforms.splice(platforms.indexOf(i), 1);
    }
  }

  if (mouse.x < 100 && mouse.y > 200 && mouse.y < 300 && mouse.held[0]) {
      stage = "paused";
  }

  if (n) {
    height += (Math.random()*2 - 1)*plat_change;
    if (Math.random() < void_prob) {
      void_length = Math.random()*100 + 50;
    } else {
      void_length = 0;
    }
    
    if (Math.random() > spike_prob) {
      platforms.push([posx - length + 1800 - 15 + void_length, height, color.slice(), Math.abs(length - void_length), []]);
    } else {
      platforms.push([posx - length + 1800 - 15 + void_length, height, color.slice(), Math.abs(length - void_length), [Math.abs(length/2 - void_length/2)]]);
    }
    length = Math.random()*400 + 100;
  }
  render1 = true;
  }

  if (stage == "paused") render1 = true;


  // MAIN MENU

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
        if (explosions.length === 0) background[i][0] -= background[i][3]/30*hard_speed*dt*60;
        if (background[i][0] < -i[3]) {
            background.splice(i, 1);
        }
      }
    }

    for (let i of background) {
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
    }
    
    ctx.fillStyle = person_color;
    ctx.fillRect(580, 420, 20, 20);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 424, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(592, 424, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 432, 12, 4);
    
    ctx.fillStyle = "rgb(" + (time1 % 174)/174*255 + "," + (time1 % 152)/152*255 + ","  + (time1 % 197)/197*255 + ")";
    ctx.font = "200px Arial";          // font size and family
    ctx.fillText("Star Runner", 150, 200);

    ctx.fillStyle = "rgb(128, 0, 255)";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("By Michael Alexander Kaszynski", 400, 350);

    if (localStorage.getItem("high_score") !== null) {
      ctx.fillStyle = "rgb(255, 255, 255)";          // text color
      ctx.font = "30px Arial";          // font size and family
      ctx.fillText("High Score: " + Math.floor(localStorage.getItem("high_score")), 500, 600);
    }

    
    if (550 < mouse.x && mouse.x < 650 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
      hardness = 5.5;
      explore_speed = 0;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play Medium", 560, 500);


    if (400 < mouse.x && mouse.x < 500 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
      hardness = 3.5;
      explore_speed = 0;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(400, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play Easy", 415, 500);

    if (700 < mouse.x && mouse.x < 800 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
      hardness = 10;
      explore_speed = 0;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(700, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play Hard", 715, 500);
    

    if (850 < mouse.x && mouse.x < 1000 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "play";
      hardness = 5.5;
      explore_speed = 6;
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(850, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Play Explore", 860, 500);

    if (100 < mouse.x && mouse.x < 200 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "skins";
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(100, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Colors", 110, 500);

    if (1000 < mouse.x && mouse.x < 1100 && 450 < mouse.y && mouse.y < 550 && mouse.held[0]) {
      stage = "credits";
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(1000, 450, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Credits", 1010, 500);

    ctx.fillStyle = "white";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("©2025 Michael Alexander Kaszynski. All rights reserved.", 900, 625);

    ctx.fillStyle = "white";          // text color
    ctx.font = "12px Arial";          // font size and family
    ctx.fillText("Version 1.3.11", 20, 50);
  }

  // CHOOSE COLOR
  if (stage == "skins") {

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
        if (explosions.length === 0) background[i][0] -= background[i][3]/30*hard_speed*dt*60;
        if (background[i][0] < -i[3]) {
            background.splice(i, 1);
        }
      }
    }

    for (let i of background) {
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
    };

    ctx.fillStyle = person_color;
    ctx.fillRect(580, 320, 20, 20);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 324, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(592, 324, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 332, 12, 4);

    ctx.fillStyle = "white";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("Choose Your Color", 500, 50);

    for (let i = 0; i < Object.keys(skins).length; i++) {
      let boxx = (i*100) % 700;
      let boxy = Math.floor(i/7)*100;
      if (skins[Object.keys(skins)[i]]) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(298 + boxx, 98 + boxy, 54, 54);
      }
      if (person_color == give_bet_col(Object.keys(skins)[i])) {
        ctx.fillStyle = "rgb(0, 200, 0)";
        ctx.fillRect(298 + boxx, 98 + boxy, 54, 54);
      }
      if (skins[Object.keys(skins)[i]]) {
        ctx.fillStyle = give_bet_col(Object.keys(skins)[i]);
      } else {
        ctx.fillStyle = "rgb(100, 100, 100)";
      }
      ctx.fillRect(300 + boxx, 100 + boxy, 50, 50);

      if (skins[Object.keys(skins)[i]]) {
        if (mouse.x > 300 + boxx && mouse.x < 350 + boxx && mouse.y > 100 + boxy && mouse.y < 150 + boxy && mouse.held[0]) {
          person_color = give_bet_col(Object.keys(skins)[i]);
        }
      }
    }
    for (let i = 0; i < Object.keys(skins).length; i++) {
      let boxx = (i*100) % 700;
      let boxy = Math.floor(i/7)*100;
      if (!skins[Object.keys(skins)[i]]) {
        if (mouse.x > 300 + boxx && mouse.x < 350 + boxx && mouse.y > 100 + boxy && mouse.y < 150 + boxy) {
          ctx.fillStyle = "red";          // text color
          ctx.font = "30px Arial";          // font size and family
          ctx.fillText(give_unlock(Object.keys(skins)[i]), mouse.x, mouse.y);
        }
      }
    }

    if (550 < mouse.x && mouse.x < 650 && 350 < mouse.y && mouse.y < 450 && mouse.held[0]) {
      stage = "menue";
    }
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 350, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Main Menue", 560, 400);
  }

  // CREDITS
  if (stage == "credits") {

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
        if (explosions.length === 0) background[i][0] -= background[i][3]/30*hard_speed*dt*60;
        if (background[i][0] < -i[3]) {
            background.splice(i, 1);
        }
      }
    }

    for (let i of background) {
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fillRect(i[0], i[1] - posy*i[3]/100, i[3], i[3]);
    };

    ctx.fillStyle = person_color;
    ctx.fillRect(580, 320, 20, 20);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 324, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(592, 324, 4, 4);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(584, 332, 12, 4);

    ctx.fillStyle = "white";          // text color
    ctx.font = "30px Arial";          // font size and family
    ctx.fillText("People who helped give ideas, help with code, and distribute the game:", 100, 100);

    ctx.fillStyle = "rgb(255, 0, 0)";          // text color
    ctx.font = "25px Arial";          // font size and family
    ctx.fillText("Michal Augustyniak", 100, 200);

    ctx.fillStyle = "rgb(255, 255, 0)";          // text color
    ctx.font = "25px Arial";          // font size and family
    ctx.fillText("Joseph Burke", 400, 200);

    ctx.fillStyle = "rgb(0, 255, 0)";          // text color
    ctx.font = "25px Arial";          // font size and family
    ctx.fillText("Eben Mark", 700, 200);

    ctx.fillStyle = "rgb(0, 128, 255)";          // text color
    ctx.font = "25px Arial";          // font size and family
    ctx.fillText("Alex Kasyznski", 1000, 200);
    

    if (550 < mouse.x && mouse.x < 650 && 350 < mouse.y && mouse.y < 450 && mouse.held[0]) {
      stage = "menue";
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 350, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Main Menue", 560, 400);
  }


  // RENDER GRAPICS IF REQUIRED
  
  if (render1) {

  for (let i of background) {
    ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
    ctx.fillRect(i[0], i[1] - posy*i[3]/150, i[3], i[3]);
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
      ctx.moveTo(i[0] - posx + 600 + j, i[1] - posy + 400 + 5 - 30 - 15);   // top vertex
      ctx.lineTo(i[0] - posx + 600 + j + 15 + 5, i[1] - posy + 400 + 5);  // bottom-right
      ctx.lineTo(i[0] - posx + 600 + j - 15 - 5, i[1] - posy + 400 + 5);   // bottom-left
      ctx.closePath();
      ctx.fillStyle = "rgb(" + (255 - (255 - i[2][0])*0.7) + "," + (255 - (255 - i[2][1])*0.7) + "," + (255 - (255 - i[2][2])*0.7) + ")";
      ctx.fill(); // or ctx.stroke() for outline
      
      ctx.beginPath();
      ctx.moveTo(i[0] - posx + 600 + j, i[1] - posy + 400 - 30);   // top vertex
      ctx.lineTo(i[0] - posx + 600 + j + 15 - 2, i[1] - posy + 400 + 6 - 5);  // bottom-right
      ctx.lineTo(i[0] - posx + 600 + j - 15 + 2, i[1] - posy + 400 + 6 - 5);   // bottom-left
      ctx.closePath();
      ctx.fillStyle = "rgb(" + i[2][0] + "," + i[2][1] + "," + i[2][2] + ")";
      ctx.fill(); // or ctx.stroke() for outline
    }
  };

  for (let i of explosions) {
    ctx.fillStyle = person_color;
    ctx.fillRect(i[0], i[1], 10, 10);
  };

  if (explosions.length === 0) {
    ctx.fillStyle = person_color;
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
  ctx.fillText("Speed " + String(Math.floor(hard_speed - 1.5)), 0, 100);

  let play_type1 = "Medium";

  if (hardness < 5.5) {
      play_type1 = "Easy";
  } else if (hardness > 5.5) {
      play_type1 = "Hard";
  }
  if (explore_speed > 0) {
      play_type1 = "Explore"
  }

  ctx.fillStyle = "white";          // text color
  ctx.font = "30px Arial";          // font size and family
  ctx.fillText(play_type1, 0, 150);

  if (stage == "play") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(0, 200, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Pause", 25, 250);
    }
  }

  //PAUSED

  if (stage == "paused") {
    if (100 > mouse.x && mouse.y < 400 && mouse.y > 300 && mouse.held[0]) {
      stage = "menue";
      explore_speed = 0;
      start = true;
    }
    if (550 < mouse.x && mouse.x < 650 && 250 < mouse.y && mouse.y < 350 && mouse.held[0]) {
      stage = "play";
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(0, 300, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Main Menu", 25, 350);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // last value = transparency (0 to 1)
    ctx.fillRect(550, 250, 100, 100);
    
    ctx.fillStyle = "black";          // text color
    ctx.font = "15px Arial";          // font size and family
    ctx.fillText("Unpause", 575, 300);

    if (explore_speed > 0) {
      ctx.fillStyle = "rgba(255, 255, 255)"; // last value = transparency (0 to 1)
      ctx.fillRect(400, 100, 400, 5);

      ctx.fillStyle = "rgba(200, 200, 200)"; // last value = transparency (0 to 1)
      ctx.fillRect(400 + explore_speed*10, 100 - 7.5, 20, 20);

      if (mouse.x > 405 && mouse.x < 775 && mouse.y < 200 && mouse.held[0]) {
        explore_speed = (mouse.x - 400)/10;
      }
    }
  }

  ctx.fillStyle = "white";          // text color
  ctx.font = "15px Arial";          // font size and family
  ctx.fillText("Plays: " + games_played, 1000, 50);

  render1 = false;

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
