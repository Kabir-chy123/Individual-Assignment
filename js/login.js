import { loginUser } from "./api.js";

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;

  loginMessage.textContent = "";

  try {
    const result = await loginUser(username, password);

    localStorage.setItem("token", result.token);

    loginMessage.textContent = "Login successful!";

    window.location.href = "profile.html";
  } catch (error) {
    console.error(error);

    loginMessage.textContent = error.message;
  }
});
