import { registerUser } from "./api.js";

const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  registerMessage.textContent = "";

  try {
    await registerUser(username, email, password);

    registerMessage.textContent =
      "Registration successful! You can now log in.";

    registerForm.reset();
  } catch (error) {
    console.error(error);

    registerMessage.textContent = error.message;
  }
});
