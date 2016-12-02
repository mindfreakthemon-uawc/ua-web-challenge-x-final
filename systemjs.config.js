(function (global) {
	var map = {
		'app': 'build/app/app',
		'@angular': 'build/vendor/@angular',
		'rxjs': 'build/vendor/rxjs'
	};

	var packages = {
		'app': {
			main: 'main.js',
			defaultExtension: 'js'
		},
		'rxjs': {
			defaultExtension: 'js'
		}
	};

	var ngPackageNames = [
		'common',
		'compiler',
		'core',
		'forms',
		'http',
		'platform-browser',
		'platform-browser-dynamic',
		'router',
		'router-deprecated',
		'upgrade',
	];

	ngPackageNames.forEach(function (pkgName) {
		packages['@angular/' + pkgName] = {
			main: System.packageWithIndex ? 'index.js' : 'bundles/' + pkgName + '.umd.js',
			defaultExtension: 'js'
		};
	});

	System.config({
		map: map,
		packages: packages
	});
})(this);
