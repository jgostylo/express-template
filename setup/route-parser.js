var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var globals = require(__dirname + "/../config/globals");

module.exports = function(routesObj, routeDir){
	return registerRoutes(routesObj, routeDir, router)
}

var registerRoutes = function(obj, routeDir){
	for(var key in obj){
		if(typeof obj[key] === "string"){
			
			var routeHandler = findRouteHandler(key, routeDir);
			var input = obj[key].split(" ");
			var method = input[0].toLowerCase();
			var path = input[1].toLowerCase();

			router[method](path, routeHandler.bind(globals));

		} else if(typeof obj[key] === "object"){

			var subRouteDir = routeDir + "/" + key;
			router = registerRoutes(obj[key], subRouteDir, router);

		}
	}
	return router;
}

var findRouteHandler = function(key, routeDir){
	var fileNames = fs.readdirSync(routeDir);
	var routeHandler = null;
	for(var i in fileNames){
		var routes = require(routeDir + "/" + fileNames[i]);
		if(key in routes){
			routeHandler = routes[key];
			break;
		}
	}
	if(!routeHandler){
		throw "You have not defined a '" + key + "' function in any file in " + routeDir
	}
	return routeHandler;
}