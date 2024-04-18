import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import otpPage from "./pages/otpPage.js";
import profilePage from "./pages/profilePage.js";
import enableOtpPage from "./pages/enableOtpPage.js";
import registerPage from "./pages/registerPage.js";
import localRoom from "./pages/gameroom.js";
import { isLoggedIn } from "./js/utils/loginHandler.js";
import contacts from "./pages/contacts.js";
import updatePage from "./pages/updatePage.js";
import tournament from "./pages/tournament.js";
import gameSearch from "./pages/gameSearch.js";

export default async function pageRouting() {
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
    case "/otp":
      contentDiv.innerHTML = otpPage();
      import("/js/scripts/otpForm.js")
        .then((module) => {
          module.otpFormModule.init(data);
        })
        .catch((error) => {
          console.error("Failed to load the otp form module", error);
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
      import("/js/scripts/userProfile.js")
        .then((module) => {
          module.userProfileModule.init();
        })
        .catch((error) => {
          console.error("Failed to load the login form module", error);
        });
      break;
    case "/enable-otp":
      contentDiv.innerHTML = enableOtpPage();
      import("/js/scripts/enableOtpForm.js")
        .then((module) => {
          module.enableOtpFormModule.init(data);
        })
        .catch((error) => {
          console.error("Failed to load the enable otp form module", error);
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
      case "/friend":
        contentDiv.innerHTML = contacts();
        import("./js/utils/contactHandler.js")
          .then((module) => {
            module.contactHandler();
          })
          .catch((error) => {
            console.error("Failed to load the contact handler module", error);
          });
        break;
      case "/update":
        contentDiv.innerHTML = updatePage();
        import("./js/scripts/updateForm.js")
          .then((module) => {
            module.updateForm();
          })
          .catch((error) => {
            console.error("Failed to load the login form module", error);
          });
        break;
        case "/tournament":
          contentDiv.innerHTML = tournament();
          import("./js/scripts/tournamentHandler.js")
            .then((module) => {
              module.tournamentHandler();
            })
            .catch((error) => {
              console.error("Failed to load the tournament module", error);
            });
          break;
        case "/gamesearch":
          contentDiv.innerHTML = gameSearch();
          import("./js/scripts/gameSearchHandler.js")
            .then((module) => {
              module.gameSearchHandler();
            })
            .catch((error) => {
              console.error("Failed to load the game search module", error);
            });
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

  document.querySelector("#friend-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  document.querySelector("#update-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  document.querySelector("#tournament-link").addEventListener("click", (e) => {
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
