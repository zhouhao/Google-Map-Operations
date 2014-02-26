var my={directionsSVC:new google.maps.DirectionsService(), maps:{}, routes:{}};

/**
	* base-class	  
	* @param points optional array array of lat+lng-values defining a route
	* @return object Route
	**/							
function Route(points)
{
	this.origin	 = null;
	this.destination  = null;
	this.waypoints	 = [];
	if(points && points.length>1)
	{
		this.setPoints(points);
	}
	return this; 
};

/**
	*  draws route on a map 
	*				  
	* @param map object google.maps.Map 
	* @return object Route
	**/						  
Route.prototype.drawRoute = function(map, isDraggable, travelMode)
{
	var _this=this;
	isDraggable = typeof isDraggable !== 'undefined' ? isDraggable : false;
	travelMode  = typeof travelMode  !== 'undefined' ? travelMode  : "DRIVING";
	
	my.directionsSVC.route(
	  {
	  	'origin': this.origin,
		'destination': this.destination,
		'waypoints': this.waypoints,
		'travelMode': google.maps.TravelMode[travelMode] //google.maps.DirectionsTravelMode.DRIVING,
	  },
	  function(res,sts) 
	  {
			if(sts==google.maps.DirectionsStatus.OK){
			if(!_this.directionsRenderer)
			{
			  _this.directionsRenderer 
				= new google.maps.DirectionsRenderer({ 'draggable':isDraggable }); 
								 }
			  _this.directionsRenderer.setMap(null);
			  _this.directionsRenderer.setMap(map);
			  _this.directionsRenderer.setDirections({routes: []});
			  _this.directionsRenderer.setDirections(res);
			  
			  google.maps.event.addListener(_this.directionsRenderer,
													  'directions_changed',
													  function()
													  {
														 _this.setPoints();
													  }
													  );
							}	
	  });
	return _this;
 };

/**
	* sets map for directionsRenderer	  
	* @param map object google.maps.Map
	**/				 
Route.prototype.setGMap = function(map){
	this.directionsRenderer.setMap(map);
};

/**
	* sets origin, destination and waypoints for a route 
	* from a directionsResult or the points-param when passed	 
	* 
	* @param points optional array array of lat+lng-values defining a route
	* @return object Route		  
	**/
Route.prototype.setPoints = function(points)
{
	this.origin = null;
	this.destination = null;
	this.waypoints = [];
	if(points)
	{
	  for(var p=0;p<points.length;++p)
	  {
		 this.waypoints.push({location:new google.maps.LatLng(points[p][0],
																				points[p][1]),
									 stopover:false});
	  }
	  this.origin=this.waypoints.shift().location;
	  this.destination=this.waypoints.pop().location;
	}
	else
	{
	  var route=this.directionsRenderer.getDirections().routes[0];
	  
	  for(var l=0;l<route.legs.length;++l)
	  {
		 if(!this.origin)this.origin=route.legs[l].start_location;
		 this.destination = route.legs[l].end_location;
		 
		 for(var w=0;w<route.legs[l].via_waypoints.length;++w)
		 {
			this.waypoints.push({location:route.legs[l].via_waypoints[w],
										stopover:false});
		 }
	  }
	  //the route has been modified by the user when you're here
	  //you may call now this.getPoints() and work with the result
	}

	return this;
};

/**
	* retrieves points for a route 
	*			
	* @return array			
	**/
Route.prototype.getPoints = function()
{
var points=[[this.origin.lat(),this.origin.lng()]];

for(var w=0;w<this.waypoints.length;++w){
	points.push([this.waypoints[w].location.lat(), this.waypoints[w].location.lng()]);
}

points.push([this.destination.lat(), this.destination.lng()]);
return points;
};