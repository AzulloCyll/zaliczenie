import "core-js/stable";
import "regenerator-runtime/runtime";
import "what-input";
import { createFocusTrap } from "focus-trap";

import data from "../data/movies.json"; //import pliku json

import {
	createTile,
	switchCollumns,
	onResizeHandler,
	colorTiles,
} from "./1_movielist.js";

import { showHide } from "./2_menu.js";
import { generateSelectOptions } from "./3_yearFilter.js";
import { countTiles } from "./4_countTiles";
import { averageRating } from "./5_averageRating";
import { renderCloud, renderAllMoviesButton } from "./6_tagCloud";
import { searchHandler, showAllTiles } from "./7_search.js";
import { nightMode, normalMode } from "./8_nightMode";
import { sortA_up, sortY_up, sortA_down, sortY_down } from "./9_sort";
import { addMovieButtonHandler, preview } from "./10_form";

let movies = data.movies; //zmienna w której przechowywany jest obiekt z filmami

//wyswietlanie kafelków
for (let movie of movies) {
	createTile(movie.name, movie.img);
}

// obsługa przycisku zmiany kolumn
switchCollumns(main);

//zmiana na mobilną wersję
const rwdElement = document.getElementsByClassName("rwd")[0];
// Inicjalizacja na start
onResizeHandler(rwdElement);

window.addEventListener("resize", function () {
	onResizeHandler(rwdElement);
});

colorTiles(); //początkowa inicjalizacja koloru kafelków
showHide(); // obsługa menu hamburger
generateSelectOptions(select); // utworzenie i obsługa filtrowania po latach
countTiles(); //liczy ile jest wyswietlonych filmów
averageRating(); //oblicza średnią z wyśewietlanych filmów // inicjalizacja

//wyszukiwarka
search.oninput = function (event) {
	if (event.target.value.length >= 3) {
		searchHandler(event.target.value);
	} else {
		showAllTiles();
	}
};

renderCloud(); // wyświetlenie chmury tagów i zainicjalizowanie jej obsługi

renderAllMoviesButton(); //button pokazujący wszystkie filmy

//obsługa sortowania po nazwie
const sortAButton = document.getElementById("sort-a");
sortAButton.onclick = function (event) {
	let icon = event.target.querySelector(".fas");

	if (icon.classList.contains("fa-sort-up")) {
		icon.classList.remove("fa-sort-up");
		icon.classList.add("fa-sort-down");
		sortA_up();
	} else {
		icon.classList.remove("fa-sort-down");
		icon.classList.add("fa-sort-up");
		sortA_down();
	}
};

//obsługa sortowania po dacie
const sortYButton = document.getElementById("sort-y");
sortYButton.onclick = function (event) {
	let icon = event.target.querySelector(".fas");

	if (icon.classList.contains("fa-sort-up")) {
		icon.classList.remove("fa-sort-up");
		icon.classList.add("fa-sort-down");
		sortY_up();
	} else {
		icon.classList.remove("fa-sort-down");
		icon.classList.add("fa-sort-up");
		sortY_down();
	}
};

// obsługa tryby nocnego/dziennego
const mode = document.getElementById("mode");
mode.onclick = function (event) {
	if (event.target.textContent == "Tryb nocny") {
		nightMode();
		event.target.textContent = "Tryb dzienny";
	} else if ((event.target.textContent = "Tryb dzienny")) {
		normalMode();
		event.target.textContent = "Tryb nocny";
	}
};

//przycisk dodawania filmu w popupie
const addMovieButton = document.getElementById("add_btn");
addMovieButton.onclick = function (event) {
	movies = addMovieButtonHandler(movies); //po wywołaniu zmienna movies zostaje zaktualizowana
	focusTrap.deactivate();
	closePopup();
	unshowLastPreview();
	renderCloud(); // reincjalizacja chmury tagów
};

//przycisk w menu otwirający popup
const showPopup = document.getElementById("showform");
showPopup.onclick = function (event) {
	openPopup();
	focusTrap.activate(); // do focus-trapa
};

//przycisk X w popupie zamykający popup
const xButton = document.getElementById("x-button");
xButton.onclick = function (event) {
	focusTrap.deactivate(); // do focus-trapa
	closePopup();
};

//zamyka popup
function closePopup() {
	const apla = document.getElementById("apla");
	const popup = document.getElementById("popup");
	apla.style.display = "none";
	popup.style.display = "none";
}

//otwiera popup
function openPopup() {
	const apla = document.getElementById("apla");
	const popup = document.getElementById("popup");
	apla.style.display = "block";
	popup.style.display = "block";
	preview();
}

// Inicjalizacja funkcjonalności tzw. "focus-trap" na elemencie #popup
const container = document.querySelector("#popup");
const focusTrap = createFocusTrap("#popup", {
	onActivate: function () {
		container.classList.add("trap");
		container.classList.add("is-active"); // Klasa "trap" można zamienić na dowloną, np. "my-form-popup"
	},
	onDeactivate: function () {
		container.classList.remove("is-active");
	},
});

// funkcja używana do wyczyszaczenia preview w popupie po dodaniu filmu
function unshowLastPreview() {
	const popup = document.getElementsByClassName("tile_popup")[0];
	const name = popup.getElementsByClassName("movie_name")[0];
	const year = popup.getElementsByClassName("movie_year")[0];
	const rating = popup.getElementsByClassName("movie_stars")[0];
	const img = popup.getElementsByClassName("movie_image")[0];

	name.innerHTML = "";
	year.innerHTML = "";
	rating.innerHTML = "";

	if (img) {
		img.remove();
	}
}

export { movies };
