import { getCurrentUser, updateUser, uploadAvatar } from "./api.js";

const profileInfo = document.querySelector("#profile-info");
const updateForm = document.querySelector("#update-form");
const updateMessage = document.querySelector("#update-message");

const avatarForm = document.querySelector("#avatar-form");
const avatarMessage = document.querySelector("#avatar-message");

const logoutButton = document.querySelector("#logout-button");

const updateUsername = document.querySelector("#update-username");
const updateEmail = document.querySelector("#update-email");
const avatarInput = document.querySelector("#avatar");

const token = localStorage.getItem("token");

async function loadProfile() {
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const user = await getCurrentUser(token);

    profileInfo.innerHTML = `
      ${
        user.avatar
          ? `
            <img
              src="https://media2.edu.metropolia.fi/restaurant/uploads/${user.avatar}"
              alt="Profile picture"
              class="profile-picture"
            />
          `
          : "<p>No profile picture.</p>"
      }

      <p>
        <strong>Username:</strong>
        ${user.username}
      </p>

      <p>
        <strong>Email:</strong>
        ${user.email}
      </p>

      <p>
        <strong>Role:</strong>
        ${user.role}
      </p>
    `;

    updateUsername.value = user.username;
    updateEmail.value = user.email;
  } catch (error) {
    console.error(error);

    localStorage.removeItem("token");

    profileInfo.innerHTML = `
      <p>Your login has expired. Please login again.</p>
    `;

    updateForm.style.display = "none";
    avatarForm.style.display = "none";
    logoutButton.textContent = "Go to Login";

    logoutButton.addEventListener(
      "click",
      () => {
        window.location.href = "login.html";
      },
      { once: true },
    );
  }
}

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  updateMessage.textContent = "";

  const username = updateUsername.value.trim();
  const email = updateEmail.value.trim();

  try {
    await updateUser(token, username, email);

    updateMessage.textContent = "Profile updated successfully!";

    await loadProfile();
  } catch (error) {
    console.error(error);

    updateMessage.textContent = error.message;
  }
});

avatarForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  avatarMessage.textContent = "";

  const avatarFile = avatarInput.files[0];

  if (!avatarFile) {
    avatarMessage.textContent = "Please choose an image.";
    return;
  }

  try {
    await uploadAvatar(token, avatarFile);

    avatarMessage.textContent = "Profile picture uploaded successfully!";

    avatarForm.reset();

    await loadProfile();
  } catch (error) {
    console.error(error);

    avatarMessage.textContent = error.message;
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");

  window.location.href = "login.html";
});

loadProfile();
