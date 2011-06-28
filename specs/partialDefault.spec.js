describe('Strategies of partials', function() {

    var userTest, renderedTemplate, helpers, spriteLoader;

    describe('When have HTML Snippets in external file', function(){

        beforeEach( function () {
            userTest = {
                name: "Christiano Milfont",
                address: [{
                    country: "Brazil"
                }]
            };
            renderedTemplate = "<div><span>Christiano Milfont</span></div><ul><li>Brazil</li></ul>";

            helpers = function() {
                var fileLoader = function(template) {
                    var fs = require('fs');
                    var templatePath = __dirname + '/templates/' + template + '.partial.html';
                    var template     = fs.readFileSync(templatePath).toString();
                    return template;
                };

                return {
                    fileLoader: fileLoader,
                    partial: function(collection, template) {
                        var partialTemplate = "";
                        collection.forEach(function(item){
                            var json = {}; json[template] = item;
                            var nestedEljs = new Eljs({
                                json: json,
                                template: fileLoader(template)
                            });
                            partialTemplate = nestedEljs.parse();
                        });
                        return partialTemplate;
                    },
                    helper: function(text) {
                        return text;
                    }
                }
            }

        });

        it('should parser a statement with spartial', function () {
            var EljsRenderer = new Eljs({ 
                template: partialTemplate
                , json : {
                    "user": userTest
                }
                , helpers: helpers()
            });
            expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
        });

    })

    describe('When have HTML Sprites in same file', function(){
        beforeEach( function () {
            userTest = {
                name: "Christiano Milfont",
                address: [{
                    country: "Brazil"
                }]
            };
            renderedTemplate = "<div><span>Christiano Milfont</span></div><ul><li>Brazil</li></ul>";

            var fs = require('fs');
            var templatePath = __dirname + '/templates/sprites.html';
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
                        collection.forEach(function(item){
                            var json = {}; json[template] = item;
                            var nestedEljs = new Eljs({
                                json: json,
                                template: spriteLoader(template)
                            });
                            partialTemplate = nestedEljs.parse();
                        });
                        return partialTemplate;
                    },
                    helper: function(text) {
                        return text;
                    }
                }
            }
        });

        it('should parser a statement with partial', function () {
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
    
});