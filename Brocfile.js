/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
//	fingerprint: {
//		prepend: 'cms_tramites_dist/'
//	}
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
app.import('bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss');
app.import('bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js');

app.import('bower_components/medium-editor/dist/js/medium-editor.js');
app.import('bower_components/medium-editor/dist/css/medium-editor.min.css');
app.import('bower_components/medium-editor/dist/css/themes/roman.css');

app.import('bower_components/moment/moment.js');

app.options.minifyJS.enabled = false;

//app.import('bower_components/ember-uploader/dist/ember-uploader.min.js');
//app.import('bower_components/ember-uploader/dist/ember-uploader.named-amd.min.js');

app.import('bower_components/jquery-impromptu/dist/jquery-impromptu.min.css');
app.import('bower_components/jquery-impromptu/dist/jquery-impromptu.min.js');

var pickFiles = require('broccoli-static-compiler');
var bootstrapFonts = pickFiles('bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap', {
	srcDir: '/',
	destDir: '/fonts'
});

module.exports = app.toTree();
