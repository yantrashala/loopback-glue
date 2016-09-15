'use strict';

var boot = require('loopback-boot');
var compile = boot.compile;
var execute = boot.execute;
var toposort = require('toposort');

module.exports = function glueLoopBackApps(app, options, callback) {

	// Get the current app instructions first, as it takes
	// the top precendence
	var instructions = compile(options);

	//Checking if datasources configuration has any dynamic configuration
	// parameter
	getUpdatedDSConfig(instructions.config,instructions.dataSources,options);


	if(options.subapps && Array.isArray(options.subapps)) {
		options.subapps.forEach(function (subapp) {
			try {
				var moduleName = Object.keys(subapp)[0];
				var moduleOption = subapp[moduleName];
				var moduleObj = moduleOption.app || require(moduleName);
				mergeInstructions(instructions, moduleObj.glue.instructions,moduleOption);
			} catch (e) {
				console.log('error=',e.stack);
			}
		});
	}

	instructions.models = sortByInheritance(instructions.models);

	options.env = options.env || app.get('env');

	var start = app.start;

	app.start = function(cb) {
		var instance;
		execute(app, instructions, function(err) {
			if(err) {
				console.log('Error with loading configuration');
				cb(err,null);
			}
			instance = start.call(this,function(err){
				cb && cb(null,instance);
			});
		});
	};

	return callback(null, instructions);
};

var mergeInstructions = exports.mergeInstructions = function(instructions, subAppInstructions, options) {

	if(options.loadModels)
		mergeModels(instructions, subAppInstructions, options);
	if(options.loadDatasources)
		mergeDataSources(instructions, subAppInstructions, options);

};

var mergeModels = exports.mergeModels = function(instructions, subAppInstructions, options) {

	var parentModelMap = {};
	instructions.models = instructions.models || [];

	instructions.models.forEach(function(model) {
		parentModelMap[model.name] = model;
	});

	subAppInstructions.models = subAppInstructions.models || [];

	subAppInstructions.models.forEach(function(model) {
		if(!parentModelMap.hasOwnProperty(model.name)){
			instructions.models.push(model);
			console.log('Adding model from sub app: ',model.name);
		} else if(parentModelMap.hasOwnProperty(model.name) && !parentModelMap[model.name].definition) {
			parentModelMap[model.name].definition = model.definition;
			parentModelMap[model.name].sourceFile = model.sourceFile;
			console.log('Merging model from sub app: ',model.name);
		}
	});
};

var mergeDataSources = exports.mergeDataSources = function(instructions, subAppInstructions, options) {

	instructions.dataSources = instructions.dataSources || {};

	subAppInstructions.dataSources = subAppInstructions.dataSources || {};

	Object.keys(subAppInstructions.dataSources).forEach(function(dsName) {
		if(!instructions.dataSources.hasOwnProperty(dsName)) {
			instructions.dataSources[dsName] = subAppInstructions.dataSources[dsName];
			console.log('Adding dataSources from sub app: ',dsName);
		} else {
			mergeKeys(instructions.dataSources[dsName], subAppInstructions.dataSources[dsName]);
		}
	});
};

var getUpdatedDSConfig = exports.getUpdatedDSConfig = function(config, datasources,options) {
	var DYNAMIC_CONFIG_PARAM = /(.*)\$\{(\w+)\}(.*)/;

	datasources = datasources || [];

	Object.keys(datasources).forEach(function(dsName){

		Object.keys(datasources[dsName]).forEach(function(paramName){
			var paramValue = datasources[dsName][paramName];

			//console.log('paramValue==',typeof paramValue, paramValue);
			if(typeof paramValue === 'string') {
				var match = paramValue.match(DYNAMIC_CONFIG_PARAM);
				if (match) {

					//console.log(paramValue, match.length,'--',match[0],'--',match[1],'--',match[2],'--',match[3]);
					var appValue = config[(match[2])] || options[match[2]];

					if (appValue !== undefined) {
						datasources[dsName][paramName] = match[1] + appValue + match[3];
					} else {
						console.warn('%s does not resolve to a valid value. ' +
							'"%s" must be resolvable by app.get().', paramName, match[2]);
					}
				}
			}
		})
	});
};

function sortByInheritance(instructions) {
  // create edges Base name -> Model name
  var edges = instructions
    .map(function(inst) {
      return [getBaseModelName(inst.definition), inst.name];
    });

  var sortedNames = toposort(edges);

  var instructionsByModelName = {};
  instructions.forEach(function(inst) {
    instructionsByModelName[inst.name] = inst;
  });

  return sortedNames
    // convert to instructions
    .map(function(name) {
      return instructionsByModelName[name];
    })
    // remove built-in models
    .filter(function(inst) {
      return !!inst;
    });
}

function getBaseModelName(modelDefinition) {
  if (!modelDefinition)
    return undefined;

  return modelDefinition.base ||
    modelDefinition.options && modelDefinition.options.base;
}

function mergeKeys(destination, source) {
	Object.keys(source).forEach(function (key) {
		if (!destination.hasOwnProperty(key)) {
			destination[key] = source[key];
		} else {
			if (typeof destination[key] === 'object' && typeof source[key] === 'object') {
				mergeKeys(destination[key], source[key]);
			} else {
				console.warn('Leaving destination values for %s for %s.', key, destination.name);
			}
		}
	});
}
