var shark;
var bg;
var frame;
//the scene is twice the size of the canvas
var SCENE_W = 3000;
var SCENE_H = 3000;

var isKeyboard = false;

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  fullscreen(myCanvas);

  // choose shark
  let shark1_btn = document.getElementById("shark1");
  let shark2_btn = document.getElementById("shark2");
  let shark3_btn = document.getElementById("shark3");

  var sharktype = "shark1";
  shark1_btn.className = "active";

  function clearActive() {
    //  sets active to false on all buttons
    shark1_btn.className = "";
    shark2_btn.className = "";
    shark3_btn.className = "";
  }
  shark1_btn.addEventListener("click", function () {
    sharktype = "shark1";
    clearActive();
    shark1_btn.className = "active";
    sharkSelect;
  });

  shark2_btn.addEventListener("click", function () {
    sharktype = "shark2";
    clearActive();
    shark2_btn.className = "active";
    sharkSelect;
  });
  
  shark3_btn.addEventListener("click", function () {
    sharktype = "shark3";
    clearActive();
    shark3_btn.className = "active";
    sharkSelect;
  });

  let isMoving = false;
  
  function sharkSelect () {
    if (isMoving === false) {
      return;
    }
  }

  // create sprites and add animations
  shark = createSprite(SCENE_W/2, SCENE_H/2, 50, 100);

  var myAnimation = shark.addAnimation('floating', 'assets/'+sharktype+'_standing0001.png', 'assets/'+sharktype+'_standing0003.png');
  myAnimation.offY = 18;

  shark.addAnimation('moving', 'assets/'+sharktype+'_walk0001.png', 'assets/'+sharktype+'_walk0003.png');
  shark.addAnimation('spinning', 'assets/'+sharktype+'_spin0001.png', 'assets/'+sharktype+'_spin0003.png');
  shark.addAnimation('stretching', 'assets/'+sharktype+'_stretching0001.png', 'assets/'+sharktype+'_stretching0008.png');

  shadow = createSprite(SCENE_W/2, SCENE_H/2+90, 80, 30);
  shadow.scale = 0.1;
  shadow.addAnimation('normal', 'assets/shadow0001.png', 'assets/shadow0002.png');

  // create groups
  bg = new Group();
  obstacles = new Group();
  collectibles = new Group();
  jellyfishes = new Group();
  trashspots = new Group();
  trashes = new Group();

  for(var i=0; i<30; i++)
  {
    var jellyfish = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    jellyfish.addAnimation('normal', 'assets/jellyfish1.png', 'assets/jellyfish4.png');
    jellyfish.setCollider('circle', -2, 2, 55);
    jellyfish.setSpeed(random(2, 3), random(0, 360));

    //scale affects the size of the collider
    jellyfish.scale = random(0.5, 1);
    //mass determines the force exchange in case of bounce
    jellyfish.mass = jellyfish.scale;
    //restitution is the dispersion of energy at each bounce
    //if = 1 the circles will bounce forever
    //if < 1 the circles will slow down
    //if > 1 the circles will accelerate until they glitch
    circle.restitution = 1;
    jellyfishes.add(jellyfish);
  }

  // create some background for visual reference
  for(var i=0; i<100; i++)
  {
    //create a sprite and add the 3 animations
    var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    //cycles through rocks 0 1 2
    rock.addAnimation('normal', 'assets/seabed'+i%5+'.png');
    bg.add(rock);
  }

  for(var j=0; j<4; j++)
  {
    random_x = random(10, SCENE_W-10);
    random_y = random(10, SCENE_H-10);
    var trashspot = createSprite(random_x, random_y);
    trashspot.addAnimation('normal', 'assets/danger1.png', 'assets/danger1.png');
    trashspots.add(trashspot);
      // create trash spots
  for(var i=0; i<10; i++) {
    var trash = createSprite(random_x, random_y, 10, 10);
    trash.addAnimation('normal', 'assets/trash1.png', 'assets/trash3.png');
    trashes.add(trash)
  }
  }

  var infos = ['info_01', 'info_02'];
  var arraylength = infos.length;
    // create knowledge boards
    for(var j=0; j<10; j++)
    {
      var random_x = random(10, SCENE_W-10); 
      var random_y = random(10, SCENE_H-10);
      var infospot = createSprite(random_x, random_y);
      infospot.addAnimation('normal', 'assets/infodot1.png', 'assets/infodot3.png');
      infospot.addAnimation('discovered', 'assets/infoflag1.png', 'assets/infoflag4.png');
      collectibles.add(infospot);

      // var infoTag = new Object();
      // for(int i ) {
      //   infoTag.text = infos[j];
      //   infoTag.pic = infospot;
      //   arraylength--;
      // }
    }

    // function createInfo(infoTag) {
    //   var infoid = ''+infoTag;
    //   document.getElementById(infoid).style.display = 'inline';
    //   document.getElementById(infoid).style.visibility = "visible";
    //   $('#'+infoid).delay(3200).fadeOut(300);
    // }

  // frame = loadImage('assets/frame.png');
}

