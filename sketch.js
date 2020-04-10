
// variable to hold the covidData.json entries
var covidData;

// MapBox API token
const api_key = "API_KEY";


// Options for MapBox 
const options = {
  lat: 33.7839,
  lng: -116.9586,
  zoom: 10,
  studio: true,
  style: 'mapbox://styles/mapbox/traffic-night-v2'
};


/**
 * Creating an instance of MapBox
 */
const mappa = new Mappa('Mapbox', api_key);
let myMap;
let canvas;

// funciton preload makes sure that the json is loaded before setup() or draw() are called.
// This is loading the json file into the covidData variable.
function preload(){
  covidData = loadJSON('covid.json');
}

function setup() {
  // set the canvas size to the current screen proportions
  canvas = createCanvas(screen.width,screen.height);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  myMap.onChange(drawCases);
  
  fill(109, 255, 0);
  stroke(100);
}

function draw(){

}

function drawCases(){

  clear();

  for(var i = 0; i < Object.keys(covidData).length; i++)
  {

    const latitude = covidData[i]["attributes"]["Y"];
    const longitude = covidData[i]["attributes"]["X"];

    if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      // Get the size of the population in Riverside County and map it. 2,300,000 is current
      // population according to google
      let size = covidData[i]["attributes"]["Point_Count"];
      size = map(size, 558, 2,300,000, 1, 25) + myMap.zoom();
      ellipse(pos.x, pos.y, size, size);
    }
 
   
  }
}

