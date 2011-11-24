#!/bin/bash
#
#https://github.com/dsimard/ready.js

./node_modules/ready.js/bin/ready.js ready.conf.js

#./node_modules/ready.js/bin/ready.js src/ src/minified/ --evil --aggregateTo "el.min.js"
#readyjs src/ src/minified/ -compiledext "min" -o "jquery.el.js,el.js" -aggregateto "el.min.js" --evil 

#./node_modules/ready.js/bin/ready.js src/ src/minified/ --evil -aggregateto "el.min.js"