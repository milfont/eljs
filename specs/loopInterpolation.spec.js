describe('Loop interpolation with helper', function() {

    var userTest, renderedTemplate;

    beforeEach( function () {
        userTest = {
            name: "Christiano Milfont",
            address: [{
                country: "Brazil"
            }]
        };
        renderedTemplate = "<div><span>Christiano Milfont</span></div><ul><li>Brazil</li></ul>";
    });

    it('should parser a simple statement', function () {
        var EljsRenderer = new Eljs({ 
            template: loopTemplate
            , json : {
                "user": userTest
            }
            , helpers: {
                helper: function(text) {
                    return text;
                },
                loader: function() {
                    return "<li>${address.country}</li>";
                },
                partial: function(object, template) {
                    return function(item){
                       var json = {}; json[object] = item;
                       var nestedEljs = new Eljs({
                           json: json,
                           template: template
                       });
                       return nestedEljs.parse();
                    };
                },
                forEach: function(collection, callback) {
                    var content = "";
                    for (var element = 0; element < collection.length; element++) {
                        content += callback(collection[element]);
                    };
                    return content;
                }
            }
        });
        expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
    });
    
});