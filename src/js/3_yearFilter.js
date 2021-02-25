import { movies } from "./index";

const select = document.getElementById("select");
const yearsElem = document.getElementsByClassName("movie_year");
const tiles = document.getElementsByClassName("tile");

// tworze element select i dodaje do niego unikalne lata
function generateSelectOptions(select) {
	const yearsElemArr = Array.from(yearsElem);
	const years = [];
	for (let i in yearsElemArr) {
		years[i] = yearsElemArr[i].innerHTML;
	}
	const uniqeYears = [...new Set(years)]; //macierz unikalnych lat
	uniqeYears.sort((a, b) => a - b);
	for (let i in uniqeYears) {
		const selectEl = document.createElement("option");
		selectEl.innerHTML = uniqeYears[i];
		select.append(selectEl);
	}
}

select.onchange = function (event) {
	if (event.target.value != "Wszystkie") {
		let year = event.target.value;
		filterTiles(year, event);
	} else {
		for (let i in tiles) {
			tiles[i].hidden = false;
		}
	}
};

function filterTiles(year) {
	hideAllTiles(); //ukrywam wszystkie filmy

	const movieNames = [];

	for (let movie of movies) {
		movieNames.push(movie.name);
	}

	console.log(movieNames);

	//tworze macierz indexów filmów w których występuje dany rok
	let indexes = [];
	for (let movie of movies) {
		if (movie.name.includes(year)) {
			indexes.push(movieNames.indexOf(movie.name));
		}
	}

	console.log(indexes);

	//wyswietla tylko te, których index sie zgadza
	for (let i in indexes) {
		tiles[i].hidden = false;
	}
}

function hideAllTiles() {
	console.log(tiles.length);
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].hidden = true;
	}
}

export { generateSelectOptions };