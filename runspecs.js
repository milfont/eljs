//fake browser window
global.window = require("jsdom")
                .jsdom()
                .createWindow();
global.jQuery = require("jquery").create(window);

//Test framework
var jasmine = require('jasmine-node');

//What we're testing
//require(__dirname + "/lib/jsonform.js")
global.Eljs = require(__dirname + "/src/el.js").Eljs;

// Templates 
var fs = require('fs');
var templatePath           = __dirname + '/specs/templates/template.html';
var templateWithHelperPath = __dirname + '/specs/templates/templateWithHelper.html';
var loopTemplatePath       = __dirname + '/specs/templates/loopTemplate.html';
var partialTemplatePath    = __dirname + '/specs/templates/templateWithPartial.html';

var template           = fs.readFileSync(templatePath).toString();
var templateWithHelper = fs.readFileSync(templateWithHelperPath).toString();
var loopTemplate       = fs.readFileSync(loopTemplatePath).toString();
var partialTemplate    = fs.readFileSync(partialTemplatePath).toString();

global["template"]           = template;
global["templateWithHelper"] = templateWithHelper;
global["loopTemplate"]       = loopTemplate;
global["partialTemplate"]    = partialTemplate;

// var isVerbose = true;
// var showColors = true;
// jasmine.executeSpecsInFolder(__dirname + '/specs', function(runner, log){    
//     process.exit(runner.results().failedCount?1:0);
// }, isVerbose, showColors);
  

var isVerbose = false;
var showColors = true;
var teamcity =  false;
var useRequireJs = false;
var extensions = "js";
var match = '.';
var matchall = false;
var autotest = false;
var useHelpers = true;
var forceExit = false;
var captureExceptions = false;
var includeStackTrace = true;
var growl = false;

var junitreport = {
  report: false,
  savePath : "./reports/",
  useDotNotation: true,
  consolidate: true
}

var regExpSpec = new RegExp(match + (matchall ? "" : "spec\\.") + "(" + extensions + ")$", 'i')

var options = {
  specFolders:   specFolders,
  onComplete:   onComplete,
  isVerbose:    isVerbose,
  showColors:   showColors,
  teamcity:     teamcity,
  useRequireJs: useRequireJs,
  regExpSpec:   regExpSpec,
  junitreport:  junitreport,
  includeStackTrace: includeStackTrace,
  growl:        growl
}

jasmine.executeSpecsInFolder(options);