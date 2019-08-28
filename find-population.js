var map;
var points=[];

var clickmode=2;	//Radius is default
var polygon;

var lineColor = "#FF0000";
var circleColor  = "#FF0000";
var circleFillColor =  "#F0000FF";
var circleFillOpacity = 0.35;
var circleWeight = 1;

var radiusCircle= null;

ftn_radius_change("km");
var autocomplete2;

function GUnload(){}
function Gload()
{
	document.getElementById(mapDivID).style.cursor = "crosshair";

	map = L.map(mapDivID,{
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
        }
    }).setView(latlng, zoom);

	//map.addControl(new L.Control.Fullscreen());
    
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);
	
	var openstreetmap = L.tileLayer('https://{s}.'+tileProviderURL+'/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: tileProviderAttribution
	});
	
	var ESRIImg  = L.esri.basemapLayer('Imagery');
	var ESRIImbLab  = L.esri.basemapLayer('ImageryLabels');
	
	var baseLayers = {
		"OSM": openstreetmap,
		"Satellite": ESRIImg
	};

	var overlays = {
		"Labels": ESRIImbLab,
	};

	
	openstreetmap.addTo(map);
	L.control.layers(baseLayers,overlays).addTo(map);
	L.control.locate().addTo(map);
	
	document.getElementById("div_output").value="";
	
	
	console.log("43");
	//Map Clicked
	map.on('click', ftn_mapclick);
	
	$.getScript("uscript/v3/global-fullscreen.js", function(data, textStatus, jqxhr) {
		console.log("34");
	});
	
	
	var autocomplete = new kt.OsmNamesAutocomplete(
		'tb_searchlocation', 'https://geocoder.tilehosting.com/', 'C7i0kEFQS2ggqr5zC2nv');
		autocomplete.registerCallback(function(item) {
		
			var latlng = L.latLng(item.lat,item.lon);
			map.panTo(latlng);
			map.setZoom(15);
	
			let mev = {
			  latlng: latlng
			};
			console.log(mev);
			console.log(mev.latlng);
			
			ftn_mapclick(mev);
		});
	
}

function ftnToggleChange(val)
{
	console.log("ftnToggleChange = " + val);
	if (val == true)
	{
		clickmode=2;
	}
	else{
		clickmode=1;
	}
}

function GloadLTM()
{
	var latlng = new google.maps.LatLng(0,0);
	var myOptions = {zoom:1,center:latlng,mapTypeId:google.maps.MapTypeId.ROADMAP,draggableCursor:'crosshair',mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.DROPDOWN_MENU},fullscreenControl: true};
	map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	map.setClickableIcons(false);
	
	
	google.maps.event.addListener(map, 'click', ftn_mapclick);
	
	/*
	//Search Box
	var input =  document.getElementById('pac-input');
  	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'place_changed', function() 
	{
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			//try a basic geocode
			searchlocation(place.name);
		  	return;
		}
		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
		  map.fitBounds(place.geometry.viewport);
		} else {
		  map.setCenter(place.geometry.location);
		  map.setZoom(17);  // Why 17? Because it looks good.
		}
  	});
	//Search Box
	*/
	
	var drawingControlDiv = document.createElement('div');
	var drawingControl = new DrawingControl(drawingControlDiv, map);
	
	drawingControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(drawingControlDiv);
	
	//autocomplete2 = new google.maps.places.Autocomplete((document.getElementById('tb_searchlocation')),{});
	
	//google.maps.event.addListener(autocomplete2, 'place_changed', onPlaceChanged);
	
	//	Autocomplete Address Block

	var input =  document.getElementById('div_circlemanual');
	input.style.display = "inline";
	
	var autocomplete = new kt.OsmNamesAutocomplete(
		'tb_searchlocation', 'https://geocoder.tilehosting.com/', 'C7i0kEFQS2ggqr5zC2nv');
		autocomplete.registerCallback(function(item) {
			var latlng = new google.maps.LatLng(item.lat,item.lon);
			map.panTo(latlng);
			map.setZoom(15);
	
			var mev = {
			  stop: null,
			  latLng: latlng
			}

			google.maps.event.trigger(map, 'click', mev);	
			});
	

	//	Autocomplete Address Block
	
}

// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function onPlaceChanged() {
  var place = autocomplete2.getPlace();
  if (place.geometry) {
	  
    map.panTo(place.geometry.location);
    map.setZoom(15);
	
	var mev = {
	  stop: null,
	  latLng: place.geometry.location
	}

	google.maps.event.trigger(map, 'click', mev);

  } else {
    document.getElementById('tb_searchlocation').placeholder = 'Search...';
  }
}

