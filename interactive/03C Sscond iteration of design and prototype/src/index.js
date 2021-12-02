// import {
//   setDragStartCallback,
//   setDragMoveCallback,
//   setDragEndCallback
// } from "./draggable.js";

let fish = document.getElementsByClassName("rotate_fish");
// if you want to attach extra logic to the drag motions, you can use these callbacks:
setDragStartCallback(function (element, x, y, scale, angle) {
  // console.log(element)
});
setDragMoveCallback(function (element, x, y, scale, angle) {
  // element.style.backgroundColor = `hsl(${(angle * 180) / Math.PI}deg, 50%, 50%)`;
  
  // let fish follow catepillar
  fish[0].style.transform = `translate(${x}px, ${y}px) rotate(${-angle * (180 / Math.PI)}deg)`;  
});

setDragEndCallback(function (element, x, y, scale, angle) {
  // console.log(element)
});

// your code here

let leafBtn = document.getElementById("leaf");
let flowerBtn = document.getElementById("flower");
let target = document.getElementById("target");

let flowerImages = [
  "assets/saffron.png",
  "assets/flower.png",
  "assets/daisy.png"
];

leafBtn.addEventListener("click", function () {
  //add a new leaf to the project
  console.log("new leaf");

  target.innerHTML += `
  <img src="assets/leaf.png" 
  class="draggable" 
  style="width:200px;
   z-index: ${window.last_z};
   left: ${Math.random() * window.innerWidth}px;
   top: ${Math.random() * window.innerHeight}px
   ">
  `;
});

flowerBtn.addEventListener("click", function () {
  //add a new leaf to the project
  console.log("new random flower");

  let image = flowerImages[Math.floor(Math.random() * flowerImages.length)];
  target.innerHTML += `
  <img src=${image} 
  class="draggable" 
  style="width:200px;
   z-index: ${window.last_z};
   left: ${Math.random() * window.innerWidth}px;
   top: ${Math.random() * window.innerHeight}px
   ">
  `;
});
