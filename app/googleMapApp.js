var currentAddr,
	currentLatlng;
var geocoder = new google.maps.Geocoder();
// init gmap3 plugin -> draw google map here
$(function(){
	// set destination
	// Address: Boston Airort
	$('#map-canvas-express').gmap3({
		map:{
			options:{
				center:[42.363143, -71.0078921],
				zoom: 9
			}
		},
		marker:{
			latLng:[42.363143,-71.0078921], 
			id:"loganAirportExpress",
			data:"Boston Logan International Airport<br/>1 Harborside Dr, Boston, MA 02128", 
			options:{
				icon: "http://maps.google.com/mapfiles/marker_green.png"
			},
			events:{
				mouseover: function(marker, event, context){
					var map = $(this).gmap3("get"),
						infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.open(map, marker);
						infowindow.setContent(context.data);
					} else {
						$(this).gmap3({
							infowindow:{
								anchor:marker, 
								options:{content: context.data}
							}
						});
					}
				},
				mouseout: function(){
					var infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.close();
					}
				}
			}
		}
	});

	my.maps.map = $("#map-canvas-express").gmap3('get');

	$('#map-canvas-mbta').gmap3({
		map:{
			options:{
				center:[42.363143,-71.0078921],
				zoom: 9
			}
		},
		marker:{
			latLng:[42.363143,-71.0078921],
			id:"loganAirportMbta",
			data:"Boston Logan International Airport<br/>1 Harborside Dr, Boston, MA 02128", 
			options:{
				icon: "http://maps.google.com/mapfiles/marker_green.png"
			},
			events:{
				mouseover: function(marker, event, context){
					var map = $(this).gmap3("get"),
						infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.open(map, marker);
						infowindow.setContent(context.data);
					} else {
						$(this).gmap3({
							infowindow:{
								anchor:marker, 
								options:{content: context.data}
							}
						});
					}
				},
				mouseout: function(){
					var infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.close();
					}
				}
			}
		}
	});

	$('#map-canvas-express').gmap3({
		map:{
			options:{
				center:[42.363143, -71.0078921],
				zoom: 9
			}
		},
		marker:{
			values:[
				{address:"262 Forbes Road, Braintree, MA", data:"<strong><a href='http://www.massport.com/logan-airport/braintree/' target='_blank'>Logan Express Braintree</a></strong><br />  <strong>Address:</strong> 262 Forbes Road, Braintree, MA<br /> Phone: (781) 843-0283<br />"},
				{address:"1 Worcester Road, Framingham, MA", data:"<strong><a href='http://www.massport.com/logan-airport/framingham/' target='_blank'>Logan Express Framingham</a><br /> </strong><strong>Address:</strong> 1 Worcester Road, Framingham, MA <br /> Phone: (<span>508) 872-5424</span><br />"},
				{address:"164 Newbury Street, Peabody, MA", data:"<strong><a href='http://www.massport.com/logan-airport/peabody/' target='_blank'>Logan Express Peabody</a> <br /> </strong><strong>Address: </strong>164 Newbury Street, Peabody, MA <br /> Phone: (978) 536-5081<br/>"},
				{address:"100 Atlantic Ave, Woburn, MA", data:"<strong><a href='http://www.massport.com/logan-airport/woburn/' target='_blank'>Logan Express Woburn</a><br /> </strong><strong>Address:</strong> 100 Atlantic Ave, Woburn, MA <br /> Phone: (781) 721-9487<br />"}
			],
			options:{
				draggable: false,
				zIndex: 999
			},
			events:{
				mouseover: function(marker, event, context){
					var map = $(this).gmap3("get"),
						infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.open(map, marker);
						infowindow.setContent(context.data);
					} else {
						$(this).gmap3({
							infowindow:{
								anchor:marker, 
								options:{content: context.data}
							}
						});
					}
				},
				click: function(marker, event, context){

					if(typeof currentAddr !== 'undefined'){
						// draw router from input location to current station
						geocoder.geocode( { 'address': currentAddr}, function(results, status) {
							currentLatlng = results[0].geometry.location;
							// render the path from current location to four station
							new Route([ [currentLatlng.lat(),currentLatlng.lng()],[marker.getPosition().lat(),marker.getPosition().lng()]]).drawRoute(my.maps.map);
						})
						$('.transInfo').empty();
						displayDetailedRouter(currentAddr, marker.getPosition().lat(), marker.getPosition().lng());
					}
					// draw router from current station to logan airport
					//new Route([ [marker.getPosition().lat(),marker.getPosition().lng()],[42.363143,-71.0078921]]).drawRoute(my.maps.map);
					$(this).gmap3({
						clear: {
							id: "currentMarker"
						}
					});
					/*
					var expectDate = $('#date').val();
					if(typeof expectDate !== 'undefined'){
						$('#date').val(new Date());
					}
					$('.transInfo').text($('#date').val())
					*/
					
				}
			}
		}
	});
	
});

