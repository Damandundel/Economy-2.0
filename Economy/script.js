const rocket = document.getElementById("rocket");

let isDragging = false;
let offsetX, offsetY;

rocket.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - rocket.getBoundingClientRect().left;
  offsetY = e.clientY - rocket.getBoundingClientRect().top;
  rocket.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  rocket.style.left = `${e.clientX - offsetX}px`;
  rocket.style.top = `${e.clientY - offsetY}px`;  
});

document.addEventListener("mouseup", () => {
  isDragging = false;``
  rocket.style.cursor = "grab";
}); 
 
 