// var
var mic, fft, smoothing, bands;

function setup() {

  // creating audio context to allow for music
  var constraints = {
    audio: true
  };

  var audio = createCapture(constraints, function (stream) {
    console.log(stream);
  });
  audio.volume(0);


  colorMode(HSB);

  // Set Smoothing, bar count, dimmensions
  var smoothing = 0.8;
  var bands = 256;

  // Create Canvas with 100%
  var canvas = createCanvas(windowWidth, windowHeight);

  // Attatch to Div 
  canvas.parent('sketch-holder');

  // Make work in degrees for circle
  angleMode(DEGREES);

  // create Mic in
  mic = new p5.AudioIn();

  // Fast Fourier Transform (apmlitude at various frequencies)
  fft = new p5.FFT(smoothing, bands);
  fft.setInput(mic);

  // start mic capture
  mic.start();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetSketch();
}

function resetSketch() {

  // Analyze the spectrum and gives array
  var spectrum = fft.analyze();

  // Move to Center
  translate(width / 2, height / 2);


  for (var i = 0; i < spectrum.length; i++) {
    var angle = map(i, 180, spectrum.length, 0, 250);
    var amplitude = spectrum[i];

    var radius = map(amplitude, 0, 360, Math.sqrt(width * height) / 4, Math.sqrt(width * height) / 2, true);
    var x = radius * cos(angle);
    var y = radius * sin(angle);
    //noStroke();

    // draw bars
    var e1 = line(x, y, x, y);
    var e2 = line(y, x, y, x);

    // Rotate
    e1.rotate(16);
    e2.rotate(16);
    //rotate(radius/PI);
    strokeWeight(20);
    stroke(color(map(amplitude, 0, 255, 0, 255, true), map(amplitude, 0, 255, 200, 255, true), map(amplitude, 0, 255, Math.random(), 255, true), amplitude));
  }
}

function draw() {

  // TEMP
  clear();
  //background(55);
  resetSketch();
}

/*********************************
getUserMedia returns a Promise
resolve - returns a MediaStream Object
reject returns one of the following errors
AbortError - generic unknown cause
NotAllowedError (SecurityError) - user rejected permissions
NotFoundError - missing media track
NotReadableError - user permissions given but hardware/OS error
OverconstrainedError - constraint video settings preventing
TypeError - audio: false, video: false

# Permissions for p5 to access remote Mic
*********************************/
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  } else {
    console.log("not started");
  }
}