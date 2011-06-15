/*!
 * eljs 0.0.1
 * The template markup engine that uses Javascript as an expression language.
 * https://github.com/cmilfont/eljs
 *
 * Copyright Milfont Consulting.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
 
function Eljs(config) {
    this.version  = "0.0.1";
    var self      = this;
    this.config   = config;
    this.json     = config.json     || {};
    this.template = config.template || "";
    this.loader   = config.loader   || this.defaultLoader;
    this.debugger = config.debug    || function(){};
    this.debug    = config.debug    || false;
    this.pattern  = /\${([^}]*)}/g;
    this.helpers  = {};
    if(config.helpers) {
        for(var name in config.helpers) {
            if(typeof name !== "undefined") {
                this.helpers[name] = config.helpers[name];
            }
        }
    }
    this.defaultLoader = function() {};
    this._prepareBodyFunction = function(bodyFunction, collection, collectionName) {
        for(var name in collection) {
            bodyFunction += " var " + name + " = " + collectionName + "." + name + "; ";
        }
        return bodyFunction;
    }
};

Eljs.prototype = {
    parse : function() {
        var self = this;
        return self.template.replace(self.pattern, function(content, statement, index, template){
            if(self.debug) self.debugger(this,  arguments);
            return self.parseStatement(statement);
        });
    },
    parseStatement: function(statement) {
        var self = this;
        var bodyFunction = self._prepareBodyFunction("", self.json, "json");
        bodyFunction = self._prepareBodyFunction(bodyFunction, self.helpers, "helpers");
        var el = bodyFunction + "return " + statement + ";";
        var parser = new Function("json", "helpers", el);
        return parser(self.json, self.helpers);
    }
}

if(module) module.exports.Eljs = Eljs;