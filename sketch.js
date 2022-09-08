const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope, fruit, ground;
var fruit_con;
var button;
var bunny;
var muteBtn;
var ballon;
var button2
var rope2;
var fruit_con2;
var star;

var bgImg;
var fruitImg;
var bunnyImg;
var blinkImg, eatImg, sadImg;
var starImg, emptyStarImg, oneStarImg, twoStarImg;

var bgSound;
var cutSound;
var sadSound;
var eatingSound;
var airSound;


function preload() {
  bgImg = loadImage('background.png');
  fruitImg = loadImage('melon.png');
  bunnyImg = loadImage('Rabbit-01.png');

  bgSound = loadSound('sound1.mp3');
  sadSound = loadSound("sad.wav")
  cutSound = loadSound('rope_cut.mp3');
  eatingSound = loadSound('eating_sound.mp3');
  airSound = loadSound('air.wav');

  blinkImg = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eatImg = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sadImg = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  starImg = loadImage('star.png');
  emptyStarImg = loadAnimation("empty.png");
  oneStarImg = loadAnimation("one_star.png");
  twoStarImg = loadAnimation("stars.png");

  blinkImg.playing = true;
  eatImg.playing = true;
  eatImg.looping = false;
  sadImg.playing = true;
  sadImg.looping = false;
  
}

function setup() {
  createCanvas(600, 700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;

  bgSound.play();
  bgSound.setVolume(0.5);

  button = createImg('cut_btn.png');
  button.position(100, 90);
  button.size(50, 55);
  button.mouseClicked(drop);

  mute_btn = createImg('mute.png');
  mute_btn.position(width - 60, 20);
  mute_btn.size(40, 40);
  mute_btn.mouseClicked(mute);

  ground = new Ground(300, height, width, 30);

  rope = new Rope(5, { x: 120, y: 90 });
  rope2 = new Rope(9, { x: 480, y: 90 });

  blinkImg.frameDelay = 20;
  eatImg.frameDelay = 20;

  bunny = createSprite(120, height - 80, 100, 100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking', blinkImg);
  bunny.addAnimation('eating', eatImg);
  bunny.addAnimation('crying', sadImg);
  bunny.changeAnimation('blinking');

  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);



  fruit_con = new Link(rope, fruit);

  fruit_con2 = new Link(rope2, fruit);




  button2 = createImg('cut_btn.png');
  button2.position(450, 90);
  button2.size(50, 55);
  button2.mouseClicked(drop2);

  //criar as estrelas

  star = createSprite(250, 60, 10, 10);
  star.addImage(starImg);
  star.scale = 0.02;



  ballon = createImg('baloon2.png');
  ballon.position(250, 300);
  ballon.size(60, 60);
  ballon.mouseClicked(airblow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

}

function draw() {
  background(0);
  image(bgImg, 0, 0, width, height);

  Engine.update(engine);

  ground.show();

  rope.show();
  rope2.show();

  drawSprites();

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(fruitImg, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  //se o coelho comer a fruta
  if (collide(fruit, bunny, 50) == true) {
    World.remove(engine.world, fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eatingSound.play();
  }
  //se o coelho nao comer a fruta
  if (fruit != null && fruit.position.y >= 640){
    bunny.changeAnimation('crying');
    bgSound.stop();
    sadSound.play();
  }
  //se o melancia pegar a estrela
  if (collide(fruit, star, 20) == true) {
    star.visible = false;


  }

}

function drop() {
  cutSound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null;
}

function drop2() {
  cutSound.play();
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null;
}

function mute() {
  if (bgSound.isPlaying()) {
    bgSound.stop();
  }
  else {
    bgSound.play();
  }
}

//função para o balão soprar
function airblow() {
  Matter.Body.applyForce(fruit, { x: 0.0, y: 0 }, { x: 0, y: -0.05 });
  airSound.play();


}

//função para o coelho colidir com elementos
function collide(body, sprite, x) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= x) {
      return true;

    }
    else {
      return false;
    }
  }
}
