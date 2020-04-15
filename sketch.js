
var covidData;
var geoData;
var boundary;
let city_limit;
let padding = 20;
let div;
// MapBox API token
const api_key = "API_KEY";



const options = {
  lat: 33.690545,
  lng: -116.143049,
  zoom: 8,
  studio: true,
  style: 'mapbox://styles/mapbox/traffic-night-v2',
  
};


/**
 * Creating an instance of MapBox
 */
const mappa = new Mappa('MapboxGL', api_key);
let myMap;
let canvas;

 
function preload(){
  covidData = loadJSON('covid.json');
  boundary = loadJSON('riversideShape.json')
}


/**********************
 * setup
*********************/
function setup() {
  
  city_limit = getBoundingBox(boundary);
  console.log(options.style);
  canvas = createCanvas(screen.width,screen.height);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.onChange(drawCases);
  div = createDiv("");  

}

function createADiv(){
  div.style('position','absolute');
  div.style('box-shadow', '0px 13px 10px black');
  div.style('height','75px');
  div.style('width','150px');
  div.style('color','#888');
  div.style('border', '1px solid #888');
  div.style('border-radius','12px');
  div.style('text-align','left');
  div.style('padding', '10px 10px ');
  div.style('background-color', 'rgb(0,0,0)'); /* Fallback color */
  div.style('background-color', 'rgba(255,255,255)'); /* Black w/ opacity */

}


function mousePressed(){
  div.hide();
  removeElements();
  for(var i = 0; i < Object.keys(covidData).length; i++)
  {

    const latitude = covidData[i]["attributes"]["Y"];
    const longitude = covidData[i]["attributes"]["X"];


    //if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      let size = covidData[i]["attributes"]["Point_Count"];
      size = map(size, 0, covidData[0]["attributes"]["Point_Count"], 1, 25) + myMap.zoom();

     let d = dist(mouseX, mouseY, pos.x,pos.y);
     if(d < (size/2)){
       div = createDiv("City: " + covidData[i]["attributes"]["NAME"] + "<br> Cases: " 
       + covidData[i]["attributes"]["Point_Count"] +"<br> Deaths: " + covidData[i]["attributes"]["Sum_Deceased"] );
       createADiv();
       div.position(pos.x,pos.y);
       div.show()
     }
  }
}






function getBoundingBox (boundary) {
	let bounds = {};
	let coords,latitude, longitude;
  let data = boundary[0].the_geom.coordinates[0];

  for (var i = 0; i < data.length; i++) {
    coords = data[i];

    for (var j = 0; j < coords.length; j++) {
			longitude = coords[0];
      latitude = coords[1];
      bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
      bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
      bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
      bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
  }
  return bounds;
}

function draw(){
}



/********************* 
 * funcion to draw the cases on the map.
*********************/
function drawCases(){
  clear();
  
  div.hide();
  let data = boundary[0].the_geom.coordinates[0];
  stroke(255);
  fill(100,100,100, 50);
	beginShape();
		for (var i = 0; i < data.length; i++) {
			let lon = boundary[0].the_geom.coordinates[0][i][0];
      let lat = boundary[0].the_geom.coordinates[0][i][1];
      
      const p = myMap.latLngToPixel(lat, lon);

			let x = map(lon, city_limit.xMin, city_limit.xMax, 0+padding, width-padding);
			let y = map(lat,city_limit.yMin, city_limit.yMax, height-padding, 0+padding);

			vertex(p.x,p.y);
		}
	endShape(CLOSE);


  fill(109, 255, 0);
  stroke(100);
  for(var i = 0; i < Object.keys(covidData).length; i++)
  {

    const latitude = covidData[i]["attributes"]["Y"];
    const longitude = covidData[i]["attributes"]["X"];
    

    //if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(latitude, longitude);
      
      //map(value, start1, stop1, start2, stop2)
      let size = covidData[i]["attributes"]["Point_Count"];
      size = map(size, 0, covidData[0]["attributes"]["Point_Count"], 1, 25) + myMap.zoom();
      ellipse(pos.x, pos.y, size, size);     

      
      }

  }
  
