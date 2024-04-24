import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import otpPage from "./pages/otpPage.js";
import profilePage from "./pages/profilePage.js";
import enableOtpPage from "./pages/enableOtpPage.js";
import registerPage from "./pages/registerPage.js";

import localRoom from "./pages/localGameroom.js";
import onlineRoom from "./pages/onlineGameroom.js";

import { getUserInfo, isLoggedIn } from "./js/utils/loginHandler.js";
import contacts from "./pages/contacts.js";
import updatePage from "./pages/updatePage.js";
import tournament from "./pages/tournament.js";
import gameSearch from "./pages/gameSearch.js";
import { rootPageTraduction } from "./pages/rootPage.js";
import { setNavbar } from "./js/utils/navbarElements.js";
import { getLang } from "./js/utils/getLang.js";
import { printMessage } from "./js/utils/toastMessage.js";

export default async function pageRouting(data = {}) {
  const path = window.location.pathname;
  rootPageTraduction();

  let isLogged = isLoggedIn();
  setNavbar(isLogged);

  if (isLogged) {
    console.log('is logged in');
    data.user = await getUserInfo();
    console.log(data);
  } else {
    console.log('is logged out');
  }
  console.log("Path: " + path);

  function redirectPath(path) {
    // history.pushState(null, '', path);
    // pageRouting();
  }



  // if path is /home, send load content with function
  let contentDiv = document.getElementById("content");
  switch (path) {
    case "/":
      contentDiv.innerHTML = homePage();
      break;
    case "/login":
      if (isLogged) {
        redirectPath('/profile');
        return;
      }
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
      if (isLogged) {
        redirectPath('/profile');
        return;
      }
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
      if (isLogged) {
        redirectPath('/profile');
        return;
      }
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
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = profilePage();
      import("/js/scripts/userProfile.js")
        .then((module) => {
          module.userProfileModule.init(data);
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
    case "/online":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = onlineRoom();
      import("./js/scripts/onlinePong.js")
        .then((module) => {
          module.initPongGame();
        })
      break;
    case "/localroom":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = localRoom();
      import("./js/scripts/localPong.js")
        .then((module) => {
          module.initPongGame();
        })
      break;
    case "/friend":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
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
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
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
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
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
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
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
document.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault();
  let mainContent = document.getElementById("root");

  rootPageTraduction();

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


  document.querySelector("#friend-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });

  document.querySelector("#tournament-link").addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    pageRouting();
  });


  function dropDownLanguage() {
    const lang = getLang();
    document.querySelector(".dropdown-toggle").innerText = lang;
  }

  // change dropdown text value depending on selected option
  document.querySelectorAll(".dropdown a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".dropdown-toggle").innerText = item.innerText;
      //add a cookie to store the selected value with the value samesite=strict
      document.cookie = `lang=${item.innerText}; samesite=strict`;
      dropDownLanguage();
      history.pushState(null, '', window.location.href);
      pageRouting();
    });
  });

  document.getElementById("logout-button").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    printMessage("Logout Successful");
    history.pushState(null, '', '/');
    pageRouting();
  });

  dropDownLanguage();
  pageRouting();
});
