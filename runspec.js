//fake browser window
var fs = require('fs');
var sys = require('sys');
var path = require('path');

var window = require("jsdom")
                .jsdom()
                .createWindow();

global.window = window;
global["win"] = window;


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

var isVerbose = true;
var showColors = true;

var spec = process.argv[2];

require(__dirname + "/" + spec.replace(/\.\w+$/, ""));

  var log = [];
  var columnCounter = 0;
  var start = 0;
  var elapsed = 0;
   var verbose = true;
  var colors = true;

  var done = function(runner, log){    
    process.exit(runner.results().failedCount?1:0);
};

  var ansi = {
    green: '\033[32m',
    red: '\033[31m',
    yellow: '\033[33m',
    none: '\033[0m'
  };


var jasmineEnv = jasmine.getEnv();

 jasmineEnv.reporter = {
    log: function(str){
    },

    reportSpecStarting: function(runner) {
    },

    reportRunnerStarting: function(runner) {
      sys.puts('Started');
      start = Number(new Date);
    },

    reportSuiteResults: function(suite) {
      var specResults = suite.results();
      var path = [];
      while(suite) {
        path.unshift(suite.description);
        suite = suite.parentSuite;
      }
      var description = path.join(' ');

      if (verbose)
        log.push('Spec ' + description);

      specResults.items_.forEach(function(spec){
        if (spec.failedCount > 0 && spec.description) {
          if (!verbose)
              log.push(description);
          log.push('  it ' + spec.description);
          spec.items_.forEach(function(result){
            log.push('  ' + result.trace.stack + '\n');
          });
        } else {
          if (verbose)
              log.push('  it ' + spec.description);
        }
      });
    },

    reportSpecResults: function(spec) {
      var result = spec.results();
      var msg = '';
      if (result.passed())
      {
        msg = (colors) ? (ansi.green + '.' + ansi.none) : '.';
//      } else if (result.skipped) {  TODO: Research why "result.skipped" returns false when "xit" is called on a spec?
//        msg = (colors) ? (ansi.yellow + '*' + ansi.none) : '*';
      } else {
        msg = (colors) ? (ansi.red + 'F' + ansi.none) : 'F';
      }
      sys.print(msg);
      if (columnCounter++ < 50) return;
      columnCounter = 0;
      sys.print('\n');
    },


    reportRunnerResults: function(runner) {
      elapsed = (Number(new Date) - start) / 1000;
      sys.puts('\n');
      log.forEach(function(log){
        sys.puts(log);
      });
      sys.puts('Finished in ' + elapsed + ' seconds');

      var summary = jasmine.printRunnerResults(runner);
      if(colors)
      {
        if(runner.results().failedCount === 0 )
          sys.puts(ansi.green + summary + ansi.none);
        else
          sys.puts(ansi.red + summary + ansi.none);
      } else {
        sys.puts(summary);
      }
      (done||noop)(runner, log);
    }
  };

jasmineEnv.execute();

/*
jasmine.executeSpecsInFolder(__dirname + '/specs/' + , function(runner, log){    
    process.exit(runner.results().failedCount?1:0);
}, isVerbose, showColors);
*/