// handle user's input event with current location
$( "#submitBtn" ).click(function() {
	// get current address
	currentAddr = $( "#address" ).val();

	$('#map-canvas-express').gmap3({
		// calculate the distance to Logan Airport
		getdistance:{
			options:{ 
				origins:[currentAddr], 
				destinations:["1 Harborside Dr, Boston, MA"],
				travelMode: google.maps.TravelMode.DRIVING
			},
			callback: function(results, status){
				if (results){
					for (var i = 0; i < results.rows.length; i++){
						var elements = results.rows[i].elements;
						for(var j=0; j<elements.length; j++){
							switch(elements[j].status){
								case "OK":

								if(elements[j].distance.value > 160000){
									alert('The distance is to far away, which we cannot give any suggestion!');
									location.reload();
								}
								break;
								case "NOT_FOUND":
									alert('The origin and/or destination of this pairing could not be geocoded');
								break;
								case "ZERO_RESULTS":
									alert('No route could be found between the origin and destination.');
								break;
							}
						}
					} 
				} else {
					return;
				}
			}
		},

		marker:{
			address:currentAddr, 
			id : "currentMarker",
			data:"My Current Location", 
			options:{
				icon: "http://www.google.com/mapfiles/dd-start.png"
			}
		},
		autofit:{}
	});

	renderRouterByOriginalAddr(	currentAddr, 42.363143,-71.0078921, '#map-canvas-mbta', 'TRANSIT');

	$('#map-canvas-mbta').gmap3({
		clear: {
			id: "loganAirportMbta"
		}
	});

	$('.transInfo').text('Click Garages to Display more detailed informarion!')
});


function renderRouter(oriLat, oriLng, desLat, desLng, divName, travelMode) {
	travelMode  = typeof travelMode  !== 'undefined' ? travelMode  : "DRIVING";
	$(divName).gmap3({
		getroute:{
			options:{
				origin:[oriLat,oriLng],
				destination:[desLat,desLng],
				travelMode:google.maps.TravelMode[travelMode]
			},
		callback: function(results){
			if (!results) return;
			$(this).gmap3({
				directionsrenderer:{
				  options:{
					directions:results
					} 
				}
				});
			}
		},
		autofit:{}
	});
	return;
}

function renderRouterByOriginalAddr(oriAddr, desLat, desLng, divName, travelMode) {
	travelMode  = typeof travelMode  !== 'undefined' ? travelMode  : "DRIVING";
	$(divName).gmap3({
		getroute:{
			options:{
				origin:oriAddr,
				destination:[desLat,desLng],
				travelMode:google.maps.TravelMode[travelMode]
			},
		callback: function(results){
			if (!results) return;
			$(this).gmap3({
				directionsrenderer:{
				  options:{
					directions:results
					} 
				}
				});
			}
		},
		autofit:{}
	});
	return;
}

function displayDetailedRouter(currentAddr, desLat, desLng){
	$("#map-canvas-express").gmap3({ 
		getroute:{
			options:{
				origin:currentAddr,
				destination:[desLat,desLng],
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			},
			callback: function(results){
				if (!results) return;
				$(this).gmap3({
					directionsrenderer:{
						container: $("#infoDiv").addClass("googlemap"),
						options:{
							directions:results
						} 
					}
				});
			}
		}
	})
}