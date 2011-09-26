describe('jQuery Plugin with Table', function() {

    var jsonTemplate, renderedTemplate, renderedTemplate2, _body, templateConfig;
    
    beforeEach( function () {
        jsonTemplate = {
           "_id": "ecdf4c6d03f133c22cefe38adb00c94b",
           "_rev": "7-eb99cb371c25487d014e8640ff62505c",
           "type": "statement",
           "date": "01/01/2011",
           "opportunity": {
               "_id": "ecdf4c6d03f133c22cefe38adb00ae19",
               "_rev": "4-fd88dd747cfc6616b615ef629e1939a0",
               "type": "opportunity",
               "product": {
                   "_id": "ecdf4c6d03f133c22cefe38adb00b953",
                   "_rev": "1-71994baa5d96ccbd0dc0a78ccdfb359b",
                   "type": "produto",
                   "company_id": "ecdf4c6d03f133c22cefe38adb00a794",
                   "name": "M16 com mira laser"
               },
               "status": "done",
               "operation": "commission",
               "points": 100,
               "balance": 100,
               "email": "cmilfont@gmail.com"
           },
           "company": {
               "_id": "ecdf4c6d03f133c22cefe38adb00a794",
               "_rev": "3-2620883452629215c27816a2c77560cb",
               "type": "company",
               "name": "LuthorCorp"
           },
           "status": "done",
           "operation": "commission",
           "points": 100,
           "balance": 100,
           "email": "cmilfont@gmail.com"
        };
        renderedTemplate = '    <table>         <thead>          <tr>            <th>#</th>            <th>Date</th>            <th>Company/Enterprise</th>            <th>Opportunity</th>            <th>Status</th>            <th>Operation</th>            <th>Points</th>            <th>Balance</th>          </tr>        </thead>        <tfoot>        <tr>            <td colspan="7"><em>Total</em></td>            <td><em>300</em></td>        </tr>        </tfoot>        <tbody>                <tr>        <td> <a href="#/statements/ecdf4c6d03f133c22cefe38adb00c94b">see</a> </td>        <td> 01/01/2011 </td>        <td> <a href="#/companies/ecdf4c6d03f133c22cefe38adb00a794">LuthorCorp</a> </td>        <td> </td>        <td> done</td>        <td> commission </td>        <td> 100 </td>        <td> 100  </td>    </tr>               </tbody>      </table>';
        renderedTemplate2 = '    <table>         <thead>          <tr>            <th>#</th>            <th>Date</th>            <th>Company/Enterprise</th>            <th>Opportunity</th>            <th>Status</th>            <th>Operation</th>            <th>Points</th>            <th>Balance</th>          </tr>        </thead>        <tfoot>        <tr>            <td colspan="7"><em>Total</em></td>            <td><em>300</em></td>        </tr>        </tfoot>        <tbody>                <tr>        <td> <a href="#/statements/ecdf4c6d03f133c22cefe38adb00c94b">see</a> </td>        <td> 01/01/2011 </td>        <td> <a href="#/companies/ecdf4c6d03f133c22cefe38adb00a794">LuthorCorp</a> </td>        <td> <a href="#/opportunity/ecdf4c6d03f133c22cefe38adb00ae19">M16 com mira laser</a> </td>        <td> done</td>        <td> commission </td>        <td> 100 </td>        <td> 100  </td>    </tr>               </tbody>      </table>';
        _body = jQuery("body");
        _body.html("");
        //mock ajax
        jQuery.extend({
            ajax: function( ajax ) {
                var fs = require('fs');
                var templatePath = __dirname + ajax.url;
                fs.readFile(templatePath, function (err, data) {
                  ajax.success( data.toString() );
                });
            }
        });
        //require plugin
        //require(__dirname + "/src/jquery.el");
        require("../src/jquery.el");
        
    });

    it('should render a template using withdrawals sprite', function () {
        jQuery.clearTemplates();
        templateConfig = {
            url: "/templates/account.statement.html", sprite: "statement-withdrawals"
        };
        jQuery.compileTemplates(templateConfig);
        waitsFor(function(){
            return typeof jQuery.getTemplates()["statement-withdrawals"] !== "undefined";
        }, "Rendered Template", 10000);
        runs(function(){
        	templateConfig.json = { withdrawals: [jsonTemplate]  };
            var renderedHTML = _body.render(templateConfig).html().replace(/\n/g, ""); 
            expect(renderedHTML).toEqual(renderedTemplate.toString());
        });
        
    });

    it('should render a template using profits sprite', function () {
        jQuery.clearTemplates();
        templateConfig = {
            url: "/templates/account.statement.html", sprite: "statement-profits"
        };
        jQuery.compileTemplates(templateConfig);
        waitsFor(function(){
            return typeof jQuery.getTemplates()["statement-profits"] !== "undefined";
        }, "Rendered Template", 10000);
        runs(function(){
        	templateConfig.json = { profits: [jsonTemplate]  };
            var renderedHTML2 = _body.render(templateConfig).html().replace(/\n/g, ""); 
            expect(renderedHTML2).toEqual(renderedTemplate2.toString());
        });
        
    });

});