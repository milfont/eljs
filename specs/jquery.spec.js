describe('jQuery Plugin', function() {

    var userTest, renderedTemplate;

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

        jQuery("body").html("");
        jQuery("<div>").attr("id", "user_profile").appendTo("body");
        //mock ajax
        jQuery.extend({
            ajax: function( ajax ) {
                var fs = require('fs');
                var templatePath = __dirname + ajax.url;
                fs.readFile(templatePath, function (err, data) {
                  if (err) throw err;
                  ajax.success(data.toString());
                });
            }
        });
        //require plugin
        //require(__dirname + "/src/jquery.el");
        require("../src/jquery.el");
    });

    xit('should parser a template with jQuery', function () {
        var user_profile = jQuery("#user_profile");
        user_profile.render({
            url: '/templates/nestedSprites.html'
            , template: "user"
            , json: {"user": userTest }
        });
        waitsFor(function(){
            return user_profile.html() !== "";
        }, "Rendered Template", 10000);
        runs(function(){
            expect(user_profile.html().replace(/\n/g, "")).toEqual(renderedTemplate.toString());
        });
    });
    
});