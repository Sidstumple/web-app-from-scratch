/*
* cmdaan.js
*   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
*   zijn tijdens het techniek college in week 5.
*
*   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
*   Credit: Dive into html5, geo.js, Nicholas C. Zakas
*
*   Copyleft 2012, all wrongs reversed.
*/

// Variable declaration

(function () {
	const defaultSettings = {
		LINEAIR: 'LINEAIR',
		GPS_AVAILABLE: 'GPS_AVAILABLE',
		GPS_UNAVAILABLE: 'GPS_UNAVAILABLE',
		POSITION_UPDATED: 'POSITION_UPDATED',
		REFRESH_RATE: 1000,
		currentPosition: false,
		currentPositionMarker: false,
		customDebugging: false,
		debugId: false,
		map: false,
		interval: false,
		intervalCounter: false,
		updateMap: false,
		locatieRij: [],
		markerRij: []
	};

	// Event functies - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
	// Gebruik: ET.addListener('foo', handleEvent); ET.fire('event_name'); ET.removeListener('foo', handleEvent);
	function EventTarget() {
		this._listeners = {};
	}

	EventTarget.prototype = {
		constructor: EventTarget,

		addListener: function (type, listener) {
			if (typeof this._listeners[type] === 'undefined') {
				this._listeners[type] = [];
			}
			this._listeners[type].push(listener);
		},

		fire: function (event) {
			if (typeof event === 'string') {
				event = {type: event};
			}
			if (!event.target) {
				event.target = this;
			}

			if (!event.type) {
				throw new Error('Event object missing "type" property.');
			}

			if (this._listeners[event.type] instanceof Array) {
				var listeners = this._listeners[event.type];
				for (var i = 0, len = listeners.length; i < len; i++) {
					listeners[i].call(this, event);
				}
			}
		},

		removeListener: function (type, listener) {
			if (this._listeners[type] instanceof Array) {
				var listeners = this._listeners[type];
				for (var i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i] === listener) {
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
	};

	const ET = new EventTarget();

	const location = {
		// Test of GPS beschikbaar is (via geo.js) en vuur een event af
		init() {
			debugMessage('Controleer of GPS beschikbaar is...');

			ET.addListener(defaultSettings.GPS_AVAILABLE, startInterval);
			ET.addListener(GPS_UNAVAILABLE, () => {
				debugMessage('GPS is niet beschikbaar.');
			});

			(geoPositionJS.init()) ? ET.fire(defaultSettings.GPS_AVAILABLE) : ET.fire(defaultSettings.GPS_UNAVAILABLE);
		},

		// Start een interval welke op basis van REFRESH_RATE de positie updated
		startInterval() {
			debugMessage('GPS is beschikbaar, vraag positie.');
			updatePosition();
			interval = self.setInterval(updatePosition, defaultSettings.REFRESH_RATE);
			ET.addListener(defaultSettings.POSITION_UPDATED, checkLocations);
		},

		// Vraag de huidige positie aan geo.js, stel een callback in voor het resultaat
		updatePosition() {
			defaultSettings.intervalCounter++;
			geoPositionJS.getCurrentPosition(setPosition, geoErrorHandler, {enableHighAccuracy: true});
		},

		// Callback functie voor het instellen van de huidige positie, vuurt een event af
		setPosition() {
			defaultSettings.currentPosition = position;
			ET.fire('POSITION_UPDATED');
			debugMessage(defaultSettings.intervalCounter + ' positie lat:' + position.coords.latitude + ' long:' + position.coords.longitude);
		},

		// Controleer de locaties en verwijs naar een andere pagina als we op een locatie zijn
		checkLocations() {
			// Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
			for (var i = 0; i < locaties.length; i++) {
				var locatie = {coords: {latitude: locaties[i][3], longitude: locaties[i][4]}};

				if (calculateDistance(locatie, defaultSettings.currentPosition) < locaties[i][2]) {
					// Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
					if (window.location !== locaties[i][1] && localStorage[locaties[i][0]] === 'false') {
					// Probeer local storage, als die bestaat incrementeer de locatie
						try {
							(localStorage[locaties[i][0]] === 'false') ? localStorage[locaties[i][0]] = 1 : localStorage[locaties[i][0]]++;
						} catch (err) {
							debugMessage('Localstorage kan niet aangesproken worden: ' + err);
						}

						window.location = locaties[i][1];
						debugMessage('Speler is binnen een straal van ' + locaties[i][2] + ' meter van ' + locaties[i][0]);
					}
				}
			}
		},

		// Bereken het verchil in meters tussen twee punten
		calculateDistance() {
			var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
			var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
			return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
		}
	};

// GOOGLE MAPS FUNCTIES
/**
 * generateMap(myOptions, canvasId)
 *  roept op basis van meegegeven opties de google maps API aan
 *  om een kaart te genereren en plaatst deze in het HTML element
 *  wat aangeduid wordt door het meegegeven id.
 *
 *  @param myOptions:object - een object met in te stellen opties
 *      voor de aanroep van de google maps API, kijk voor een over-
 *      zicht van mogelijke opties op http://
 *  @param canvasID:string - het id van het HTML element waar de
 *      kaart in ge-rendered moet worden, <div> of <canvas>
 */

const googleMaps = {
	generateMap() {
		debugMessage('Genereer een Google Maps kaart en toon deze in #' + canvasId);
		defaultSettings.map = new google.maps.Map(document.getElementById(canvasId), myOptions);

		var routeList = [];
		// Voeg de markers toe aan de map afhankelijk van het tourtype
		debugMessage('Locaties intekenen, tourtype is: ' + tourType);
		for (var i = 0; i < locaties.length; i++) {
		// Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
			try {
				(localStorage.visited == undefined || isNumber(localStoragine.visited)) ? localStorage[locaties[i][0]] = false : null;
			} catch (err) {
				debugMessage('Localstorage kan niet aangesproken worden: ' + err);
			}

			var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
			routeList.push(markerLatLng);

			defaultSettings.markerRij[i] = {};
			for (var attr in locatieMarker) {
				defaultSettings.markerRij[i][attr] = locatieMarker[attr];
			}
			defaultSettings.markerRij[i].scale = locaties[i][2] / 3;

			var marker = new google.maps.Marker({
				position: markerLatLng,
				map: defaultSettings.map,
				icon: defaultSettings.markerRij[i],
				title: defaultSettings.locaties[i][0]
			});
		}

		if (tourType === defaultSettings.LINEAIR) {
		// Trek lijnen tussen de punten
			debugMessage('Route intekenen');
			var route = new google.maps.Polyline({
				clickable: false,
				map: defaultSettings.map,
				path: routeList,
				strokeColor: 'Black',
				strokeOpacity: 0.6,
				strokeWeight: 3
			});
		}
	  // Voeg de locatie van de persoon door
		defaultSettings.currentPositionMarker = new google.maps.Marker({
			position: kaartOpties.center,
			map: defaultSettings.map,
			icon: defaultSettings.positieMarker,
			title: 'U bevindt zich hier'
		});

	  // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
		ET.addListener(defaultSettings.POSITION_UPDATED, updatePosition);
	},

	isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},

	// Update de positie van de gebruiker op de kaart
	updatePosition(event) {
		// use currentPosition to center the map
		var newPos = new google.maps.LatLng(defaultSettings.currentPosition.coords.latitude, defaultSettings.currentPosition.coords.longitude);
		defaultSettings.map.setCenter(newPos);
		defaultSettings.currentPositionMarker.setPosition(newPos);
	}
};

	// FUNCTIES VOOR DEBUGGING
	const debug = {
		geoErrorHandler(code, message) {
			debugMessage('geo.js error ' + code + ': ' + message);
		},

		debugMessage(message) {
			(defaultSettings.customDebugging && debugId) ? document.getElementById(debugId).innerHTML : console.log(message);
		},

		setCustomDebugging(debugId) {
			debugId = this.debugId;
			defaultSettings.customDebugging = true;
		}
	};

	location.init();
})();
