/* global window, document */

(function () {
	'strict mode';

	const practices = document.getElementById('practices');
	const landing = document.getElementById('landing');

	const sections = {
		toggle: route => {
			if (route === '#practices') {
				landing.classList.add('hide');
				practices.classList.remove('hide');
			}
			if (route === '#landing') {
				practices.classList.add('hide');
				landing.classList.remove('hide');
			}
		}
	};

	const routes = {
		init: window.onhashchange = () => sections.toggle(window.location.hash)
	};

	const app = {
		init: routes.init()
	};

	return app.init;
})();