function DrawingControl(controlDiv, map) 
{
	clickmode=2;
	
	// Set CSS styles for the DIV containing the control
	// Setting padding to 5 px will offset the control
	// from the edge of the map
	controlDiv.style.padding = '1px';
	
	// Set CSS for the control border
	var controlUI = document.createElement('span');
	controlUI.style.backgroundColor = 'white';
	controlUI.style.paddingTop='10px';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '1px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.style.verticalAlign = 'bottom';
	controlUI.title = 'Click to do a polygon search';
	controlDiv.appendChild(controlUI);
	
	// Set CSS for the control border
	var controlUI2 = document.createElement('span');
	controlUI2.style.backgroundColor = 'white';
	controlUI2.style.paddingTop='10px';
	controlUI2.style.borderStyle = 'solid';
	controlUI2.style.borderWidth = '1px';
	controlUI2.style.cursor = 'pointer';
	controlUI2.style.textAlign = 'center';
	controlUI2.style.verticalAlign = 'bottom';
	controlUI2.title = 'Click to do a radius search';
	controlDiv.appendChild(controlUI2);

	// Set CSS for the control interior
	var controlText = document.createElement('img');
	controlText.src= 'images/poly.png';
	controlText.setAttribute('height', '24px');
	controlText.setAttribute('width', '24px');
	controlText.style.verticalAlign= 'bottom';
	controlText.id="img_poly1";
	controlUI.appendChild(controlText);
	
	// Set CSS for the control interior
	var controlText2 = document.createElement('img');
	//controlText2.src= 'images/circle.png';
	controlText2.src= 'images/circle-on.png';
	controlText2.setAttribute('height', '24px');
	controlText2.setAttribute('width', '24px');
	controlText2.style.verticalAlign= 'bottom';
	controlText2.id="img_poly2";
	controlUI2.appendChild(controlText2);

  // Setup the click event listeners: 

  google.maps.event.addDomListener(controlUI, 'click', function() {
    	if (clickmode==1)
		{
			clickmode=0;
			controlText.src= 'images/poly.png';
			controlText2.src= 'images/circle.png';
			document.getElementById('div_circlemanual').style.display='none';
		}
		else
		{
			clickmode=1;
			controlText.src= 'images/poly-on.png';
			controlText2.src= 'images/circle.png';
			document.getElementById('div_circlemanual').style.display='none';
		}
		ftn_clearmap();
		
		//menu swicth radius/area
		if(typeof(ftn_loadcontext)=='function')
		{ 
    		saveloadtype="Area";
			document.getElementById("li_user_load").innerHTML='<a href="#" onclick="ftn_user_load();" title="Loads an area from memory">Load Area ('+ftn_countsaved()+')</a>';	
			document.getElementById("li_user_save").innerHTML='<a href="#" onclick="ftn_user_save();" title="Saves an area to memory">Save Area</a>';
		};
  });
  
  google.maps.event.addDomListener(controlUI2, 'click', function() {
    	if (clickmode==2)
		{
			clickmode=0;
			controlText.src= 'images/poly.png';
			controlText2.src= 'images/circle.png';
			document.getElementById('div_circlemanual').style.display='none';
		}
		else
		{
			clickmode=2;
			controlText2.src= 'images/circle-on.png';
			controlText.src= 'images/poly.png';
			document.getElementById('div_circlemanual').style.display='inline';
		}
		ftn_clearmap();
		
		//menu swicth radius/area
		if(typeof(ftn_loadcontext)=='function')
		{ 
			saveloadtype="Radius";
			document.getElementById("li_user_load").innerHTML='<a href="#" onclick="ftn_user_load();" title="Loads a radius from memory">Load Radius ('+ftn_countsaved()+')</a>';
			document.getElementById("li_user_save").innerHTML='<a href="#" onclick="ftn_user_save();" title="Saves a radius to memory">Save Radius</a>';				
    	};
  });

}

function ftn_findPopulation()
{
	//sendnotification("Population","Find Population Clicked - clickmode=" + clickmode);
	
	if (clickmode==0)
	{
		document.getElementById("div_output").innerHTML="Choose a polygon or radius first";
	}
	if (clickmode==1)
	{
		document.getElementById("div_output").innerHTML="Please Wait...";		
		ftn_findpoppoly(polygon);
	}
	
	if (clickmode==2)
	{
		document.getElementById("div_output").innerHTML="Please Wait...";
		myFunctions.ftn_findpop1(radiusCircle.getLatLng().lat,radiusCircle.getLatLng().lng,radiusCircle.getRadius());
	}
}

function ftn_zoomtofit()
{
	var latlngbounds = new L.latLngBounds();
	
	if (points.length>0)
	{
		for (i in points)
		{
			latlngbounds.extend(points[i]);	
		}
	
		map.fitBounds(latlngbounds);
	}
	
	if (radiusCircle)
	{
		map.fitBounds(radiusCircle.getBounds());
	}
}

