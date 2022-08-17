var btn = document.querySelectorAll(".primary");
var modals = document.querySelectorAll('.modal');
var X = document.getElementsByClassName("close");

var menu = document.getElementById("menu");


// When the user clicks the button, open the modal
for (var i = 0; i < btn.length; i++) {
btn[i].onclick = function(e) {
e.preventDefault();
modal = document.querySelector(e.target.getAttribute("href"));
modal.style.display = "block";
}
}

// When the user clicks on(x), close the modal
for (var i = 0; i < X.length; i++) {
X[i].onclick = function() {
for (var index in modals) {
  if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
}
}
}
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target.classList.contains('modal')) {
//      for (var index in modals) {
//       if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
//      }
//     }
// }

document.getElementById("start-button").onclick = function() {
document.getElementById("loadingscreen").classList.add("hidden");
}

document.getElementById("menu-icon").onclick = function() {
menu.classList.remove("hidden");
menu.classList.add("visible");


}
document.getElementById("overlay").onclick = function() {
menu.classList.add("hidden");
menu.classList.remove("visible");
}
