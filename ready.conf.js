{
	src : "./src",
    dest : "./src/minified/",
    runGCompiler : true,
    runJslint : true,
    aggregateTo : "el.min.js",
    jslintOptions : {evil:true},
    order: ["/jquery.el.js", "/el.js"]
}