function collect(collector, collected)
{
  collector.changeAnimation('stretching');
  collector.animation.rewind();
  collected.changeAnimation('discovered');
  
  // show info
  document.getElementById('info_01').style.display = 'inline';
  document.getElementById("info_01").style.visibility = "visible";
  $("#info_01").delay(3200).fadeOut(300);
}

function trashout(collector, collected) {
  collected.velocity.x = random(-50, 50);
  collected.velocity.y = random(-50, 50);
}

function destroy(collector, collected)
{
  collected.remove();
}

function draw() {
  background(0,94,184);

  //a camera is created automatically at the beginning

  //.5 zoom is zooming out (50% of the normal size)
  if(mouseIsPressed)
    camera.zoom = 0.5;
  else
    camera.zoom = 1;

  // set the camera position to the shark position
  camera.position.x = shark.position.x;
  camera.position.y = shark.position.y;

  // limit the shark movements
  if(shark.position.x < 0)
    shark.position.x = 0;
  if(shark.position.y < 0)
    shark.position.y = 0;
  if(shark.position.x > SCENE_W)
    shark.position.x = SCENE_W;
  if(shark.position.y > SCENE_H)
    shark.position.y = SCENE_H;

    // console.log(camera.mouseX, shark.position.x)
    threshold = 30;
    keyboard_speed = 5;
    if (isKeyboard) {
      if (keyIsDown(LEFT_ARROW)) {
        shark.changeAnimation('moving');
        shark.mirrorX(-1);
        shark.velocity.x = -keyboard_speed;
      }
      if(keyIsDown(RIGHT_ARROW)) {
        shark.changeAnimation('moving');
        shark.mirrorX(1);
        shark.velocity.x = keyboard_speed;
      }
      if (keyIsDown(DOWN_ARROW)) {
        shark.changeAnimation('moving');
        shark.mirrorY(1);
        shark.velocity.y = -keyboard_speed;
      }
      if(keyIsDown(UP_ARROW)) {
        shark.changeAnimation('moving');
        shark.mirrorY(-1);
        shark.velocity.y = keyboard_speed;
      }
    }
    else {
          //mouse trailer, the speed is inversely proportional to the mouse distance
    var speedfactor = 25;
    shark.velocity.x = (camera.mouseX-shark.position.x)/speedfactor;
    shark.velocity.y = (camera.mouseY-shark.position.y)/speedfactor;
    if (camera.mouseX < shark.position.x + threshold && camera.mouseX > shark.position.x - threshold && camera.mouseY < shark.position.y + threshold && camera.mouseY > shark.position.y - threshold) {
      //if close to the mouse, don't move
      shark.changeAnimation('floating');
      shark.velocity.x = 0;
      shark.velocity.y = 0; 
    }
    else {
      if (camera.mouseX < shark.position.x - threshold || keyIsDown(LEFT_ARROW)) {
        shark.changeAnimation('moving');
        //flip horizontally
        shark.mirrorX(-1);
      }
      if(camera.mouseX > shark.position.x + threshold || keyIsDown(RIGHT_ARROW)) {
        shark.changeAnimation('moving');
        //unflip
        shark.mirrorX(1);
      }
      if (camera.mouseY < shark.position.y - threshold || keyIsDown(DOWN_ARROW)) {
        shark.changeAnimation('moving');
        //unflip
        shark.mirrorY(1);
      }
      if(camera.mouseY > shark.position.y + threshold || keyIsDown(UP_ARROW)) {
        shark.changeAnimation('moving');
        //flip vertically
        shark.mirrorY(-1);
      }
    } 
    }

    shadow.position.x = shark.position.x;
    shadow.position.y = shark.position.y+90;
   
    shark.overlap(collectibles, collect);
    if(shark.getAnimationLabel() == 'stretching' && shark.animation.getFrame() == shark.animation.getLastFrame())
  {
    shark.changeAnimation('floating');
  }

  shark.overlap(trashspots, destroy);
  shark.overlap(trashes, trashout);
  jellyfishes.bounce(jellyfishes);
  jellyfishes.bounce(shark);

    if(mouseIsPressed) {
      //the rotation is not part of the spinning animation
      shark.rotation -= 10;
      shark.changeAnimation('spinning');

      // pop up rectangle
      // noStroke();
      // fill(204, 153, 255);
      // ellipse(shark.position.x, shark.position.y, 200, 400);

    }
    else
      shark.rotation = 0;

  //draw the scene

  // rocks first
  drawSprites(bg);

  // knowledge boards
  drawSprites(collectibles);

  // trashes and trash spots
  drawSprites(trashes);
  drawSprites(trashspots);

  // jellyfishes
  drawSprites(jellyfishes);

  // shadow
  drawSprite(shadow);
  // noStroke();
  // fill(0, 0, 0, 20);  // ellipse(shark.position.x, shark.position.y+90, 80, 30);

  //character on the top
  drawSprite(shark);

  //I can turn on and off the camera at any point to restore
  //the normal drawing coordinates, the frame will be drawn at
  //the absolute 0,0 (try to see what happens if you don't turn it off
  camera.off();
  // image(frame, 0, 0);
}
