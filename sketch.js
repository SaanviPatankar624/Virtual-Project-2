var dog, happyDogImg, dogImg;
var database;
var feed, addFood, milkImg;
var feedTime, lastFed;
var foodS, foodStock, foodObj;

function preload()
{
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800, 500);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  foodStock.set(20);

  dog = createSprite(700, 220, 150, 150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {  
  background("green");

  feedTime = database.ref("FeedTime");
  feedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(15);
  if(lastFed >= 12){
     text("Last Feed : " + lastFed % 12 + "PM", 350, 30);
  }else if(lastFed == 0){
     text("Last Feed : 12 AM", 350, 30);
  }else{
     text("Last Feed : " + lastFed + "AM", 350, 30);
  }

  foodObj.display();

  drawSprites();

}

  //if(foodS!== undefined){
     //textSize(20);
     //stroke("black");
     //fill("white");
     //text("Food Remaining:", 200, 200);
     //text("Note: Press UP_ARROW Key To Feed The Dog Milk!", 200, 100);
  //}

  if(foodS === 0){
     foodS = 20;
  }

  function readStock(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }

  function feedDog(){
    dog.addImage(happyDogImg);
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1)
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime: hour()
    })
  }

  function addFoods(){
    foodS ++;
    database.ref('/').update({
      Food: foodS
    })
  }

function writeStock(x){

  if(x <= 0){
     x = 0;
  }
  else{
    x = x-1;
  }
   
  database.ref('/').update({
     Food:x
  })
}

function readStock(data){
  foodS = data.val();

}

