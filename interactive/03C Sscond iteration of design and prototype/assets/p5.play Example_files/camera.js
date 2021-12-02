//virtual camera
//move the mouse around
//the sprite follows the mouse but appears at the center of the sketch
//because the camera is following it

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

  var sharktype = "ghost";
  shark1_btn.className = "active";

  function clearActive() {
    //  sets active to false on all buttons
    shark1_btn.className = "";
    shark2_btn.className = "";
    shark3_btn.className = "";
  }
  shark1_btn.addEventListener("click", function () {
    sharktype = "ghost";
    clearActive();
    shark1_btn.className = "active";
    sharkSelect;
  });

  shark2_btn.addEventListener("click", function () {
    sharktype = "asterisk";
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

  var myAnimation = shark.addAnimation('floating', 'assets/'+sharktype+'_standing0001.png', 'assets/'+sharktype+'_standing0007.png');
  myAnimation.offY = 18;

  shark.addAnimation('moving', 'assets/'+sharktype+'_walk0001.png', 'assets/'+sharktype+'_walk0004.png');
  shark.addAnimation('spinning', 'assets/'+sharktype+'_spin0001.png', 'assets/'+sharktype+'_spin0003.png');
  shark.addAnimation('stretching', 'assets/'+sharktype+'_stretching0001.png', 'assets/'+sharktype+'_stretching0008.png');

  shadow = createSprite(SCENE_W/2, SCENE_H/2+90, 80, 30);
  shadow.addAnimation('normal', 'assets/asterisk_circle0000.png', 'assets/asterisk_circle0001.png');

  // create groups
  bg = new Group();
  obstacles = new Group();
  collectibles = new Group();
  jellyfishes = new Group();
  trashspots = new Group();
  trashes = new Group();

  for(var i=0; i<200; i++)
  {
    var jellyfish = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    jellyfish.addAnimation('normal', 'assets/asterisk_circle0006.png', 'assets/asterisk_circle0008.png');
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
  for(var i=0; i<200; i++)
  {
    //create a sprite and add the 3 animations
    var rock = createSprite(random(-width, SCENE_W+width), random(-height, SCENE_H+height));
    //cycles through rocks 0 1 2
    rock.addAnimation('normal', 'assets/rocks'+i%3+'.png');
    bg.add(rock);
  }

  // create trash spots
  for(var j=0; j<20; j++)
  {
    var trashspot = createSprite(random(10, SCENE_W-10), random(10, SCENE_H-10));
    trashspot.addAnimation('normal', 'assets/sun1.png', 'assets/sun3.png');
    trashspot.addAnimation('discovered', 'assets/sun1.png', 'assets/sun3.png');
    trashspots.add(trashspot);
  }

    // create knowledge boards
    for(var j=0; j<30; j++)
    {
      var dot = createSprite(random(10, SCENE_W-10), random(10, SCENE_H-10));
      dot.addAnimation('normal', 'assets/bubbly0001.png', 'assets/bubbly0004.png');
      dot.addAnimation('discovered', 'assets/box0001.png', 'assets/box0003.png');
      collectibles.add(dot);
    }

  // frame = loadImage('assets/frame.png');
}

//the first parameter will be the sprite (individual or from a group)
//calling the function
//the second parameter will be the sprite (individual or from a group)
//against which the overlap, collide, bounce, or displace is checked
function collect(collector, collected)
{
  collector.changeAnimation('stretching');
  collector.animation.rewind();
  collected.changeAnimation('discovered');
}

function trashout(collector, collected) {
  collector.changeAnimation('stretching');
  collector.animation.rewind();
  collected.changeAnimation('discovered');
  for(var i=0; i<100; i++) {
    var trash = createSprite(mouseX, mouseY, 30, 30);
    trash.addAnimation('moving', 'assets/cloud_breathing0001.png', 'assets/cloud_breathing0009.png');
    trash.velocity.x = random(-5, 5);
    trash.velocity.y = random(-5, 5);
    trashes.add(trash)
  }
}

function draw() {
  background(255, 255, 255);

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
    shark.velocity.x = (camera.mouseX-shark.position.x)/20;
    shark.velocity.y = (camera.mouseY-shark.position.y)/20;
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
    document.getElementById("info_01").style.visibility = "visible";
  }

  shark.overlap(trashspots, trashout);
  if(shark.getAnimationLabel() == 'stretching' && shark.animation.getFrame() == shark.animation.getLastFrame())
{
  shark.changeAnimation('floating');
}

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
