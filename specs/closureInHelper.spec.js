describe('Closure in helper', function() {

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

        });

        it('should a closure between helpers', function () {
            var EljsRenderer = new Eljs({ 
                template: partialTemplate
                , helpers: {
                    fileLoader: function(template) {
                        var fs = require('fs');
                        var templatePath = __dirname + '/templates/' + template + '.partial.html';
                        var template     = fs.readFileSync(templatePath).toString();
                        return template;
                    },
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
            });
            var json = {
                    "user": userTest
                };
            expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse(json).replace(/\n/g, ""));
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
        });

        it('should a closure between helpers', function () {
            var EljsRenderer = new Eljs({ 
                template: spriteLoader("user")
                , json : {
                    "user": userTest
                }
                , helpers: {
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
            });
            expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
        });
    });
    
});