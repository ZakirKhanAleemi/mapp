//Global Settings
var FMTkey="17o8dysaCDrgv1c";	//7oe8dysanxdrgv1c
var tileProviderURL="tile.openstreetmap.org";
var tileProviderAttribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var elevationapikey='dMJ4SZIacq347OZlBNR1t99g1-V4Ul';
//Global Settings

//Unit Varibles
var MILES={
	label:"miles",
	f:function(distance){
	return distance/1609.344;
	}
};
var KMS={
	label:"km",
	f:function(distance){
	return distance/1000;
	}
};

//FMT Global varibles
var FMTkmlcoordinates;
var FMTradiuscentre;
var FMTradiuskm;
var FMTmarkerurl='images/markers/freemaptools.png';
var FMTblackmarkerurl='images/markers/freemaptools-black.png';
var FMTmarkersizefactor=1;
var FMTmarkeropacity=1.0;
var settings_unit_handler=KMS;
//FMT Global varibles

function unCheckRadio(oRadio) {
	  var or = document.getElementsByName(oRadio);
      for (var i = 0; i < or.length; i++) {
         or[i].checked = false;
     }
}
function setSelectedIndex(s, i)
{
	s.options[i-1].selected = true;
	return;
}

/* 17/08/2018 Candidate to remove
var geocoder = null;
function searchlocation(searchstring) 
{
	geocoder.geocode( { 'address': searchstring}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
        	map.setCenter(results[0].geometry.location);
			map.fitBounds(results[0].geometry.viewport);  
      	} 
		else 
		{
			console.log("Geocode was not successful for the following reason: " + status);
			alert("No Results");
      	}
   	});
}
*/

function getCheckedValue(radioObj) 
{
	if(!radioObj)
	{
		return "";
	}
	var radioLength = radioObj.length;
	if(radioLength == undefined)
	{
		if(radioObj.checked)
		{
			return radioObj.value;
		}
		else
		{
			return "";
		}
	}
	for(var i = 0; i < radioLength; i++) 
	{
		if(radioObj[i].checked) 
		{
			return radioObj[i].value;
		}
	}
	return "";
}

// Replaces all instances of the given substring.
String.prototype.replaceAll = function(
    strTarget, // The substring you want to replace
    strSubString // The string you want to replace in.
    ){
    var strText = this;
    var intIndexOfMatch = strText.indexOf( strTarget );
     
    // Keep looping while an instance of the target string
    // still exists in the string.
    while (intIndexOfMatch != -1){
    // Relace out the current instance.
    strText = strText.replace( strTarget, strSubString );
     
    // Get the index of any next matching substring.
    intIndexOfMatch = strText.indexOf( strTarget );
    }
     
    // Return the updated string with ALL the target strings
    // replaced out with the new substring.
    return( strText );
};

String.prototype.CountCommas = function(){
	return (this.split(",")).length-1;
};

var togglecsv=true;
function ftn_togglecsv(divelement)
{
	if (togglecsv)
	{
		togglecsv=false;
		document.getElementById(divelement).value=document.getElementById(divelement).value.replaceAll(",","\n");
	}
	else
	{
		togglecsv=true;
		document.getElementById(divelement).value=document.getElementById(divelement).value.replaceAll("\n",",");
	}
}

function pad_with_zeros(rounded_value, decimal_places) {

    // Convert the number to a string
    var value_string = rounded_value.toString();
    
    // Locate the decimal point
    var decimal_location = value_string.indexOf(".");

    // Is there a decimal point?
    if (decimal_location == -1) {
        
        // If no, then all decimal places will be padded with 0s
        decimal_part_length = 0;
        
        // If decimal_places is greater than zero, tack on a decimal point
        value_string += decimal_places > 0 ? "." : "";
    }
    else {

        // If yes, then only the extra decimal places will be padded with 0s
        decimal_part_length = value_string.length - decimal_location - 1;
    }
    
    // Calculate the number of decimal places that need to be padded with 0s
    var pad_total = decimal_places - decimal_part_length;
    
    if (pad_total > 0) {
        
        // Pad the string with 0s
        for (var counter = 1; counter <= pad_total; counter++) 
            value_string += "0";
        }
    return value_string;
}



