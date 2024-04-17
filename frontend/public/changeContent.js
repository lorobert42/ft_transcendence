import initChat from "./js/scripts/initChat.js";
import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import profilePage from "./pages/profilePage.js";
import registerPage from "./pages/registerPage.js";
import localRoom from "./pages/gameroom.js";
import { isLoggedIn } from "./js/utils/loginHandler.js";

function pageRouting() {
  if (isLoggedIn()) {
    console.log('is logged in');
  } else {
    console.log('is logged out');
  }
  const path = window.location.pathname;
  console.log("Path: " + path);
  //if path is /home, send load content with function
  var contentDiv = document.getElementById("content");
  switch (path) {
    case "/":
      contentDiv.innerHTML = homePage();
      break;
    case "/login":
      contentDiv.innerHTML = loginPage();
      import("/js/scripts/loginForm.js")
        .then((module) => {
          module.loginFormModule.init();
        })
        .catch((error) => {
          console.error("Failed to load the login form module", error);
        });
      break;
    case "/register":
      contentDiv.innerHTML = registerPage();
      import("/js/scripts/registerForm.js")
        .then((module) => {
          module.registerFormModule.init();
        })
        .catch((error) => {
          console.error("Failed to load the login form module", error);
        });
      break;
    case "/profile":
      contentDiv.innerHTML = profilePage();
      import("/js/scripts/fetchUserProfile.js")
        .then((module) => {
          module.fetchUserProfileModule.fetchUserProfile();
        })
        .catch((error) => {
          console.error("Failed to load the login form module", error);
        });
      break;
    case "/chat":
      contentDiv.innerHTML = initChat();
      break;
    case "/localroom":
      contentDiv.innerHTML = localRoom();
      import("./pong.js")
        .then((module) => {
          module.initPongGame();
        })
      break;
    default:
      contentDiv.innerHTML = homePage();
      break;
  }

}


window.addEventListener('popstate', pageRouting);
window.addEventListener('pushstate', pageRouting);
// Adding event listeners when the DOM content has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#home-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', window.location.origin + e.target.pathname);
    pageRouting();
  });

  document.querySelector("#login-link").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("login link clicked");
    console.log(e.target.href);
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  document.querySelector("#register-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();

  });


  document.querySelector("#profile-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  document.querySelector("#local-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  // change dropdown text value depending on selected option
  document.querySelectorAll(".dropdown a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".dropdown-toggle").innerText = item.innerText;
      //add a cookie to store the selected value with the value samesite=strict
      document.cookie = `lang=${item.innerText}; samesite=strict`;
      history.pushState(null, '', window.location.href);
      pageRouting();
    });
  });

  // load the content of the dropdown based on the cookie named lang value
  const lang = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  if (lang) {
    document.querySelector(".dropdown-toggle").innerText = lang.split("=")[1];
  } else {
    document.querySelector(".dropdown-toggle").innerText = "EN";
  }
  pageRouting();
});
