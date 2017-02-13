/* global window, document */

(function () {
	'strict mode';

	const sections = {
		all: document.querySelectorAll('section'),
		toggle(route) {
			this.all.forEach(section => {
				route === `#${section.id}` ? section.classList.remove('hide') : section.classList.add('hide');
			});
		}
	};

	const routes = {
		init() {
			window.location.hash ? sections.toggle(window.location.hash) : sections.toggle(`#${sections.all[0].id}`);
			window.onhashchange = () => sections.toggle(window.location.hash);
		}
	};

	const app = {
		init() {
			routes.init();
		}
	};

	return app.init();
})();
