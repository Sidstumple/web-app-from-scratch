/* global fetch document */

(() => {
	'strict mode';

	const controller = {
		listen() {
			const chosenPlanet = document.querySelector('.dropdown-planets');
			chosenPlanet.addEventListener('change', () => {
				if (chosenPlanet.value.length > 1) {
					view.clean();
					view.update(chosenPlanet.value);
				}
			});
		}
	};

	const view = {
		init(data) {
			data.forEach(planet => {
				const option = document.createElement('option');
				option.setAttribute('value', planet.name);
				option.appendChild(document.createTextNode(planet.name));
				document.querySelector('.dropdown-planets').appendChild(option);
			});
			controller.listen();
		},

		clean() {
			const paragraphs = document.querySelectorAll('section p');
			paragraphs.forEach(p => {
				p.remove();
			});
		},

		update(chosenPlanet) {
			model.planets.forEach(planet => {
				if (planet.name === chosenPlanet) {
					document.querySelector('section').appendChild(document.createElement('p').appendChild(document.createTextNode(`Name: ${planet.name}`)));
					document.querySelector('section').appendChild(document.createElement('p').appendChild(document.createTextNode(`Diameter: ${planet.diameter}`)));
				}
			});
		}
	};

	const model = {
		async init() {
			try {
				const response = await fetch('http://swapi.co/api/planets/');
				const data = await response.json();
				this.planets.push(...data.results);
				view.init(data.results);
			} catch (err) {
				console.error(err);
			}
		},
		planets: []
	};

	model.init();
})();
