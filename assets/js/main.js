import { getAll, deleteOne, getOne, update, post } from "./API/requests/index.js";
import { endpoints } from "./API/constants.js";

const moviesWrapper = document.querySelector(".movies-wrapper");
const editForm = document.querySelector("#edit-form");
const titleInp = document.querySelector("#title");
const posterInp = document.querySelector("#poster");
const trailerURLInp = document.querySelector("#trailerURL");
const genreInp = document.querySelector("#genre");
const ageInp = document.querySelector("#age");
const countryInp = document.querySelector("#country");
const directorInp = document.querySelector("#director");
const descTextArea = document.querySelector("#desc");
const registernavlink = document.getElementById("registernavlink");
const loginnavlink = document.getElementById("loginnavlink");
const addLink = document.getElementById("addLink");
const logoutnavlink = document.getElementById("logoutnavlink");
const usernamenavlink = document.getElementById("username-navlink");
const navusername = document.querySelector(".username-nav");
const lockIco = document.querySelector(".fa-lock");

window.addEventListener("load", () => {
  getAll(endpoints.movies).then((res) => {
    renderCards(res.data);
  });
  if (!localStorage.getItem('userID')) {
    localStorage.setItem('userID', null);
  }

});

function renderCards(arr) {

  moviesWrapper.innerHTML = "";
  arr.forEach((movie) => {
    moviesWrapper.innerHTML += `   <div class="col-lg-3 col-md-6 col-sm-12" data-id=${movie.id} data-editing="false">
        <div class="card">
            <div class="card-img">
                <img class="card-img-top"
                    src="${movie.poster}"
                    alt="${movie.title}">
                    title=${movie.title}
            </div>
            <div class="card-body">
                <h3 class="card-title">${movie.title}</h3>
                <div class="d-flex justify-content-between align-items-center">
                    <button  class="btn btn-outline-secondary mb-0 trailer-btn">click for trailer</button> <br>
                    <div class="age-restriction">
                        <span>${movie.ageRestriction}+</span>
                    </div>
                </div>
                <hr>
                    <div class="d-flex gap-2 ">
                <a href="detail.html?id=${movie.id}" class="btn btn-outline-info info-btn">
                    <i class="fa-solid fa-circle-info"></i>
                </a>
                <button  class="align-items-center btn btn-outline-primary edit-btn d-none"  data-bs-toggle="modal" data-bs-target="#editModal">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button  class="btn btn-outline-danger delete-btn d-none">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="btn btn-outline-danger wish-btn d-none align-items-center ">
                    <i class="far fa-heart"></i>
                </button></div>
            </div>
        </div>
    </div>`;

    getAll(endpoints.users).then((res) => {
      isLoggedinFun(res.data);
    })
    //trailerbtn

    const trailerBtns = document.querySelectorAll(".trailer-btn");
    trailerBtns.forEach((trailerBtn) => {
      trailerBtn.addEventListener('click', async (e) => {
        const userIDArr = localStorage.getItem('userID');

        if (userIDArr != 'null') {
          const dataid = e.target.closest(".col-lg-3").getAttribute("data-id");
          try {
            const res = await getOne(endpoints.movies, dataid);
            const youtubeLink = res.data[0].trailerURL;
            const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeLink)}&format=json`;

            const response = await fetch(endpoint);
            const data = await response.json();

            document.querySelector('.embeddiv').classList.replace('d-none', 'd-flex');
            document.getElementById('embedContainer').innerHTML = data.html;
          } catch (error) {
            console.error('error:', error);
            alert('try again');
          }
        }
        else {
          Swal.fire({
            icon: "error",
            title: "please login for watch trailer",

          });
        }
      });
    });
    document.addEventListener('click', (event) => {
      const embedDiv = document.getElementById('embedContainer');
      if (!embedDiv.contains(event.target)) {
        document.querySelector('.embeddiv').classList.replace('d-flex', 'd-none');
        document.getElementById('embedContainer').innerHTML = '';
      }
    });

    //delete buttons
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.closest(".col-lg-3").getAttribute("data-id");
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await deleteOne(endpoints.movies, id);
            console.log("delete response: ", res);
            this.closest(".col-lg-3").remove();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
      });
    });
    //edit buttons
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.closest(".col-lg-3").getAttribute("data-id");
        const response = await getOne(endpoints.movies, id);
        const movie = response.data[0];
        titleInp.value = movie.title;
        genreInp.value = movie.genre;
        posterInp.value = movie.poster;
        trailerURLInp.value = movie.trailerURL;
        ageInp.value = movie.ageRestriction;
        countryInp.value = movie.country;
        directorInp.value = movie.director;
        descTextArea.value = movie.description;

        this.closest('.col-lg-3').setAttribute('data-editing', 'true');
      });
    });
  });
}

editForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const cards = document.querySelectorAll('.col-lg-3');
  let id;
  Array.from(cards).map((card) => {
    if (card.getAttribute('data-editing') == 'true') {
      id = card.getAttribute('data-id');
      card.setAttribute('data-editing', 'false');
    }
  });

  const updatedMovie = {
    title: titleInp.value,
    genre: genreInp.value,
    country: countryInp.value,
    director: directorInp.value,
    ageRestriction: ageInp.value,
    poster: posterInp.value,
    trailerURL: trailerURLInp.value,
    description: descTextArea.value
  }
  update(endpoints.movies, id, updatedMovie).then(() => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Movie Updated Successfully!",
      showConfirmButton: false,
      timer: 1500
    });
    getAll(endpoints.movies).then((res) => {
      renderCards(res.data);
    });
  })
});


//sort
const sortSelectOption = document.querySelector('.sort-by-name-select');

sortSelectOption.addEventListener('change', async (e) => {
  console.log('e: ', e.target.value);
  let res = await getAll(endpoints.movies);
  if (e.target.value == 'ascending') {
    let sortedArr = [...res.data].sort((x, y) => x.title.localeCompare(y.title));
    renderCards(sortedArr);
  }
  else if (e.target.value == 'descending') {
    let sortedArr = [...res.data].sort((x, y) => y.title.localeCompare(x.title));
    renderCards(sortedArr);
  }
});



const userIDArr = localStorage.getItem('userID');

//wishlist 
function FavoriteButtonClick(movieId, loggedinuser) {
  return function (e) {
    const icon = e.currentTarget.querySelector("i");
    const isFavorite = loggedinuser.favorites.some(fav => fav.id === movieId);

    if (!isFavorite) {
      loggedinuser.favorites.push({ id: movieId });
      icon.classList.replace("far", "fa-solid");
    } else {
      const index = loggedinuser.favorites.findIndex(fav => fav.id === movieId);
      loggedinuser.favorites.splice(index, 1);
      icon.classList.replace("fa-solid", "far");
    }

    update(endpoints.users, loggedinuser.id, loggedinuser).then(() => {
      getAll(endpoints.users).then((res) => {
        isLoggedinFun(res.data);
      });
    });
  };
}

function addFavoriteButtonListeners(loggedinuser) {
  const wishBtns = document.querySelectorAll(".wish-btn");
  wishBtns.forEach((wishbtn) => {
    const movieId = wishbtn.closest(".col-lg-3").getAttribute("data-id");
    const icon = wishbtn.querySelector("i");
    const isFavorite = loggedinuser.favorites.some(fav => fav.id === movieId);
    if (isFavorite) {
      icon.classList.replace('far', 'fa-solid');
    } else {
      icon.classList.replace('fa-solid', 'far');
    }
    wishbtn.classList.replace('d-none', 'd-flex');
    wishbtn.addEventListener('click', FavoriteButtonClick(movieId, loggedinuser));
  });
}

function isLoggedinFun(usersarr) {
  if (userIDArr != null) {
    const loggedinuserlocal = userIDArr.toString();
    const loggedinuser = usersarr.find((user) => user.id === loggedinuserlocal);
    if (loggedinuser) {
      registernavlink.classList.add('d-none');
      loginnavlink.classList.add('d-none');
      usernamenavlink.classList.replace('d-none', 'd-flex');
      logoutnavlink.classList.replace('d-none', 'd-flex');
      navusername.innerHTML = loggedinuser.username;

      if (loggedinuser.isAdmin) {
        lockIco.classList.replace('d-none', 'd-block');
        addLink.classList.replace('d-none', 'd-flex');
        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach((btn) => {
          btn.classList.replace('d-none', 'd-block');
        });

        const editBtns = document.querySelectorAll(".edit-btn");
        editBtns.forEach((btn) => {
          btn.classList.replace('d-none', 'd-flex');
        });
      }
      else {
        const sortbyfavbtn =document.querySelector(".sortbyfavbtn")
        addFavoriteButtonListeners(loggedinuser);
        sortbyfavbtn.classList.replace('d-none','d-flex')

        sortbyfav(loggedinuser)

        
      
      }
    }
  } else {
    console.log("Please Login");
  }
}

function sortbyfav(loggedinuser) {
  getAll(endpoints.movies).then((res) => {
    const arr = res.data;

    const handleFilterChange = (loggedinuser) => {
      const selectedOption = filterSelect.value;

      if (selectedOption === 'favorites') {
        const favoriteMovies = arr.filter(movie => loggedinuser.favorites.some(fav => fav.id === movie.id));
        renderCards(favoriteMovies);
      } else {
        renderCards(arr);
      }
    };

    filterSelect.addEventListener('change', () => {
      handleFilterChange(loggedinuser);
    });
  });
}

logoutnavlink.addEventListener('click', () => {
  localStorage.setItem('userID', JSON.stringify(null));
  registernavlink.classList.remove('d-none')
  loginnavlink.classList.remove('d-none')
  usernamenavlink.classList.replace('d-flex', 'd-none')
  logoutnavlink.classList.replace('d-flex', 'd-none')
  lockIco.classList.replace('d-block', 'd-none');
  addLink.classList.replace('d-flex', 'd-none');
  const wishBtns = document.querySelectorAll(".wish-btn");
  const sortbyfavbtn =document.querySelector(".sortbyfavbtn")
  sortbyfavbtn.classList.replace('d-flex','d-none')
  wishBtns.forEach((wishbtn) => {
    wishbtn.classList.replace('d-flex', 'd-none');
  });

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.classList.replace('d-block', 'd-none');
  });

  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.classList.replace('d-flex', 'd-none');
  });
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "you are logged out",
    showConfirmButton: false,
    timer: 1500
  });
});


