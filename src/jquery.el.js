if(typeof Array.prototype.last == "undefined") {
  Array.prototype.last = function() {
    return (this.length > 0) ? this[this.length - 1] : -1;
  };
}

var trying = function(propriedade) {
    return (function percorrer(property, objeto) {
        var hierarquia = (property.split)? property.split(".") : [""];
        objeto = objeto[ hierarquia.shift() ];
        return (hierarquia.length > 0 && typeof objeto !== "undefined")?
            percorrer(hierarquia.join("."), objeto) : objeto;
    })(propriedade, this);
};

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

(function($) {

    var sprites = $("<div>");
    var templates = {};
    var pattern  = /\$\{(\s*?)\partial\(([^}]+)\)\}/g;

    var spriteLoader = function(sprite) {
        sprite = "div#" + sprite.replace(/\"/g, "").replace(/\./g, "\\.").toString();
        return sprites.find(sprite).html().toString();
    };
    
    var findEngine = function(sprite) {
        return templates[sprite]            ||
               templates["'"+sprite+"'"]    ||
               templates["\""+sprite+"\""];
    };
    
    $.extend({
        getTemplates: function() {
            return templates;
        },
        clearTemplates: function() {
            sprites.html("");
            templates = {};
        },
        compileTemplates: function(templateConfig) {
            var helpers = templateConfig.helpers || {};
            helpers.partial = function(sprite) {
                var json = templates[templateConfig.sprite].json;
                json.trying = trying;
                var html = "";
                var engine = findEngine(sprite);
                var arr = json.trying(sprite);
                for (var i = 0; i < arr.length; i++) {
                    var singularized = sprite.split(".").last().replace(/s$/i,
                            "").toLowerCase();
                    var partialJSON = {};
                    partialJSON[singularized] = arr[i];
                    html = html + engine.parse(partialJSON);
                }
                return html;
            };
            
           $.get(templateConfig.url, function(template) {
                sprites.append(template);
                var partials = template.match(pattern);
                if(partials) {
                    for(var i = 0; i < partials.length; i++) {
                        var nestedTemplate = partials[i].replace(pattern, "$2");
                        var tmpl = spriteLoader(nestedTemplate);
                        templates[nestedTemplate] = new Eljs({
                            template: tmpl
                        }).compile();
                    }
                }
                templates[templateConfig.sprite] = new Eljs({
                    template: spriteLoader(templateConfig.sprite),
                    helpers: helpers
                }).compile();
                if(typeof templateConfig.callback === "function") {
                    templateConfig.callback( templates[templateConfig.sprite] );
                }
            });
        }
    });
    
    $.fn.extend({
        render: function(templateConfig) {
            var content = $(this);
            var fnCallback = (function(cb) {
                return function(renderer) {
                    content.html(renderer.parse(templateConfig.json));
                    if(cb) { cb(content); }
                };
            })(templateConfig.callback);
            
            var engine = findEngine(templateConfig.sprite);
            
            var tc = merge({}, templateConfig);
            tc.callback = fnCallback;
            
            if(engine) {
                tc.callback(engine);
            } else {
                $.compileTemplates(tc);
            }
            return content;
        }
    });
})(jQuery);