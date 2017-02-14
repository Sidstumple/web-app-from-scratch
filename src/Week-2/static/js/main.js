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
					const name = document.createElement('p');
					name.appendChild(document.createTextNode(`Name: ${planet.name}`));
					document.querySelector('section').appendChild(name);

					const diameter = document.createElement('p');
					diameter.appendChild(document.createTextNode(`Diameter: ${planet.diameter}`));
					document.querySelector('section').appendChild(diameter);

					const gravity = document.createElement('p');
					gravity.appendChild(document.createTextNode(`Gravity: ${planet.gravity}`));
					document.querySelector('section').appendChild(gravity);

					const population = document.createElement('p');
					population.appendChild(document.createTextNode(`Population: ${planet.population}`));
					document.querySelector('section').appendChild(population);
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
