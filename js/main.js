import { getRestaurants } from "./api.js";

const restaurantCount = document.querySelector("#restaurant-count");
const restaurantList = document.querySelector("#restaurant-list");
const searchInput = document.querySelector("#search-input");
const cityFilter = document.querySelector("#city-filter");
const providerFilter = document.querySelector("#provider-filter");

const nearestButton = document.querySelector("#nearest-button");
const showAllButton = document.querySelector("#show-all-button");
const favoritesButton = document.querySelector("#favorites-button");

const map = L.map("map").setView([60.1699, 24.9384], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerGroup = L.layerGroup().addTo(map);

let allRestaurants = [];
let nearestRestaurantId = null;
let showingFavorites = false;

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function displayMapMarkers(restaurants) {
  markerGroup.clearLayers();

  restaurants.forEach((restaurant) => {
    if (restaurant.location?.coordinates) {
      const longitude = restaurant.location.coordinates[0];
      const latitude = restaurant.location.coordinates[1];

      L.marker([latitude, longitude]).addTo(markerGroup).bindPopup(`
          <strong>${restaurant.name}</strong><br>
          ${restaurant.address}<br>
          ${restaurant.city}
        `);
    }
  });
}

function displayRestaurants(restaurants) {
  restaurantList.innerHTML = "";

  restaurantCount.textContent = `${restaurants.length} restaurants found`;

  if (restaurants.length === 0) {
    restaurantList.innerHTML = "<p>No restaurants found.</p>";
    return;
  }

  restaurants.forEach((restaurant) => {
    const card = document.createElement("div");

    card.classList.add("restaurant-card");

    if (restaurant._id === nearestRestaurantId) {
      card.classList.add("nearest-restaurant");
    }

    card.innerHTML = `
      <h3>${restaurant.name}</h3>

      ${
        restaurant._id === nearestRestaurantId
          ? "<p><strong>📍 Nearest restaurant</strong></p>"
          : ""
      }

      <p>
        <strong>Address:</strong>
        ${restaurant.address}
      </p>

      <p>
        <strong>City:</strong>
        ${restaurant.city}
      </p>

      <a href="restaurant.html?id=${restaurant._id}">
        View menu
      </a>

      <button
        class="favorite-button"
        data-id="${restaurant._id}"
      >
        ${favorites.includes(restaurant._id) ? "⭐ Favorited" : "☆ Favorite"}
      </button>
    `;

    const favoriteButton = card.querySelector(".favorite-button");

    favoriteButton.addEventListener("click", () => {
      toggleFavorite(restaurant._id);
    });

    restaurantList.appendChild(card);
  });
}

function toggleFavorite(restaurantId) {
  if (favorites.includes(restaurantId)) {
    favorites = favorites.filter((id) => id !== restaurantId);
  } else {
    favorites.push(restaurantId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  filterRestaurants();
}

function createCityFilter(restaurants) {
  const cities = restaurants
    .map((restaurant) => restaurant.city)
    .filter((city) => city);

  const uniqueCities = [...new Set(cities)];

  uniqueCities.sort();

  uniqueCities.forEach((city) => {
    const option = document.createElement("option");

    option.value = city;
    option.textContent = city;

    cityFilter.appendChild(option);
  });
}

function createProviderFilter(restaurants) {
  const providers = restaurants
    .map((restaurant) => restaurant.company)
    .filter((company) => company);

  const uniqueProviders = [...new Set(providers)];

  uniqueProviders.sort();

  uniqueProviders.forEach((provider) => {
    const option = document.createElement("option");

    option.value = provider;
    option.textContent = provider;

    providerFilter.appendChild(option);
  });
}

function filterRestaurants() {
  const searchText = searchInput.value.trim().toLowerCase();

  const selectedCity = cityFilter.value;
  const selectedProvider = providerFilter.value;

  let restaurantsToFilter = allRestaurants;

  if (showingFavorites) {
    restaurantsToFilter = allRestaurants.filter((restaurant) =>
      favorites.includes(restaurant._id),
    );
  }

  const filteredRestaurants = restaurantsToFilter.filter((restaurant) => {
    const restaurantName = restaurant.name?.toLowerCase() || "";

    const matchesSearch = restaurantName.includes(searchText);

    const matchesCity =
      selectedCity === "all" || restaurant.city === selectedCity;

    const matchesProvider =
      selectedProvider === "all" || restaurant.company === selectedProvider;

    return matchesSearch && matchesCity && matchesProvider;
  });

  displayRestaurants(filteredRestaurants);
  displayMapMarkers(filteredRestaurants);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function findNearestRestaurant() {
  showingFavorites = false;

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLatitude = position.coords.latitude;

      const userLongitude = position.coords.longitude;

      let shortestDistance = Infinity;
      let nearestRestaurant = null;

      allRestaurants.forEach((restaurant) => {
        if (!restaurant.location?.coordinates) {
          return;
        }

        const [longitude, latitude] = restaurant.location.coordinates;

        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          latitude,
          longitude,
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestRestaurant = restaurant;
        }
      });

      if (nearestRestaurant) {
        nearestRestaurantId = nearestRestaurant._id;

        displayRestaurants([nearestRestaurant]);
        displayMapMarkers([nearestRestaurant]);

        const [longitude, latitude] = nearestRestaurant.location.coordinates;

        map.setView([latitude, longitude], 15);
      }
    },

    (error) => {
      console.error(error);

      alert("Could not get your location. Please allow location access.");
    },
  );
}

function showAllRestaurants() {
  nearestRestaurantId = null;
  showingFavorites = false;

  searchInput.value = "";
  cityFilter.value = "all";
  providerFilter.value = "all";

  displayRestaurants(allRestaurants);
  displayMapMarkers(allRestaurants);

  map.setView([60.1699, 24.9384], 10);
}

function showFavorites() {
  nearestRestaurantId = null;
  showingFavorites = true;

  filterRestaurants();
}

async function loadRestaurants() {
  try {
    allRestaurants = await getRestaurants();

    createCityFilter(allRestaurants);
    createProviderFilter(allRestaurants);

    displayRestaurants(allRestaurants);
    displayMapMarkers(allRestaurants);
  } catch (error) {
    console.error(error);

    restaurantCount.textContent = "";

    restaurantList.innerHTML = `
      <p>Could not load restaurants.</p>
    `;
  }
}

searchInput.addEventListener("input", filterRestaurants);

cityFilter.addEventListener("change", filterRestaurants);

providerFilter.addEventListener("change", filterRestaurants);

nearestButton.addEventListener("click", findNearestRestaurant);

showAllButton.addEventListener("click", showAllRestaurants);

favoritesButton.addEventListener("click", showFavorites);

loadRestaurants();
