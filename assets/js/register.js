import { post, getAll } from "../js/API/requests/index.js";
import { endpoints } from "./API/constants.js";
import { User } from "./classes/user.js";

const usernameInp = document.getElementById("username");
const fullName = document.getElementById("fullname");
const emailInp = document.getElementById("email");
const passwordInp = document.getElementById("password");
const confpasswordInp = document.getElementById("confpassword");
const registerBtn = document.getElementById("registerBtn");
const isAdmin = document.getElementById("isAdmin");
const usernamerequired = document.querySelector(".usernamerequired");
const fullnameVal = document.querySelector(".fullname-val")
const emailRequired = document.querySelector(".emailrequired")
const passwRequired = document.querySelector(".passwrequired")
const usedMailVal = document.querySelector(".usedMailVal")
const confirmpassVal = document.querySelector(".confirmpass")
const passregval = document.querySelector(".passregval")
const passmatchval = document.querySelector(".passmatch")
const mailregval = document.querySelector(".mailregval")

getAll(endpoints.users).then((res) => {
    registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        registerUser(res.data);
    });
});

function validateUsername(username) {
    return /^[a-zA-Z]+$/.test(username);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*\d).{5,}$/.test(password);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function registerUser(allUsersArr) {
    let hasError = false; // Flag to track if there's any error

    const newUser = new User(usernameInp.value, fullName.value, emailInp.value, passwordInp.value, isAdmin.checked);
    
    // Validation checks
    if (allUsersArr.some(user => user.username === newUser.username)) {
        Swal.fire({
            icon: "error",
            title: "Username is already taken",
        });
        hasError = true; // Set error flag
    }
    if (!validateUsername(newUser.fullName)) {
        fullnameVal.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (newUser.username === "") {
        usernamerequired.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (newUser.email === "") {
        emailRequired.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (newUser.password === "") {
        passwRequired.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (confpasswordInp.value === "") {
        confirmpassVal.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (!validatePassword(newUser.password)) {
        passregval.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (!validateEmail(newUser.email)) {
        mailregval.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (allUsersArr.some(user => user.email === newUser.email)) {
        usedMailVal.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }
    if (passwordInp.value != confpasswordInp.value) {
        passmatchval.classList.replace('d-none', 'd-flex');
        hasError = true; // Set error flag
    }

    // Proceed only if no errors
    if (!hasError) {
        post(endpoints.users, newUser)
            .then(response => {
                console.log("User registered successfully:", response);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'You have been registered successfully!',
                    confirmButtonText: 'OK'
                });
                window.location.replace("login.html");
            })
            .catch(error => {
                console.error("Registration failed:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'An error occurred while processing your registration. Please try again later.',
                    confirmButtonText: 'OK'
                });
            });
    }
}

usernameInp.addEventListener("keyup", () => {
    usernamerequired.classList.replace('d-flex', 'd-none');
    fullnameVal.classList.replace('d-flex', 'd-none');
});

fullName.addEventListener("keyup", () => {
    fullnameVal.classList.replace('d-flex', 'd-none');
});

emailInp.addEventListener("keyup", () => {
    emailRequired.classList.replace('d-flex', 'd-none');
    usedMailVal.classList.replace('d-flex', 'd-none');
});

passwordInp.addEventListener("keyup", () => {
    passwRequired.classList.replace('d-flex', 'd-none');
    passregval.classList.replace('d-flex', 'd-none');
    passmatchval.classList.replace('d-flex', 'd-none');
});

confpasswordInp.addEventListener("keyup", () => {
    confirmpassVal.classList.replace('d-flex', 'd-none');
    passmatchval.classList.replace('d-flex', 'd-none');
});
