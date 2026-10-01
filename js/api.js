const BASE_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";

/* =========================
   RESTAURANTS
========================= */

export async function getRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`);

  if (!response.ok) {
    throw new Error("Could not load restaurants");
  }

  return await response.json();
}

export async function getRestaurantById(id) {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`);

  if (!response.ok) {
    throw new Error("Could not load restaurant");
  }

  return await response.json();
}

/* =========================
   MENUS
========================= */

export async function getDailyMenu(id) {
  const response = await fetch(`${BASE_URL}/restaurants/daily/${id}/en`);

  if (!response.ok) {
    throw new Error("Could not load daily menu");
  }

  return await response.json();
}

export async function getWeeklyMenu(id) {
  const response = await fetch(`${BASE_URL}/restaurants/weekly/${id}/en`);

  if (!response.ok) {
    throw new Error("Could not load weekly menu");
  }

  return await response.json();
}

/* =========================
   REGISTER
========================= */

export async function registerUser(username, email, password) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

/* =========================
   LOGIN
========================= */

export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  /*
   The API may return a response without a token
   when the login details are incorrect.
  */
  if (!response.ok || !data.token) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/* =========================
   CURRENT USER
========================= */

export async function getCurrentUser(token) {
  const response = await fetch(`${BASE_URL}/users/token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load user");
  }

  return data;
}

/* =========================
   UPDATE USER
========================= */

export async function updateUser(token, username, email) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      username,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not update profile");
  }

  return data;
}

/* =========================
   PROFILE PICTURE
========================= */

export async function uploadAvatar(token, avatarFile) {
  const formData = new FormData();

  formData.append("avatar", avatarFile);

  const response = await fetch(`${BASE_URL}/users/avatar`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "Could not upload profile picture",
    );
  }

  return data;
}
