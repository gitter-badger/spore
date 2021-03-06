"use strict";

var deasync         = require('deasync');
var _               = require('underscore');

var ipfs = require('./ipfs.es6')
var spore = require('./spore.es6')

// var getLinkSync     = deasync( spore.getLink );

var update = function( config ) {
  var pkg = require('./package.es6')( config );
  
  var names = _.keys( pkg.json.dependencies );
  
  var newDeps = names.map( name => {
    
    let newLink = spore.getLinkSync( name );
    let oldLink = pkg.json.dependencies[ name ];
    
    // return ( newLink != oldLink )? {name,newLink}: null;
    return {name,newLink};
  }).filter( o => o !== null );
  
  // newDeps.forEach( o => {
  //   
  //   pkg.removeDep( o.name );
  //   
  // });
  

  // TODO - known issue:
  // if an error occurs while installing the package
  // there won't be a rollback
  // 
  // TODO - dep removing is not nested
  newDeps.forEach( o => {
    
    pkg.removeDep( o.name );
    
  });
  
  newDeps.forEach( o => {
    
    pkg.installDep({
      working_dir: config.working_dir,
      package_name: o.name
    });
    
  });
  
  pkg.saveJson();
  
};

module.exports = update;
