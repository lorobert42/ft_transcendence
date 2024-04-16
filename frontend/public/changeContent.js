import initChat from "./js/scripts/initChat.js";
import chatPage from "./pages/chatPage.js";
import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import profilePage from "./pages/profilePage.js";
import registerPage from "./pages/registerPage.js";

// Adding event listeners when the DOM content has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#home-link").addEventListener("click", (e) => {
    e.preventDefault();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = homePage();
  });

  document.querySelector("#chat-link").addEventListener("click", (e) => {
    e.preventDefault();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = chatPage();
    initChat();
  });

  document.querySelector("#login-link").addEventListener("click", (e) => {
    e.preventDefault();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = loginPage();
    import("/js/scripts/loginForm.js")
      .then((module) => {
        module.loginFormModule.init();
      })
      .catch((error) => {
        console.error("Failed to load the login form module", error);
      });
  });
  document.querySelector("#register-link").addEventListener("click", (e) => {
    e.preventDefault();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = registerPage();
    import("/js/scripts/registerForm.js")
      .then((module) => {
        module.registerFormModule.init();
      })
      .catch((error) => {
        console.error("Failed to load the login form module", error);
      });
  });
});
document.querySelector("#profile-link").addEventListener("click", (e) => {
  e.preventDefault();
  var contentDiv = document.getElementById("content");
  contentDiv.innerHTML = profilePage();
  import("/js/scripts/fetchUserProfile.js")
    .then((module) => {
      module.fetchUserProfileModule.fetchUserProfile();
    })
    .catch((error) => {
      console.error("Failed to load the login form module", error);
    });
});
