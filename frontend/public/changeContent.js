import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import otpPage from "./pages/otpPage.js";
import profilePage from "./pages/profilePage.js";
import enableOtpPage from "./pages/enableOtpPage.js";
import otpDisablePage from "./pages/otpDisablePage.js";
import registerPage from "./pages/registerPage.js";
import localRoom from "./pages/localGameroom.js";
import onlineRoom from "./pages/onlineGameroom.js";
import { isLoggedIn } from "./js/utils/isLoggedIn.js";
import contacts from "./pages/contacts.js";
import updatePage from "./pages/updatePage.js";
import tournament from "./pages/tournament.js";
import gameSearch from "./pages/gameSearch.js";
import { rootPageTraduction } from "./pages/rootPage.js";
import { setNavbar } from "./js/utils/navbarElements.js";
import { getLang } from "./js/utils/getLang.js";
import { printMessage } from "./js/utils/toastMessage.js";
import gameCreation from "./pages/gameCreation.js";
import tournamentCreation from "./pages/tournamentCreation.js";
import { decodeJWT } from "./js/utils/tokenHandler.js";
import gameResults from "./pages/gameResults.js";
import { getRefreshToken } from "./js/fetchers/usersFetcher.js";

export let dataSave = { socketArrayCollector: [], intervalsList: []};

export const pageRefreshRate = 5000;

export default async function pageRouting(data = {}) {
  const path = window.location.pathname;
  rootPageTraduction();

  let isLogged = await isLoggedIn();
  setNavbar(isLogged);
  if (isLogged) {
    data.user = decodeJWT(localStorage.getItem("authToken"));
  }

  function redirectPath(path) {
    history.pushState(null, '', path);
    pageRouting(data);
  }


  // if path is /home, send load content with function
  let contentDiv = document.getElementById("content");

  if(dataSave.socketArrayCollector.length > 0) {
    dataSave.socketArrayCollector.forEach((socket) => {
      if(socket.readyState === 1 || socket.OPEN === 1) {
        socket.close();
        console.log("One socket closed");
      }});
    dataSave.socketArrayCollector = [];
  }
  if(dataSave.intervalsList.length > 0) {
    dataSave.intervalsList.forEach((interval) => {
      clearInterval(interval);
    });
    dataSave.intervalsList = [];
  }

  dataSave = {
    ...dataSave,
    ...data,
  };
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
        .then(async (module) => {
          module.userProfileModule(data);
        })
        .catch((error) => {
          console.error("Failed to load the login form module", error);
        });
      break;

    case "/enable-otp":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = enableOtpPage();
      import("/js/scripts/enableOtpForm.js")
        .then((module) => {
          module.enableOtpFormModule.init(data);
        })
        .catch((error) => {
          console.error("Failed to load the enable otp form module", error);
        });
      break;

    case "/disable-otp":
      if (isLogged) {
        redirectPath('/profile');
        return;
      }
      contentDiv.innerHTML = otpDisablePage();
      import("/js/scripts/otpDisableForm.js")
        .then((module) => {
          module.otpDisableModule.init(data);
        })
        .catch((error) => {
          console.error("Failed to load the disable otp form module", error);
        });
      break;

    case "/onlineCreation":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = gameCreation();
      import("./js/scripts/gameCreationHandler.js")
        .then((module) => {
          module.gameCreationHandler(data);
        })
        .catch((error) => {
          console.error("Failed to load the game creation handler module", error);
        });
      break;

    case "/localroom":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = localRoom();
      import("./js/scripts/localPong.js")
        .then((module) => {
          module.initPongGame(data);
        })
      break;

    case "/friend":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = contacts();
      import("./js/scripts/friendsHandler.js")
        .then((module) => {
          module.initFriendsHandler();
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

    case "/online":
      if (!isLogged || !data.gameId) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = onlineRoom();
      import("./js/scripts/onlinePong.js")
        .then((module) => {
          module.initPongGame(data);
        })
        .catch((error) => {
          console.error("Failed to load the online pong module", error);
        });
      break;

    case "/tournamentCreation":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = tournamentCreation();
      import("./js/scripts/tournamentCreationHandler.js")
        .then((module) => {
          module.tournamentCreationHandler(data);
        })
        .catch((error) => {
          console.error("Failed to load the tournament creation module", error);
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
          module.tournamentHandler(data);
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
          module.gameSearchHandler(data);
        })
        .catch((error) => {
          console.error("Failed to load the game search module", error);
        });
      break;

    case "/results":
      if (!isLogged) {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = gameResults();
      import("./js/scripts/resultsHandler.js")
        .then((module) => {
          module.resultsHandler(data);
        })
        .catch((error) => {
          console.error("Failed to load the results module", error);
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

  document.querySelector("#gamesearch-link").addEventListener("click", (e) => {
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
      pageRouting(dataSave);
    });
  });

  document.getElementById("logout-button").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    printMessage("Logout Successful");
    history.pushState(null, '', '/');
    pageRouting();
  });

  setInterval(getRefreshToken, 270000);

  dropDownLanguage();
  pageRouting();
});
