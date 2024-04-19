import { post } from "../js/API/requests/index.js";
import { endpoints } from "./API/constants.js";
import{ User }from "./class.js";

const usernameInp = document.getElementById("username");
const emailInp = document.getElementById("email");
const passwordInp = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
 
    const newuser = new User(usernameInp.value, emailInp.value, passwordInp.value);
    post(endpoints.users, newuser)
        .then(response => {
         console.log("User registered successfully:", response);
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'You have been registered successfully!',
                confirmButtonText: 'OK'
            });

        })
        window.location.replace("login.html")

        .catch(error => {
            console.error("Registration failed:", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'An error occurred while processing your registration. Please try again later.',
                confirmButtonText: 'OK'
            });
        });
});
