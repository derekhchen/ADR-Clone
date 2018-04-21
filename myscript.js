function updateStory () {
  document.getElementById("stokeFire").innerHTML = "stoke fire";

  var story = document.getElementById("mainText").innerHTML;
  story = "the light from the fire spills from the windows, out into the dark.<br><br>the fire is burning<br><br>" + story;
  document.getElementById("mainText").innerHTML = story;

}

function deactivateButton () {
  document.getElementById("stokeFire").disabled = true;

}

function activateButton () {
  document.getElementById("stokeFire").disabled = false;
}

function animateCooldown () {
  // animate cooldown
  var elem = document.getElementById("cooldown");
  // button length
  var width = 102;
  var id = setInterval(frame, 100);
  function frame() {
    if (width <= 0) {
      clearInterval(id);
    } else {
      width--;
      elem.style.width = width + 'px';
      elem.style.background = "#dddddd";
    }
  }
}

function stoking () {
  deactivateButton();
  updateStory();
  animateCooldown();
  setTimeout(activateButton, 10200);
}
