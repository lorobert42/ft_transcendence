import pageRouting from '../../changeContent.js'
import { printError, printSuccess } from '../utils/toastMessage.js';

export const loginFormModule = (() => {
  const loginUser = (email, password) => {
    fetch("/api/user/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then((data) => {
        if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
          printSuccess('Login Successful');
          localStorage.setItem("authToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          history.pushState({}, '','/home');
          pageRouting();
        } else if (Object.hasOwn(data, "success") && data.success === true) {
          history.pushState({}, '', '/otp');
          pageRouting({ 'id': data.user });
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
  };

  const init = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        loginUser(email, password);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
