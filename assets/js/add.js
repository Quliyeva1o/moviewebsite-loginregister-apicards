
import { post } from "./API/requests/index.js";
import { endpoints } from "./API/constants.js";
import { Movie } from "./classes/movie.js";

const titleInp = document.querySelector("#addtitle");
const genreInp = document.querySelector("#addgenre");
const countryInp = document.querySelector("#addcountry");
const directorInp = document.querySelector("#adddirector");
const ageInp = document.querySelector("#addage");
const posterInp = document.querySelector("#addposter");
const trailerURLInp = document.querySelector("#addtrailerURL");
const descTextArea = document.querySelector("#adddesc");
const year = document.querySelector("#addyear");

const addmovieBtn = document.querySelector("#addmovieBtn");



addmovieBtn.addEventListener('click', (e) => {
    const newMovie = new Movie(titleInp.value, genreInp.value, countryInp.value, directorInp.value, ageInp.value, posterInp.value, trailerURLInp.value, descTextArea.value, year.value)
    e.preventDefault()
    post(endpoints.movies, newMovie)
})