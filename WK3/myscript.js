/*

To do

- update fire -- done
- update room -- done
- update story
  - need to create a new text node to add new story instead of
    appending to the existing feed so that each new feed can be
    animated separately -- done
- text animation -- done
- centers game in window -- done, sort-of

- locations (add "a silent forest")
  - gather wood
  - show wood inventory when stoking fire
- inventory
- popup (event)
- get animation (setInterval) to work even when tab is inactive

- create animation for when locations are clicked, the actions div
  changes. Actions should be associated with the location.
  When new locations are clicked, display actions associated with
  that location

*/


////////////////////////////
// Global Variables
////////////////////////////
var fire = {

  intensity: 0,
  fireState: 0,
  cooldown: 10,
  cooldownID: 'fireCD',
  buttonID: 'stokeFire',
  fireScript: ['the fire is dead.',
                  'the fire is burning.',
                  'the fire is roaring.'],

  updateFeed: function () {
    updateFeed(this.fireScript, this.fireState);
  },

  updateFeedOld: function () {
    var elem = document.getElementById('mainText');
    var newNode = document.createElement('p');
    newNode.setAttribute('class', 'feed');
    var newTextNode = document.createTextNode(this.fireScript[this.fireState]);

    newNode.appendChild(newTextNode);
    elem.insertBefore(newNode, elem.firstChild);
  },

  calculateFireState: function () {

    if (this.intensity == 0){
      this.fireState = 0;
    } else if ((this.intensity > 0) && (this.intensity <= 10)) {
      this.fireState = 1;
    } else if (this.intensity > 10) {
      this.fireState = 2;
    }

    return this.fireState;
  },

  buttonAction: function () {

    this.intensity += 10;
    this.calculateFireState();
    this.updateFeed();
  },

  decreaseIntensity: function () {

    // only reduces intensity if fire is not dead
    if (this.fireState > 0) {

      var currentState = this.fireState;
      this.intensity --;
      var newState = this.calculateFireState();

      // only updates feed if the fire state changes
      if (newState != currentState) {
        this.updateFeed();
      }
    }
  },
}

var room = {

  roomTemp: 0,
  roomState: 0,
  roomScript: ['the room is freezing.',
                'the room is cold.',
                'the room is mild.',
                'the room is warm.',
                'the room is hot.'],

  updateFeed: function () {
    updateFeed(this.roomScript, this.roomState);
  },

  updateFeedOld: function () {
    var elem = document.getElementById('mainText');
    var newNode = document.createElement('p');
    newNode.setAttribute('class', 'feed');
    var newTextNode = document.createTextNode(this.roomScript[this.roomState]);

    newNode.appendChild(newTextNode);
    elem.insertBefore(newNode, elem.firstChild);
  },

  calculateRoomTemp: function () {
    if (this.roomTemp == 0){
      this.roomState = 0;
    } else if ((this.roomTemp > 0) && (this.roomTemp <= 30)) {
      this.roomState = 1;
    } else if ((this.roomTemp > 30) && (this.roomTemp <= 60)) {
      this.roomState = 2;
    } else if ((this.roomTemp > 60) && (this.roomTemp <= 90)) {
      this.roomState = 3;
    } else if (this.roomTemp > 90) {
      this.roomState = 4;
    }
  },

  increaseTemp: function () {
    // might neeed to set a limit to roomtemp in the future
    var currentState = this.roomState;
    this.roomTemp ++;
    this.calculateRoomTemp();
    var newState = this.roomState;

    if (newState != currentState) {
      this.updateFeed();
    }
    // check fire intensity and increases room temp appropriately based on
    // fire intensity every few seconds
  },

  decreaseTemp: function () {
    if (this.roomState > 0) {
      var currentState = this.roomState;
      this.roomTemp --;
      this.calculateRoomTemp();
      var newState = this.roomState;

      if (newState != currentState) {
        this.updateFeed();
      }
    };
  },

}

var wood = {
  cooldown: 30,
  cooldownID: 'gatherWoodCD',
  buttonID: 'gatherWood',

  buttonAction: function () {},
}

var main = (function () {

  // initial setup
  setUpGame();

  // update loop
  updateFire();
  updateRoom();
  updateStory();

}())

function setUpGame () {

  // can't have ul inside <p> element
  var nav = document.querySelectorAll('#nav ul');
  var roomNode = addNode(nav[0], 'li', ['id', 'class'], ['room', 'locations']);
  roomNode.innerHTML = 'A Dark Room';

  room.updateFeed();
  fire.updateFeed();
  addLightFireButton();
  addGatherWoodButton();
}

function addLightFireButton () {

  var actions = document.getElementById('actions');
  var control = addNode(actions, 'div', ['class', 'id'], ['controls', 'control1']);
  var stokeFireAttributes = ['class', 'id', 'onClick'];
  //var stokeFireValues = ['button', 'stokeFire', 'stokeFire(fire, \'fireCD\')'];
  var stokeFireValues = ['button', 'stokeFire', 'lightFire()'];
  var stokeFireButton = addNode (control, 'button', stokeFireAttributes, stokeFireValues);
  stokeFireButton.innerHTML = 'light fire';

  // set up the button progress animation
  var fireCDElem = addNode(control, 'div', ['id'], ['fireCD']);

  fireCDElem.addEventListener("webkitAnimationEnd", function () {stokeFireButton.disabled = false; fireCDElem.classList.toggle('cooldown');}, false);
  fireCDElem.addEventListener("animationend", function () {stokeFireButton.disabled = false; fireCDElem.classList.toggle('cooldown');}, false);
  fireCDElem.addEventListener("oanimationend", function () {stokeFireButton.disabled = false; fireCDElem.classList.toggle('cooldown');}, false);
}

