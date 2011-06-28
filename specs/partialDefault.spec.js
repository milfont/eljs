describe('Strategies of partials', function() {

    var userTest, renderedTemplate, helpers;

    describe('When have HTML Snippets', function(){

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

        it('should parser a statement with partial', function () {
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

    describe('When have HTML Sprites', function(){
        beforeEach( function () {
            userTest = {
                name: "Christiano Milfont",
                address: [{
                    country: "Brazil"
                }]
            };
            renderedTemplate = "<div><span>Christiano Milfont</span></div><ul><li>Brazil</li></ul>";

            helpers = function() {

                var loader = function() {
                    return "<li>${address.country}</li>";
                };

                return {
                    loader: loader,
                    partial: function(collection, template) {
                        var partialTemplate = "";
                        collection.forEach(function(item){
                            var json = {}; json[template] = item;
                            var nestedEljs = new Eljs({
                                json: json,
                                template: loader()
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
                template: partialTemplate
                , json : {
                    "user": userTest
                }
                , helpers: helpers()
            });
            expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
        });
    });
    
});