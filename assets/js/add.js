import { post, getAll } from "./API/requests/index.js";
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
const dropZone = document.querySelector(".drop-zone");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
    return;
  }

  const file = e.dataTransfer.files[0];
  handleFile(file);
});

posterInp.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file) {
    return;
  }

  const size = Math.round(file.size / 1024);
  const type = file.type;

  if (!type.startsWith("image/") || size > 3000) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Invalid File Type or Size",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    const base64Image = reader.result;
    dropZone.style.backgroundImage = `url(${base64Image})`;
  };
}

addmovieBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (titleInp.value.trim() === "" || genreInp.value.trim() === "" || countryInp.value.trim() === "" || directorInp.value.trim() === "" || ageInp.value.trim() === "" || trailerURLInp.value.trim() === "" || descTextArea.value.trim() === "" || year.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Please fill all inputs",
    });
    return;
  }

  if (!posterInp.files || posterInp.files.length === 0) {
    const dropZoneFile = getDropZoneFile();
    if (dropZoneFile) {
      createMovie(dropZoneFile);
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please select a poster image",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } else {
    const file = posterInp.files[0];
    handleFile(file);
    createMovie(file);
  }
});

function createMovie(file) {
  let reader = new FileReader();
  reader.onloadend = function () {
    const base64Image = reader.result;

    const newMovie = new Movie(titleInp.value, genreInp.value, countryInp.value, directorInp.value, ageInp.value, base64Image, trailerURLInp.value, descTextArea.value, year.value);

    post(endpoints.movies, newMovie)
      .then(() => {

        clearForm();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Movie added",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(error => console.error("Error posting movie:", error));
  };

    reader.readAsDataURL(file);
  
}



function clearForm() {
  titleInp.value = "";
  genreInp.value = "";
  countryInp.value = "";
  directorInp.value = "";
  ageInp.value = "";
  posterInp.value = "";
  trailerURLInp.value = "";
  descTextArea.value = "";
  year.value = "";
  dropZone.style.backgroundImage = ""; 
}


function getDropZoneFile() {
  const backgroundImage = dropZone.style.backgroundImage;
  if (backgroundImage && backgroundImage !== "none") {
    const matches = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (matches && matches.length > 1) {
      const imageUrl = matches[1];
      return imageUrlToFile(imageUrl);
    }
  }
  return null;
}

function imageUrlToFile(imageUrl) {
  return fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => new File([blob], "poster.jpg", { type: "image/jpeg" }));
}

getAll(endpoints.users)
  .then((res) => {
    isLoggedinFun(res.data);
  })
  .catch(error => console.error("Error getting users:", error));

function isLoggedinFun(usersarr) {
  const userIDArr = localStorage.getItem('userID');

  if (userIDArr !== "null") {
    const loggedinuserlocal = userIDArr.toString();
    const loggedinuser = usersarr.find((user) => user.id === loggedinuserlocal);
    if (loggedinuser) {
      if (!loggedinuser.isAdmin) {
        window.location.replace("index.html");
      }
    }
  } else {
    window.location.replace("index.html");
  }
}
