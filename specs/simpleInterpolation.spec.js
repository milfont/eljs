describe('Simple variable interpolation and statements', function() {

    var userTest, renderedTemplate;

    beforeEach( function () {
        userTest = {
            name: "Christiano Milfont",
            address: [{
                country: "Brazil"
            }]
        };
        renderedTemplate = "<div><span>teste de template,  Aqui deveria ter uma sentença [true] com cuidado Christiano Milfont</span></div>";
    });

    it('should parser a simple statement', function () {
        var EljsRenderer = new Eljs({ 
            template: template
            , json : {
                "user": userTest
            }
        });
        expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
    });
    
    it('should parser with helper block', function(){
        var EljsRenderer = new Eljs({
            template: templateWithHelper
            , json : {
                "user": userTest
            }
            , helpers: {
                helper: function(text) {
                    return text;
                }
            }
        });
        expect(renderedTemplate.toString()).toEqual(EljsRenderer.parse().replace(/\n/g, ""));
    });
    
});