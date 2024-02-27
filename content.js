var red = Math.floor(Math.random() * 255) % 50;
var green = Math.floor(Math.random() * 255) % 50 + 100;
var blue = Math.floor(Math.random() * 255) % 50 + 200;

function cycleColors() {
  red = green + 75;
  green = red + 75;
  blue = green + 75;
}

function getHexColor() {
  return (
    ConvertBase.dec2hex(red % 255) +
    ConvertBase.dec2hex(green % 255) +
    ConvertBase.dec2hex(blue % 255)
  );
}

// phonics is for version 0.2
var phonics = [
  "oar",
  "igh",
  "ai",
  "oa",
  "ow",
  "oe",
  "ie",
  "ei",
  "ay",
  "au",
  "ir",
  "er",
  "ur",
  "oo",
  "ue",
  "ui"
];

// push the alphabet onto phonics
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
for (let i = 0; i < alphabet.length; i++) {
  phonics.push(alphabet[i]);
}

function lastLetterIndex(res) {
  return res.index + res[0].length;
}

var ConvertBase = function(num) {
  return {
    from: function(baseFrom) {
      return {
        to: function(baseTo) {
          return parseInt(num, baseFrom).toString(baseTo);
        }
      };
    }
  };
};

ConvertBase.dec2hex = function(hex) {
  return ConvertBase(hex)
    .from(10)
    .to(16);
};

var html = document.body.innerHTML;
var result = "";
var protectedAreas = [];

// store the location for all the < > elements so we can NOT execute
// the regex inside of them
var patt = /<!--.*?-->/g;
while ((result = patt.exec(html))) {
  protectedAreas.push({
    start: result.index,
    end: lastLetterIndex(result)
  });
}

// store the location for all the < > elements so we can NOT execute
// the regex inside of them
patt = /\&.*?;/g;
while ((result = patt.exec(html))) {
  protectedAreas.push({
    start: result.index,
    end: lastLetterIndex(result)
  });
}

// store the location for all the < > elements so we can NOT execute
// the regex inside of them
patt = /<.*?>/g;
while ((result = patt.exec(html))) {
  protectedAreas.push({
    start: result.index,
    end: lastLetterIndex(result)
  });
}

var pa_start = 0;
function isProtected(idx) {
  for (let i = pa_start; i < protectedAreas.length; i++) {
    if (idx >= protectedAreas[i].start && idx < protectedAreas[i].end) {
      pa_start = i;
      return true;
    }
  }
  return false;
}

var colorIndex = {};

function getColor(ch) {
  if (!colorIndex[ch]) {
    cycleColors();
    colorIndex[ch] = getHexColor();
  }
  return colorIndex[ch];
}

var newHTML = "";
var htmlCharacters = html.split("");
for (let i = 0; i < htmlCharacters.length; i++) {
  if (/( |\n|\r|\s|\d)/i.test(htmlCharacters[i])) {
    newHTML += htmlCharacters[i];
  } else if (isProtected(i)) {
    newHTML += htmlCharacters[i];
  } else {
    newHTML +=
      '<font style="text-shadow: 1px 1px 1px #000000;" color="' +
      getColor(htmlCharacters[i].toLowerCase()) +
      '">' +
      htmlCharacters[i] +
      "</font>";
  }
}

document.body.innerHTML = newHTML;
console.log("finished");
