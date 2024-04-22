import { getAll } from "../js/API/requests/index.js";
import { endpoints } from "./API/constants.js";

const passwordrequired = document.querySelector('.passwordrequired')
const usernamerequired = document.querySelector('.usernamerequired')
const username = document.getElementById('username')
const password = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const eye = document.getElementById('eye')
 

window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userID')) {
        localStorage.setItem('userID', null);
    }
})


getAll(endpoints.users).then((res) => {
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginUser(res.data);
    });
});



function loginUser(userarr) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (username.value == "") {
            usernamerequired.classList.replace('d-none', 'd-block')
        }
        if (password.value == "") {
            passwordrequired.classList.replace('d-none', 'd-block')
        }

        else {

            if (userarr.some((user) => user.username === username.value)) {
                const registereduser = userarr.find((user) => user.username === username.value)
                if (registereduser.password == password.value) {
                    const loggedinuser = userarr.find((user) => user.username === username.value && user.password === password.value)
                    const loggedinid = loggedinuser.id
                    localStorage.setItem('userID', loggedinid)
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "you are logged in",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    window.location.replace("index.html")

                }


                else {
                    Swal.fire({
                            icon: "error",
                            title: "password is false",
                            showConfirmButton: true,
                            timer: 1500
                        });
                }
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "user not found",
                });
            }

        }
    })
}

username.addEventListener('keyup', () => {
    usernamerequired.classList.replace('d-block', 'd-none')

})
password.addEventListener('keyup', () => {
    passwordrequired.classList.replace('d-block', 'd-none')

})



eye.addEventListener('click', () => {
    if (eye.classList.contains('fa-eye-slash')) {
        eye.classList.replace('fa-eye-slash', 'fa-eye');
        password.setAttribute('type', 'text');
    } else {
        eye.classList.replace('fa-eye', 'fa-eye-slash');
        password.setAttribute('type', 'password');
    }
});