var kmlLayer;
function togglekmlLayer(kmlurl)
{
	//if kmlLayer has been set before
	if (kmlLayer)
	{
		if(kmlLayer.getUrl()==kmlurl)
		{
			//if the url is the same as the one already loaded, then remove it
			kmlLayer.setMap(null);
			kmlLayer=null;
		}
		else
		{
			//different, so hide it , then call this function again (kmlLayer is now null)
			kmlLayer.setMap(null);
			kmlLayer=null;
			togglekmlLayer(kmlurl);
		}
	}
	else
	{
		//load the KML
		//kmlLayer = new google.maps.KmlLayer({url: kmlurl,map:map,suppressInfoWindows:false,preserveViewport:true});
		kmlLayer = new google.maps.KmlLayer({url: kmlurl,map:map,suppressInfoWindows:false,preserveViewport:true,clickable:false});
		google.maps.event.addListener(kmlLayer, 'status_changed', function () { console.log("loaded");} );
	}
}

var removeDuplicatesInPlace = function (arr) {
    var i, j, cur, found;
    for (i = arr.length - 1; i >= 0; i--) {
        cur = arr[i];
        found = false;
        for (j = i - 1; !found && j >= 0; j--) {
            if (cur === arr[j]) {
                if (i !== j) {
                    arr.splice(i, 1);
                }
                found = true;
            }
        }
    }
    return arr;
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = day+'/'+month+'/'+year+' '+hour+':'+minute+':'+second;   
    return dateTime;

}

function ftn_autocomplete_onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    //search();
  } else {
    document.getElementById('tb_searchlocation').placeholder = 'Search...';
  }
}

function togglesettingsunits()
{
	if(settings_unit_handler==MILES)
	settings_unit_handler=KMS;
	else
	settings_unit_handler=MILES;
}

// Download a file from a URL
function SaveToDisk(uri,name) 
{
	var link = document.createElement('a');
	link.href = uri;
	link.download = name;
	document.body.appendChild(link);
	link.click();  
}

function removeduplicatesfromcsv(input)
{
	var splitted = input.split(',');
	var collector = {};
	for (i = 0; i < splitted.length; i++) {
	   key = splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
	   collector[key] = true;
	}
	var out = [];
	for (var key in collector) {
	   out.push(key);
	}	
	return out.join(',');
}


function sendnotification(page,text)
{	
	$.ajax({
		url: '../ajax/sendemail.php',
		type: "GET",
		data: {
			text: text,
			page: page
		},
		success: function (result) {
			//console.log(result);	
		},
		error: function (x, y, z) {
			//console.log(y);
		}
	});
}






function addYourLocationButton(map) 
{
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0';
        var animationInterval = setInterval(function(){
            if(imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#you_location_img').css('background-position', imgX+'px 0px');
        }, 500);
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //marker.setPosition(latlng);
                map.setCenter(latlng);
				map.setZoom(16);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            });
        }
        else{
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}


function cSecondsToDHMS(seconds)
{
	minutes = Math.floor(seconds/60);
	hours = Math.floor(minutes/60);
	days = Math.floor(hours/24);

	hours = hours-(days*24);
	minutes = minutes-(days*24*60)-(hours*60);
	seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

	if (days==0)
	{
		return hours + " Hours, " + minutes + " Minutes";
	}
	else
	{
		return days + " Days, " + hours + " Hours, " + minutes + " Minutes";
	}
	
	//return days + " Days, " + hours + " Hours, " + minutes + " Minutes and " + seconds + " Seconds";
	//return "Days: " + days + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds;
}


//Leaflet Globals
function ftn_LG_FullScreen()
{
	map.fullscreenControl.toggleFullScreen();
}

function ftn_LG_DrawCircle(point,rad) {
    rad *= 1000; // convert to meters 
	draw_circle =L.circle(point, rad, {
		color: circleColor,
		fillColor: circleFillColor,
		fillOpacity: circleFillOpacity,
		weight: circleWeight
	});
	return draw_circle;
}

