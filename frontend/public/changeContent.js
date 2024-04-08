import initChat from "./js/scripts/initChat.js";
import chatPage from "./pages/chatPage.js";
import homePage from "./pages/homePage.js";
import loginPage from "./pages/loginPage.js";
import registerPage from "./pages/registerPage.js";

function changeContent(page) {
  var contentDiv = document.getElementById("content");

  switch (page) {
    case "home":
      contentDiv.innerHTML = homePage();

      break;

    case "register":
      contentDiv.innerHTML = registerPage();
      break;
    case "about":
      contentDiv.innerHTML = `
                <h2>About Us</h2>
                <p>
                    This is the about page content. Learn more
                    about our purpose and team.
                </p>
                <p>
                    We're passionate about creating engaging and
                    informative SPAs.
                </p>
            `;
      break;
    case "contact":
      contentDiv.innerHTML = `<h2>Contact Us</h2>
                <p>
                    Feel free to reach out to us!
                </p>
                <form>
                   <label for="name">Name:</label>
                   <input type="text" id="name" name="name"
                          placeholder="Your Name" required>
                   <label for="email">Email:</label>
                   <input type="email" id="email" name="email"
                          placeholder="Your Email" required>
                   <label for="message">Message:</label>
                   <textarea id="message" name="message"
                             placeholder="Your Message"
                             rows="4" required>
                    </textarea>
                   <button type="submit">Send Message</button>
                </form>`;
      break;

    default:
      contentDiv.innerHTML = "<h2>Page not found!</h2>";
  }
}

// Adding event listeners when the DOM content has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#home-link").addEventListener("click", (e) => {
    e.preventDefault();
    changeContent("home");
  });

  document.querySelector("#about-link").addEventListener("click", (e) => {
    e.preventDefault();
    changeContent("about");
  });
  document.querySelector("#chat-link").addEventListener("click", (e) => {
    e.preventDefault();
    var contentDiv = document.getElementById("content");
    contentDiv.innerHTML = chatPage();
    initChat();
  });

  document.querySelector("#contact-link").addEventListener("click", (e) => {
    e.preventDefault();
    changeContent("contact");
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
    changeContent("register");
  });
});