function ftn_mapclick(event)
{										  
	//console.log(clickmode);
	console.log(event);
	
	if (clickmode==1)
	{
		points.push(event.latlng);
		ftn_display();
	}
	if (clickmode==2)
	{
		//add circle
		/*
		var populationOptions = {
		  strokeColor: '#FF0000',
		  strokeOpacity: 0.8,
		  strokeWeight: 1,
		  fillColor: fillColor,
		  fillOpacity: 0.35,
		  map: map,
		  center: event.latLng,
		  draggable: true,
		  editable: true,
		  radius: document.getElementById("radiusinputkm").value*1000
		};
		
		*/


		console.log(event.latlng);
		
		radiusCircle =draw_circle=ftn_LG_DrawCircle(event.latlng, document.getElementById("radiusinputkm").value);

		radiusCircle.addTo(map);
		// Add the circle for this city to the map.
		//radiusCircle = new google.maps.Circle(populationOptions);
		console.log(radiusCircle.getBounds());
		
		
		map.fitBounds(radiusCircle.getBounds());
	
	
		
		//google.maps.event.addListener(radiusCircle, 'radius_changed', radiusCircledrag);
		
		document.getElementById("div_output").innerHTML="Circle Radius is : " + (radiusCircle.getRadius()/1000).toFixed(2)  +" km \ " + ((radiusCircle.getRadius()/1000)*0.621371192).toFixed(2)  +" miles";
		
		//console.log((radiusCircle.getRadius()/1000).toFixed(2));
		//document.getElementById("radiusinputkm").value=(radiusCircle.getRadius()/1000).toFixed(2);
		
		FMTradiuscentre=event.latlng;
		FMTradiuskm=(radiusCircle.getRadius()/1000).toFixed(2);	
		FMTkmlcoordinates=1;
	}
}

function radiusCircledrag()
{
	document.getElementById("div_output").innerHTML="Circle Radius is : " + (radiusCircle.getRadius()/1000).toFixed(2)  +" km \ " + ((radiusCircle.getRadius()/1000)*0.621371192).toFixed(2)  +" miles";
	
	//console.log((radiusCircle.getRadius()/1000).toFixed(2));
	document.getElementById("radiusinputkm").value=(radiusCircle.getRadius()/1000).toFixed(2);
	document.getElementById("radiusinputmi").value=((radiusCircle.getRadius()/1000)*0.621371192).toFixed(2);
}


function ftn_display()
{
	if (clickmode==1)
	{		
		ftn_clearmap();
		
		/*
		polygon = new google.maps.Polygon({
			paths: points,
			strokeColor: "#FF0000",
			strokeOpacity: 1,
			strokeWeight: 1,
			fillColor: fillColor,
			fillOpacity: 0.5,
			geodesic: true,
			editable: true
		});
		*/
		
		
		
		polygon = L.polygon(points, {color: lineColor, weight: 1}).addTo(map);
		// zoom the map to the polygon
		
		if (points.length>1)
		{
			map.fitBounds(polygon.getBounds());
		}
		
		//polygon.setMap(map);	  
		
		/*
		var path = polygon.getPath();
		
		google.maps.event.addListener(polygon, 'rightclick', deletepolypoint); 
		google.maps.event.addListener(path, 'set_at', set_at); 
		google.maps.event.addListener(path, 'remove_at', set_at); 	
		google.maps.event.addListener(path, 'insert_at', set_at); 	
		*/
		
		FMTkmlcoordinates="";
		if (points.length>0)
		{
			for (i in points)
			{
				FMTkmlcoordinates+=points[i].lng + "," + points[i].lat + ",0 ";
			}
			FMTkmlcoordinates+=points[0].lng + "," + points[0].lat + ",0 ";
		}
	}
}

function ftn_clearmap()
{	
	//console.log("Clear Map");
	if (polygon)
	{
		polygon.remove();
	}	
	
	if (radiusCircle)
	{
		radiusCircle.remove();
	}	
	
}

function ftn_resetmap()
{	
	//console.log("Reset Map");
	ftn_clearmap();
	//clickmode=0;
	points=[];
	document.getElementById("div_output").innerHTML="";
	if (document.getElementById('img_poly'))
	{
		document.getElementById('img_poly').src='images/poly.png';
	}
}

function set_at()
{										  
	points=polygon.getPath().getArray();
 	ftn_display();
}

function deletepolypoint(event)
{										  
	points.splice(event.vertex, 1 );
 	ftn_display();
}


function displayResults(results, messages) 
{	
	document.getElementById("div_output").innerHTML="The estimated population in the defined area is "+numberWithCommas( Math.round(results[0].value.features[0].attributes.SUM));	
}

function ftn_radius_change(unitschanged)
{
	//1 kilometer = 0.621371192 miles
	//1 kilometer = 3280.8399 feet
	//1 kilometer = 1000 meters
	
	var km;

	if (unitschanged=="km")
	{
		km=document.getElementById("radiusinputkm").value;
	}
	if (unitschanged=="miles")
	{
		km=document.getElementById("radiusinputmi").value/0.621371192;
		document.getElementById("radiusinputkm").value=km;
	}
		
	
	document.getElementById("radiusinputmi").value=round_decimals(parseFloat(km)*0.621371192,2);
}

function round_decimals(original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals);
    var result2 = Math.round(result1);
    var result3 = result2 / Math.pow(10, decimals);
    return pad_with_zeros(result3, decimals);
}
