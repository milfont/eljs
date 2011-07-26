describe('Strategies of compile template', function() {

    var userTest, renderedTemplate, helpers, spriteLoader;

        beforeEach( function () {
            userTest = {
                name: "Christiano Milfont",
                address: [{
                    country: "Brazil"
                }]
            };
            renderedTemplate = "<div><span>Christiano Milfont</span></div><ul><li>Brazil</li></ul>";

            var fs = require('fs');
            var templatePath = __dirname + '/templates/sprites2.html';
            var template     = fs.readFileSync(templatePath).toString();

            var content = jQuery("<div>");
            content.append(template);

            spriteLoader = function(sprite) {
                var html = jQuery(content).find("#"+sprite).html().toString();
                return html
            };

        });

        it('should parser a statement with partial', function () {
            var json = {
                user: userTest
            };
            var EljsRenderer = new Eljs({ 
                template: spriteLoader("user2"),
                helpers:{
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
            var parser = EljsRenderer.compile();
            var rendered = parser.parse(json).replace(/\n/g, "");
            expect(renderedTemplate.toString()).toEqual(rendered);
        });

        it('should partial config is passed in compile method', function () {
            var json = {
                user: userTest
            };
            var EljsRenderer = new Eljs({
                helpers:{
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
            var parser = EljsRenderer.compile({
                template: spriteLoader("user2"),
            });
            var rendered = parser.parse(json).replace(/\n/g, "");
            expect(renderedTemplate.toString()).toEqual(rendered);
        });
    
});