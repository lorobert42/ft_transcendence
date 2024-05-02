import { loginUser } from '../fetchers/usersFetcher.js';

export const loginFormModule = (() => {
  const init = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        await loginUser(email, password);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
