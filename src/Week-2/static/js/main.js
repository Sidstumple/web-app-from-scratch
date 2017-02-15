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
				const section = document.querySelector('.dropdown-planets');
				section.insertAdjacentHTML('beforeend',
					`<option value="${planet.name}">${planet.name}</option>`);
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
					const section = document.querySelector('section');
					section.insertAdjacentHTML('beforeend',
						`<p>Name: <span>${planet.name}</span></p>
						<p>Diameter: <span>${planet.diameter}</span></p>
						<p>Diameter: <span>${planet.gravity}</span></p>
						<p>Diameter: <span>${planet.population}</span></p>
						<p>Diameter: <span>${planet.climate}</span></p>
						<p>Diameter: <span>${planet.terrain}</span></p>`
					);
				}
			});
		}
	};

	const model = {
		init() {
			this.request('planets', this.planets);
		},

		async request(endpoint, arr) {
			try {
				let counter = 1;
				let data;
				do {
					let response = await fetch(`http://swapi.co/api/${endpoint}/?page=${counter}`);
					data = await response.json();
					arr.push(...data.results);
					counter++;
				} while (data.next);
				view.init(arr);
			} catch (err) {
				console.error(err);
			}
		},
		planets: [],
		people: [],
		starships: []
	};

	model.init();
})();
