import { getRestaurantById, getDailyMenu, getWeeklyMenu } from "./api.js";

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("id");

const restaurantInfo = document.querySelector("#restaurant-info");
const dailyButton = document.querySelector("#daily-button");
const weeklyButton = document.querySelector("#weekly-button");
const locateButton = document.querySelector("#locate-restaurant-button");
const menuContainer = document.querySelector("#menu-container");

async function loadRestaurant() {
  if (!restaurantId) {
    restaurantInfo.innerHTML = `
      <p>Restaurant not found.</p>
    `;

    locateButton.style.display = "none";

    return;
  }

  try {
    const restaurant = await getRestaurantById(restaurantId);

    restaurantInfo.innerHTML = `
      <h2>${restaurant.name}</h2>

      <p>
        <strong>Address:</strong>
        ${restaurant.address || "Not available"}
      </p>

      <p>
        <strong>City:</strong>
        ${restaurant.city || "Not available"}
      </p>

      ${
        restaurant.company
          ? `
            <p>
              <strong>Provider:</strong>
              ${restaurant.company}
            </p>
          `
          : ""
      }
    `;
  } catch (error) {
    console.error(error);

    restaurantInfo.innerHTML = `
      <p>Could not load restaurant information.</p>
    `;

    locateButton.style.display = "none";
  }
}

function locateRestaurantOnMap() {
  if (!restaurantId) {
    return;
  }

  window.location.href = `index.html?restaurant=${restaurantId}#map-section`;
}

async function loadDailyMenu() {
  if (!restaurantId) {
    menuContainer.innerHTML = `
      <p>Restaurant not found.</p>
    `;
    return;
  }

  menuContainer.innerHTML = `
    <p>Loading daily menu...</p>
  `;

  try {
    const menu = await getDailyMenu(restaurantId);

    menuContainer.innerHTML = "";

    if (!menu.courses || menu.courses.length === 0) {
      menuContainer.innerHTML = `
        <p>No daily menu available.</p>
      `;
      return;
    }

    menu.courses.forEach((course) => {
      const courseElement = document.createElement("div");

      courseElement.classList.add("menu-item");

      courseElement.innerHTML = `
        <h3>${course.name || "Meal"}</h3>

        ${course.price ? `<p><strong>Price:</strong> ${course.price}</p>` : ""}

        ${course.diets ? `<p><strong>Diets:</strong> ${course.diets}</p>` : ""}
      `;

      menuContainer.appendChild(courseElement);
    });
  } catch (error) {
    console.error(error);

    menuContainer.innerHTML = `
      <p>Could not load today's menu.</p>
    `;
  }
}

async function loadWeeklyMenu() {
  if (!restaurantId) {
    menuContainer.innerHTML = `
      <p>Restaurant not found.</p>
    `;
    return;
  }

  menuContainer.innerHTML = `
    <p>Loading weekly menu...</p>
  `;

  try {
    const menu = await getWeeklyMenu(restaurantId);

    menuContainer.innerHTML = "";

    if (!menu.days || menu.days.length === 0) {
      menuContainer.innerHTML = `
        <p>No weekly menu available.</p>
      `;
      return;
    }

    menu.days.forEach((day) => {
      const dayElement = document.createElement("div");

      dayElement.classList.add("menu-day");

      dayElement.innerHTML = `
        <h3>${day.date || "Menu"}</h3>
      `;

      if (!day.courses || day.courses.length === 0) {
        dayElement.innerHTML += `
          <p>No menu available for this day.</p>
        `;
      } else {
        day.courses.forEach((course) => {
          dayElement.innerHTML += `
            <div class="menu-item">
              <h4>${course.name || "Meal"}</h4>

              ${
                course.price
                  ? `<p><strong>Price:</strong> ${course.price}</p>`
                  : ""
              }

              ${
                course.diets
                  ? `<p><strong>Diets:</strong> ${course.diets}</p>`
                  : ""
              }
            </div>
          `;
        });
      }

      menuContainer.appendChild(dayElement);
    });
  } catch (error) {
    console.error(error);

    menuContainer.innerHTML = `
      <p>Could not load the weekly menu.</p>
    `;
  }
}

dailyButton.addEventListener("click", loadDailyMenu);

weeklyButton.addEventListener("click", loadWeeklyMenu);

locateButton.addEventListener("click", locateRestaurantOnMap);

loadRestaurant();
loadDailyMenu();