function ftn_LG_PlaceSimpleMarker(point,show) 
{
	var marker;
    var halfFMTmarkersizefactor = FMTmarkersizefactor/2;
    var myIcon = L.icon({
        iconUrl: 'images/markers/freemaptools.png',
        iconSize: [20*FMTmarkersizefactor,31*FMTmarkersizefactor],
        iconAnchor: [10*FMTmarkersizefactor,31*FMTmarkersizefactor],
        shadowUrl: 'images/markers/shadow.png',
        shadowSize: [28*FMTmarkersizefactor,22*FMTmarkersizefactor],
        shadowAnchor: [5,22],
    });

	marker = L.marker(point,{icon: myIcon,opacity:FMTmarkeropacity});
	if(show)
	{
		marker.addTo(map);
	}
	return marker;
}

function ftn_LG_PlaceMarker(id, point, text, showlabel) 
{
	var marker;
    var halfFMTmarkersizefactor = FMTmarkersizefactor/2;
    
    var myIcon = L.icon({
        iconUrl: 'images/markers/freemaptools.png',
        iconSize: [20*FMTmarkersizefactor,31*FMTmarkersizefactor],
        iconAnchor: [10*FMTmarkersizefactor,31*FMTmarkersizefactor],
        shadowUrl: 'images/markers/shadow.png',
        shadowSize: [28*FMTmarkersizefactor,22*FMTmarkersizefactor],
        shadowAnchor: [5,22],
    });
    
	marker = L.marker(point,{title:text,icon: myIcon,opacity:FMTmarkeropacity}).addTo(map).bindPopup(text);
    //marker = L.marker(point,{title:text}).addTo(map).bindPopup(text);
	
	if (showlabel)
	{
		marker.bindTooltip(text, 
		{
			permanent: true, 
			direction: 'right'
		});
	}
	
	return marker;
}

function ftn_LG_PlaceMarkerTitle(point,text,show) 
{
	var marker;
    var halfFMTmarkersizefactor = FMTmarkersizefactor/2;
    var myIcon = L.icon({
        iconUrl: 'images/markers/freemaptools.png',
        iconSize: [20*FMTmarkersizefactor,31*FMTmarkersizefactor],
        iconAnchor: [10*FMTmarkersizefactor,31*FMTmarkersizefactor],
        shadowUrl: 'images/markers/shadow.png',
        shadowSize: [28*FMTmarkersizefactor,22*FMTmarkersizefactor],
        shadowAnchor: [5,22],
    });

	marker = L.marker(point,{title:text,icon: myIcon,opacity:FMTmarkeropacity});
	if(show)
	{
		marker.addTo(map);
	}
	return marker;
}

function ftn_LG_PlaceCentreMarker(point,text,show) 
{
	var marker;
	//console.log(FMTmarkersizefactor);
    var halfFMTmarkersizefactor = FMTmarkersizefactor/2;
    var myIcon = L.icon({
        iconUrl: 'images/markers/freemaptools.png',
        iconSize: [20*FMTmarkersizefactor,31*FMTmarkersizefactor],
        iconAnchor: [10*FMTmarkersizefactor,31*FMTmarkersizefactor],
        shadowUrl: 'images/markers/shadow.png',
        shadowSize: [28*FMTmarkersizefactor,22*FMTmarkersizefactor],
        shadowAnchor: [5,22],
    });

	marker = L.marker(point,{title:text,icon: myIcon,opacity:FMTmarkeropacity}).bindPopup(text);
	if(show)
	{
		marker.addTo(map);
	}
	return marker;
}

function LGeodesicDistanceBetween(test) {
	var Geodesic = L.geodesic(test, {steps: 40, wrap: false});
	var obj;
	obj =  Geodesic._latlngs[0];
	var iMAx = obj.length;
	var distanceCounter = 0;
	for (i=0; i< iMAx-1; i++)
	{
		distanceCounter += Number(LGeodesicDistanceBetween_distance(obj[i].lat,obj[i].lng,obj[i+1].lat,obj[i+1].lng,"M"));
		
	}
	return distanceCounter.toFixed(2)
}

function LGeodesicDistanceBetween_distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="M") { dist = dist * 1609.344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist.toFixed(2)
}
//Leaflet Globals
	


function ftnMidPoint(lat1, lng1, lat2, lng2) {
	
    //-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //-- Return result
    return [lat3.toDeg(),lng3.toDeg()];
}

//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function () {
        return this * (180 / Math.PI);
    }
}
