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
        compileTemplates: function(templateConfig, callback) {
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
                if(typeof callback === "function") {
                    callback( templates[templateConfig.sprite] );
                }
            });
        }
    });
    
    $.fn.extend({
        render: function(json, sprite, url) {
            var content = $(this);
            var fnCallback = function(renderer) {
                content.append(renderer.parse(json));
            };
            var engine = findEngine(sprite);
            if(engine) {
                fnCallback(engine);
            } else {
                $.compileTemplates({url: url, sprite: sprite}, fnCallback);
            }
            return content;
        }
    });
})(jQuery);