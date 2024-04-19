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
import rootPage from "./pages/rootPage.js";

export default async function pageRouting() {
  const path = window.location.pathname;

  const homeLink = document.getElementById("home-link");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  const profileLink = document.getElementById("profile-link");
  const localLink = document.getElementById("local-link");
  const friendLink = document.getElementById("friend-link");
  const updateLink = document.getElementById("update-link");
  const tournamentLink = document.getElementById("tournament-link");
  const gamesearchLink = document.getElementById("gamesearch-link");
  const logoutButton = document.getElementById("logout-button");

  let logged = isLoggedIn();
  if (logged) {
      loginLink.style.display = "none";
      registerLink.style.display = "none";
      profileLink.style.display = "block";
      localLink.style.display = "block";
      friendLink.style.display = "block";
      updateLink.style.display = "block";
      tournamentLink.style.display = "block";
      gamesearchLink.style.display = "block";
      logoutButton.style.display = "block";
  } else {
      profileLink.style.display = "none";
      localLink.style.display = "none";
      friendLink.style.display = "none";
      updateLink.style.display = "none";
      tournamentLink.style.display = "none";
      gamesearchLink.style.display = "none";
      loginLink.style.display = "block";
      registerLink.style.display = "block";
      logoutButton.style.display = "none";
  }

  if (isLoggedIn()) {
    console.log('is logged in');
  } else {
    console.log('is logged out');
  }
  console.log("Path: " + path);

  function redirectPath(path) {
    history.pushState(null, '', path);
    pageRouting();
  }



  //if path is /home, send load content with function
  let contentDiv = document.getElementById("content");
  switch (path) {
    case "/":
      contentDiv.innerHTML = homePage();
      break;
    case "/login":
      if(logged)
      {
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
      if(logged)
      {
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
      if(logged)
      {
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
      if(!logged)
      {
        redirectPath('/login');
        return;
      }
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
      if(logged)
      {
        redirectPath('/profile');
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
    case "/localroom":
      if(!logged)
      {
        redirectPath('/login');
        return;
      }
      contentDiv.innerHTML = localRoom();
      import("./pong.js")
        .then((module) => {
          module.initPongGame();
        })
      break;
      case "/friend":
        if(!logged)
        {
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
        if(!logged)
        {
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
          if(!logged)
          {
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
          if(!logged)
          {
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

let mainContent = document.getElementById("root");

mainContent.innerHTML = await rootPage();

window.addEventListener('popstate', (event)  => {
  event.preventDefault();
  pageRouting;
});
window.addEventListener('pushstate', (event)  =>{
  event.preventDefault();
  pageRouting();
});
// Adding event listeners when the DOM content has fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault();
  pageRouting();

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

  document.getElementById("logout-button").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    history.pushState(null, '', '/');
    pageRouting();
  });


  // load the content of the dropdown based on the cookie named lang value
  const lang = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  if (lang) {
    document.querySelector(".dropdown-toggle").innerText = lang.split("=")[1];
  } else {
    document.querySelector(".dropdown-toggle").innerText = "EN";
  }
});