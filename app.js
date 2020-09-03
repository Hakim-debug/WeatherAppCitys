const proxy = "https://cors-anywhere.herokuapp.com/";
const endpoint =
  "https://gist.githubusercontent.com/shafiqkhalili/3d8fcab29bd8f211b85555cd17b9215a/raw/2aaadc33d47514634f2e2f5fcd1244277be31ac2/BiggestCities.json";

var long = null;
var lat = null;

let tempertureDescription = document.querySelector(".temperture-description");
let tempertureDegree = document.querySelector(".temperture-degree");
let locationTimezone = document.querySelector(".location-timzone");
let tempertureSection = document.querySelector(".temperture");

const tempertureSpan = document.querySelector(".temperture span");
//const searchBar = document.getElementById("searchBar");


const cities = [];
//Get info about cities and geo locaiton for search input
fetch(endpoint)
  .then((blob) => blob.json())
  .then((citiesInfo) => cities.push(...citiesInfo));


//Filtering cities by search keyword
async function findMatches(wordToMatch, cities) {

  const regex = new RegExp(wordToMatch, "gi");
  return await cities
    .filter((place) => {
      return place.city.match(regex) || place.country.match(wordToMatch);
    })
    .slice(0, 1);
}

//Addin comma after 3 alfabets
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Display info in li option
function displayMatches() {
  lat,
  (long = null);
  if (this.value.length >= 2) {
    const matchArray = findMatches(this.value, cities);

    matchArray.then((matchArray) => {
      if (matchArray.length > 0) {
        lat = matchArray[0].lat;
        long = matchArray[0].lng;
        console.log(lat);
      }
      const html = matchArray
        .map((place) => {
          if (matchArray.length <= 5) {
            oldWeather();
          }
          const regex = new RegExp(this.value, "gi");
          const cityName = place.city.replace(
            regex,
            `<span class="hl">${this.value}</span>`
          );
          const countryName = place.country.replace(
            regex,
            `<span class="hl">${this.value}</span>`
          );
          return `<li>
                      <span class="name">${cityName}, ${countryName}</span>
                      <span class="population">lat: ${lat},long: ${long}</span>

                    </li>
                  `;
        })
        .join("");
      suggestions.innerHTML = html;
    });
  } else if (this.value.length === 0) {
    suggestions.innerHTML = ` <li>Filter for a city</li><li>or a country</li>`;
    oldWeather();
  }
}

const searchInput = document.querySelector(".search");
const suggestions = document.querySelector(".suggestions");

searchInput.addEventListener("change", displayMatches);
searchInput.addEventListener("keyup", displayMatches);
searchInput.addEventListener("keyup", (event) => {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    oldWeather();
  }
});
//searchInput.addEventListener('focusout', getWeather);
function getGetLocaiton() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        console.log("long: ", long);
        console.log("lat: ", lat);

      },
      (failure) => {
        console.log(failure.message);
      }
    );
  } else {
    // container.innerHTML = "Geolocation is not Supported for this browser/OS.";
    alert("Geolocation is not Supported for this browser/OS");
  }
}
window.addEventListener(`load`, () => {
  // Hittar din position long ,lat
  oldWeather();
});
//API for getting weather info
function oldWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      if (long === null || lat === null) {
        long = position.coords.longitude;
        lat = position.coords.latitude;
      }

      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;
      console.log("getting weatehr info!");
      //const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/59.4071748,17.9298104`;
      console.log("weatehr API: ", api);
      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.table(data);
          const {
            temperature,
            summary,
            icon
          } = data.currently;
          tempertureDegree.textContent = temperature;
          tempertureDescription.textContent = summary;
          locationTimezone.textContent = data.timezone;
          //Forumla from celsius
          let celsius = (temperature - 32) * (5 / 9);
          //Set icon
          setIcons(icon, document.querySelector(".icon"));
          tempertureSection.addEventListener("click", () => {
            if (tempertureSpan.textContent === "F°") {
              tempertureSpan.textContent = "C°";
              tempertureDegree.textContent = Math.floor(celsius);
            } else {
              tempertureSpan.textContent = "F°";
              tempertureDegree.textContent = temperature;
            }
          });
        })
        .catch((error) => {
          console.error("Error: ", error);
        });


    });
  }
}

function getWeather(api) {
  console.log(`Latitude: ${lat}, Longtitude: ${long}`);
  try {

    console.log("Fetching weatehr info!");

    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //Set the DOM elememt from the api
        console.table(data);
        const {
          temperature,
          summary,
          icon
        } = data.currently;
        tempertureDegree.textContent = temperature;
        tempertureDescription.textContent = summary;
        locationTimezone.textContent = data.timezone;
        //Forumla from celsius
        let celsius = (temperature - 32) * (5 / 9);
        //Set icon
        setIcons(icon, document.querySelector(".icon"));
        tempertureSection.addEventListener("click", () => {
          if (tempertureSpan.textContent === "F°") {
            tempertureSpan.textContent = "C°";
            tempertureDegree.textContent = Math.floor(celsius);
          } else {
            tempertureSpan.textContent = "F°";
            tempertureDegree.textContent = temperature;
          }
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

  } catch (error) {
    console.error(error);
  }
}

async function fetchWeaterh(api) {
  try {
    await fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      }).catch(err => {
        console.error(err);
      })
  } catch (error) {
    console.error(error);
  }

}

function setIcons(icon, iconID) {
  const skycons = new Skycons({
    color: "white",
  });
  const currentIcon = icon.replace(/-/g, "_").toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}