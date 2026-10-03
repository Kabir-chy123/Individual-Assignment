# StudentEats

StudentEats is a web application for finding student restaurants in Finland and viewing their daily and weekly menus.

The application was created for the **TX00EY23 Web Application Development** individual assignment at Metropolia University of Applied Sciences.

## Features

- Browse student restaurants in Finland
- View daily menus
- View weekly menus
- Search restaurants by name
- Filter restaurants by city
- Filter restaurants by service provider
- Display restaurants on an interactive map
- Locate a selected restaurant on the map
- Find the nearest restaurant using browser geolocation
- Save favorite restaurants
- User registration
- User login
- User profile
- Update user information
- Upload a profile picture
- Responsive layout for desktop and mobile devices

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- REST API
- Fetch API
- Leaflet
- OpenStreetMap
- Browser Geolocation API
- LocalStorage

No JavaScript or CSS frameworks such as React, Angular, Bootstrap, or jQuery are used.

## REST API

Restaurant, menu and user data are retrieved using the Metropolia student restaurant REST API.

## Map

Restaurant locations are displayed using Leaflet and OpenStreetMap.

Users can locate individual restaurants on the map and use browser geolocation to find the nearest restaurant.

## Favorites

Favorite restaurant IDs are stored in the browser using LocalStorage.

## User Account

Users can:

- Register an account
- Log in
- View their profile
- Update their username and email
- Upload a profile picture
- Log out

Authentication uses the token provided by the REST API.

## Public Application

StudentEats is deployed on the Metropolia users server:

https://users.metropolia.fi/~kabirc/StudentEats/

## Author

Student project for TX00EY23 Web Application Development.
