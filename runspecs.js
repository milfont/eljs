//fake browser window
global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.jQuery = require("jquery").create(window);

//Test framework
var jasmine=require('jasmine-node');

//What we're testing
//require(__dirname + "/lib/jsonform.js")
global.Eljs = require(__dirname + "/src/el.js").Eljs;

// Templates 
var fs = require('fs');
var templatePath = __dirname + '/specs/template.html';

var templateWithHelperPath = __dirname + '/specs/templateWithHelper.html';

var template = fs.readFileSync(templatePath).toString();
var templateWithHelper = fs.readFileSync(templateWithHelperPath).toString();

global["template"] = template;
global["templateWithHelper"] = templateWithHelper;

var isVerbose = true;
var showColors = true;
jasmine.executeSpecsInFolder(__dirname + '/specs', function(runner, log){    
    process.exit(runner.results().failedCount?1:0);
}, isVerbose, showColors);
  
