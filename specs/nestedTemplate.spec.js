describe('Strategies of nested partials', function() {

    var userTest, renderedTemplate, helpers, spriteLoader;

    beforeEach( function () {
        userTest = {
            name: "Christiano Milfont",
            corporation: {
                name: "Milfont Consulting",
                address: [{
                    country: "Brazil"
                }]
            }
        };
        renderedTemplate = "    <div><span>Christiano Milfont</span></div>    <ul>    <span>Milfont Consulting</span>    <ul>     <li>Brazil</li> </ul></ul>";

        var fs = require('fs');
        var templatePath = __dirname + '/templates/nestedSprites.html';
        var template     = fs.readFileSync(templatePath).toString();
        jQuery("body").html("");
        jQuery(template).appendTo("body");

        spriteLoader = function(sprite) {
            var snippet = jQuery("#"+sprite).html().toString();
            return snippet;
        };

        helpers = function() {
            return {
                spriteLoader: spriteLoader,
                partial: function(collection, template) {
                    var partialTemplate = "";
                    if(collection.forEach) {
                        collection.forEach(function(item){
                            var json = {}; json[template] = item;
                            var nestedEljs = new Eljs({
                                json: json,
                                template: spriteLoader(template)
                                , helpers: helpers()
                            });
                            partialTemplate = nestedEljs.parse();
                        });
                    } else {
                        var json = {}; json[template] = collection;
                        var nestedEljs = new Eljs({
                            json: json,
                            template: spriteLoader(template)
                            , helpers: helpers()
                        });
                        partialTemplate = nestedEljs.parse();
                    }
                    return partialTemplate;
                },
                helper: function(text) {
                    return text;
                }
            }
        }
    });

    it('should parser a template with nested partial', function () {
        var EljsRenderer = new Eljs({ 
            template: spriteLoader("user")
            , json : {
                "user": userTest
            }
            , helpers: helpers()
        });
        expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
    });
    
});