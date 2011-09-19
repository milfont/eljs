if(typeof Array.prototype.last == "undefined") {
  Array.prototype.last = function() {
    return (this.length > 0) ? this[this.length - 1] : -1;
  };
}

Object.defineProperty(Object.prototype, 'trying', {
    enumerable: false,
    value: function(property) {
        var retorno = false;
        var lastProperty = this;
        (function percorrer(property) {
            var hierarchy = property.split(".");
            var first = hierarchy[0];
            lastProperty = (lastProperty) ?  lastProperty[first]: undefined;
            var type = typeof lastProperty;
            retorno = (type != 'undefined');
            if(type == 'function') {lastProperty = lastProperty();}
            if(hierarchy.length > 1) {
                first = hierarchy.shift();
                percorrer(hierarchy.join("."));
            }
        })(property);
        return (retorno)? lastProperty : retorno;
    }
});

(function($) {

    var sprites = $("<div>");
    var templates = {};
    var pattern  = /\$\{partial\(([^}]+)\)\}/g;

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
        compileTemplates: function(templateConfig, callback) {
           $.get(templateConfig.url, function(template) {
                sprites.append(template);
                /**
                 * Partial Process
                 */
                var partials = template.match(pattern);
                if(partials) {
                    for(var i = 0; i < partials.length; i++) {
                        var nestedTemplate = partials[i].replace(pattern, "$1");
                        var tmpl = spriteLoader(nestedTemplate);
                        templates[nestedTemplate] = new Eljs({
                            template: tmpl
                        }).compile();
                    }
                }

                templates[templateConfig.sprite] = new Eljs({
                    template: spriteLoader(templateConfig.sprite),
                    helpers: {
                        partial: function(sprite) {
                            var json = templates[templateConfig.sprite].json;
                            var html = "";
                            var engine = findEngine(sprite);
                            var arr = json.trying(sprite);
                            for(var i = 0; i < arr.length; i++) {
                                var singularized = sprite.split(".").last().replace(/s$/i, "").toLowerCase();
                                var partialJSON = {};
                                partialJSON[singularized] = arr[i];
                                html = html + engine.parse(partialJSON);
                            }
                            return html;
                        }
                    }
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