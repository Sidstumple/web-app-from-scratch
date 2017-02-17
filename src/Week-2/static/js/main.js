/* global fetch document */

(() => {
	'strict mode';

	const controller = {
		listen(endpoint, arr, selector) {
			let dropdown = document.querySelector(selector);
			dropdown.addEventListener('change', () => {
				if (dropdown.value.length > 1) {
					// Instead of updating the DOM I remove and insert
					// new content everytime because insertAdjacentHTML is
					// 142 times faster than innerHTML
					// Source: https://jsperf.com/insertadjacenthtml-perf/28
					view.clean();

					if (endpoint === 'planets') {
						view.planets(arr, dropdown.value);
					}
					if (endpoint === 'people') {
						view.people(arr, dropdown.value);
					}
					if (endpoint === 'starships') {
						view.starships(arr, dropdown.value);
					}
				}
			});
		}
	};

	const view = {
		init(endpoint, arr, selector) {
			arr.forEach(item => {
				const section = document.querySelector(selector);
				section.insertAdjacentHTML('beforeend',
					`<option value="${item.name}">${item.name}</option>`);
			});
			controller.listen(endpoint, arr, selector);
		},

		crawl() {
			// Don't judge. I have tried it all in CSS, seriously.
			// It takes a while before the transform inits
			// In the meanwhile the DOM is loaded and you see the entire crawl
			// instead of a slide in.
			setTimeout(function () {
				//remove and add animation class here :)
				document.querySelector('section').classList.remove('hide');
			}, 2500);
		},

		clean() {
			const paragraphs = document.querySelectorAll('section p');
			paragraphs.forEach(p => {
				p.remove();
			});
		},

		planets(arr, value) {
			const dropdowns = document.querySelectorAll('select');
			const section = document.querySelector('section');
			arr.forEach(item => {
				if (item.name === value) {
					dropdowns[1].selectedIndex = 0;
					dropdowns[2].selectedIndex = 0;
					section.insertAdjacentHTML('beforeend',
						`<p>Name: <span>${item.name}</span></p>
						<p>Diameter: <span>${item.diameter}</span></p>
						<p>Gravity: <span>${item.gravity}</span></p>
						<p>Population: <span>${item.population}</span></p>
						<p>Climate: <span>${item.climate}</span></p>
						<p>Terrain: <span>${item.terrain}</span></p>`
					);
				}
			});
		},

		people(arr, value) {
			const dropdowns = document.querySelectorAll('select');
			const section = document.querySelector('section');
			arr.forEach(item => {
				if (item.name === value) {
					dropdowns[0].selectedIndex = 0;
					dropdowns[2].selectedIndex = 0;
					section.insertAdjacentHTML('beforeend',
						`<p>Name: <span>${item.name}</span></p>
						<p>Birth year: <span>${item.birth_year}</span></p>
						<p>Eye color: <span>${item.eye_color}</span></p>
						<p>Gender: <span>${item.gender}</span></p>
						<p>Hair color: <span>${item.hair_color}</span></p>
						<p>Height: <span>${item.height}</span></p>`
					);
				}
			});
		},

		starships(arr, value) {
			const dropdowns = document.querySelectorAll('select');
			const section = document.querySelector('section');
			arr.forEach(item => {
				if (item.name === value) {
					dropdowns[0].selectedIndex = 0;
					dropdowns[1].selectedIndex = 0;
					section.insertAdjacentHTML('beforeend',
						`<p>Name: <span>${item.name}</span></p>
						<p>Model: <span>${item.model}</span></p>
						<p>Starship class: <span>${item.starship_class}</span></p>
						<p>Manufacturer: <span>${item.manufacturer}</span></p>
						<p>Cost in credits: <span>${item.cost_in_credits}</span></p>
						<p>Length: <span>${item.length}</span></p>
						<p>Crew: <span>${item.crew}</span></p>`
					);
				}
			});
		}
	};

	const model = {
		init() {
			view.crawl();
			// (API endpoint, array with data from endpoint, dropdown selector)
			this.request('planets', this.planets, '.dropdown-planets');
			this.request('people', this.people, '.dropdown-people');
			this.request('starships', this.starships, '.dropdown-starships');
		},

		async request(endpoint, arr, selector) {
			try {
				let counter = 1;
				let data;
				// You can not request the entirety of a category,
				// instead SWAPI returns a few and a property 'next',
				// which contains the URL of the subsequent request.
				do {
					let response = await fetch(`http://swapi.co/api/${endpoint}/?page=${counter}`);
					data = await response.json();
					arr.push(...data.results);
					counter++;
				} while (data.next); // Until next: null
				view.init(endpoint, arr, selector);
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
