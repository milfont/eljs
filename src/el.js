/*!
 * eljs 0.1.1
 * The template markup engine that uses Javascript as an expression language.
 * https://github.com/cmilfont/eljs
 *
 * Copyright Milfont Consulting.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

function Eljs(config) {
    var self = this;
    this.version  = "0.1.1";
    this.pattern  = /\$\{([^}]+)\}/g;
    this.compiled = false;
    this.compiledTemplate = '';
    this.cache    = {};

    this.processConfig = function(configuration) {
        if(configuration) {
            this.json     = configuration.json     || {};
            this.template = configuration.template || "";
        } else {
            this.json     = {};
            this.template = ""; 
        }
    };
    this.processConfig(config);

    var merge = (function merge(merged, source) {
         for(var property in source) {
             if(typeof source[property] === 'object' &&
                typeof merged[property] !== "undefined") {
                 merge(merged[property], source[property]);
             } else {
                merged[property] = source[property];
             }
         }
        return merged;
    });

    var _compiledStatements;
    var parser   = function parser(jsonELJS,helpersELJS) {
        merge(this, jsonELJS);
        merge(this, _compiledStatements());
        if(config && config.helpers) { merge(this, config.helpers); }
        var pr = (function(jsonELJS) {
             return function(key) {
                var fn = this['_ELJS_' + key];
                return (fn) ? fn() : "";
             };
        })(jsonELJS);
        return function(key) {
            return pr(key);
        };
    };

    this._createCompiledStatements = function(){
        var bodyFunction = "var methods = [];";
        for(var item in this.cache) {
            if(this.cache[item]) {
                var value = this.cache[item];
                bodyFunction += "methods['_ELJS_"+item+"'] = function() { return " + value + "; };";
            }
        }
        bodyFunction += " return methods;";
        return new Function(bodyFunction);
    };
    
    this._compile = function() {
        var self = this;
        this.compiledTemplate = this.template.replace(this.pattern, function(exp, value, index, string){
            self.cache[index] = value;
            return "${" + index + "}";
        });
        _compiledStatements = this._createCompiledStatements();
        this.compiled = true;
        return this;
    };

    this._parse = function() {
        var html = "";
        var self = this;
        var prepared_parser = parser(self.json);
        html = this.compiledTemplate.replace(this.pattern, function(exp, value, index, string){
            return prepared_parser(value);
        });
        return html;
    };
    
}

Eljs.prototype = {
    compile: function(config) {
        if(typeof config !== 'undefined') { this.processConfig(config); }
        return this._compile();
    },
    parse : function(json) {
        if(json) { this.json = json; }
        if(!this.compiled) { this.compile(); }
        return this._parse();
    }
};

if(typeof module !== 'undefined') { module.exports.Eljs = Eljs; }