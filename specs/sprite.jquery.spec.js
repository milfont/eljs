describe('jQuery Plugin', function() {

    var jsonTemplate, renderedTemplate, _body;

    beforeEach( function () {
        jsonTemplate = {
                "Widgets": {
                    Modal: {
                        head: {
                            title: "Teste de Modal"
                        },
                        body: "Teste do corpo"
                    },
                    Buttons: [
                        {
                            name: "Butao", css: "teste",  text: "Salvar"
                        },
                        {
                            name: "Butao", css: "teste",  text: "Editar"
                        }
                    ]
                }
            };
        renderedTemplate = '    <div class="modal">      <div class="modal-header">        <h3>Teste de Modal</h3>        <a href="#" class="close">×</a>          </div>      <div class="modal-body">        <p>Teste do corpo</p>      </div>      <div class="modal-footer">            <a href="#" name="Butao" class="teste">Salvar</a>   <a href="#" name="Butao" class="teste">Editar</a>      </div>    </div>';
        _body = jQuery("body");
        _body.html("");
        
        //mock ajax
        jQuery.extend({
            ajax: function( ajax ) {
                var fs = require('fs');
                var templatePath = __dirname + ajax.url;
                var template     = fs.readFileSync(templatePath).toString();
                ajax.success(template);
            }
        });
        //require plugin
        //require(__dirname + "/src/jquery.el");
        require("../src/jquery.el");
    });

    it('should compile a template with jQuery', function () {
    	
    	jQuery.compileTemplates({
            url: "/templates/sprite.jquery.html", sprite: "Widgets.Modal"
        });
    	
        waitsFor(function(){
            return _body.render(jsonTemplate, "Widgets.Modal").html() !== "";
        }, "Rendered Template", 10000);
        runs(function(){
            expect(_body.html().replace(/\n/g, "")).toEqual(renderedTemplate.toString());
        });
        
    });
    
});