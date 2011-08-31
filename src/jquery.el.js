(function ($) {

    var content = $("<div>");

    var spriteLoader = function(sprite) {
        return $(content).find("#"+sprite).html().toString();
    };

    var helpers = function() {
        return {
            spriteLoader: spriteLoader,
            partial: function(collection, template) {
                var partialTemplate = "";
                if(collection.forEach) {
                    collection.forEach(function(item){
                        var json = {}; 
                        json[template] = item;
                        var nestedEljs = new Eljs({
                            json: json,
                            template: spriteLoader(template),
                            helpers: helpers()
                        });
                        partialTemplate = nestedEljs.parse();
                    });
                } else {
                    var json = {}; 
                    json[template] = collection;
                    var nestedEljs = new Eljs({
                        json: json,
                        template: spriteLoader(template),
                        helpers: helpers()
                    });
                    partialTemplate = nestedEljs.parse();
                }
                return partialTemplate;
            }
        };
    };

    var render = function(config) {
        return (new Eljs({ 
            template: spriteLoader( config.template ),
            json : config.json, 
            helpers: helpers()
        })).parse();
    };

    $.fn.extend({
        compile: function(config) {
            
        },
        render: function(config) {
            var self = this;
            $.ajax({
                url: config.url,
                dataType: "html",
                success: function(data){
                    content.html(data);
                    var rendered = render(config);
                    self.html( rendered );
                    if(typeof config.callback === "function") {
                        config.callback(rendered);
                    }
                }
            });
            return this;
        }
    });

})(jQuery);