function addGatherWoodButton () {
  var actions = document.getElementById('actions');
  var control = addNode(actions, 'div', ['class', 'id'], ['controls', 'control2']);
  var gatherWoodAttributes = ['class', 'id', 'onClick'];

  var gatherWoodValues = ['button', 'gatherWood', 'buttonPress(wood)'];
  var gatherWoodButton = addNode (control, 'button', gatherWoodAttributes, gatherWoodValues);
  gatherWoodButton.innerHTML = 'gather wood';
  control.style.visibility = 'hidden';
  // set up the button progress animation
  var woodCDElem = addNode(control, 'div', ['id'], ['gatherWoodCD']);

  woodCDElem.addEventListener("webkitAnimationEnd", function () {gatherWoodButton.disabled = false; woodCDElem.classList.toggle('cooldown');}, false);
  woodCDElem.addEventListener("animationend", function () {gatherWoodButton.disabled = false; woodCDElem.classList.toggle('cooldown');}, false);
  woodCDElem.addEventListener("oanimationend", function () {gatherWoodButton.disabled = false; woodCDElem.classList.toggle('cooldown');}, false);
}

function updateFeed (script, state = 0) {

  var elem = document.getElementById('mainText');
  var newNode = document.createElement('p');
  newNode.setAttribute('class', 'feed');
  var newTextNode = document.createTextNode(script[state]);

  newNode.appendChild(newTextNode);
  elem.insertBefore(newNode, elem.firstChild);
}


//
// Function Declarations
//

function setAttributes (node, attributes, values) {

  for (i = 0; i < attributes.length; i++) {
    node.setAttribute(attributes[i], values[i]);
  }
}

function addNode(parentNode, nodeType, attributes = [], values = []) {

  var buttonNode = document.createElement(nodeType);
  setAttributes(buttonNode, attributes, values)
  parentNode.appendChild(buttonNode);

  // returns reference to the new button buttonNode
  return buttonNode;
}

function updateRoom () {

  setInterval(function () {
    // version 1 (simple) all fire states increase temp by same amount
    // will implement version 2 later where diff fire state increase temp at
    // different rate
    if (fire.fireState > 0) {
      room.increaseTemp();
    } else if (fire.fireState == 0) {
      room.decreaseTemp();
    }
  }, 1000)
}

function updateFire () {

  // reduces intensity by 1 every second so 10 unit every 10 seconds
  // this function runs all the time since I never cleared id but it doesn't
  // output anything when intensity is < 0
  setInterval(function () {
    fire.decreaseIntensity()
  }, 10000);
}

function retrievePixelValue (attributeValue) {

  // takes a string of pixel value and turns it into a number
  return Number(attributeValue.replace('px', "").trim());
}

function lightFire () {

  var roomNav = document.getElementById('room');
  roomNav.innerHTML = 'A Firelit Room';
  roomNav.setAttribute('onClick', 'setControls(1)');

  var fireElem = document.getElementById('stokeFire');
  fireElem.innerHTML = 'stoke fire';
  fireElem.setAttribute('onClick', 'buttonPress(fire)');
  buttonPress(fire);

  var story = ['the light from the fire spills from the windows, out into the dark.'];
  updateFeed(story);
}

function buttonPress (buttonObj) {

  var buttonElem = document.getElementById(buttonObj.buttonID);
  var buttonCDElem = document.getElementById(buttonObj.cooldownID);
  buttonObj.buttonAction();
  buttonCDElem.classList.toggle('cooldown');
  buttonElem.disabled = true;
  //animateCooldown(buttonObj);
}

function updateStory () {

  // strangerEncounter1
  'a ragged stranger stumbles through the door and collapses in the corner.'
  'the stranger shivers, and mumbles quietly. her words are unintelligible.'
  'the stranger in the corner stops shivering. her breathing calms.'

  'strange noises can be heard throug the walls.'

  // event alert
  'through the walls, shuffling noises can be heard.'
  'can\'t tell what they\'re up to.'
  // options
  'investigate'
  'ignore them'

  var id = setInterval(displayLocations, 1000);

  function displayLocations () {
    if (room.roomState > 0) {
      var tabDivider = addNode(nav, 'li', ['class'], ['divider locations']);
      tabDivider.style.width = '1px';
      tabDivider.style.height = '22px';
      tabDivider.style.background = 'black';

      var forestNode = addNode(nav, 'li', ['id', 'class'], ['forest', 'locations']);
      forestNode.innerHTML = 'A Silent Forest';
      forestNode.setAttribute('onClick', 'setControls(2)');

      clearInterval(id);
    }
  }
}

function setControls (controlNum) {
  var controls = document.getElementsByClassName('controls');
  var i;

  for (i = 0; i < controls.length; i++) {
    if (controls[i].getAttribute('id') == ('control' + String(controlNum))) {
      controls[i].style.visibility = 'visible';
    } else {
      // console.log('setting ' + controls[i] + ' to none');
      controls[i].style.visibility = 'hidden';
    }
  }
}
