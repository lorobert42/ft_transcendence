import pageRouting from '../../changeContent.js'

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
          const successDiv = document.getElementById("loginSuccess");
          successDiv.textContent = "Login Successful.";
          successDiv.style.display = "block";
          localStorage.setItem("authToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          localStorage.setItem("user_id", data.user_id);
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
        var errorString = error;
        const errorMessageDiv = document.getElementById("loginError");
        errorMessageDiv.textContent = errorString;
        errorMessageDiv.style.display = "block"; // Make the error message visible
      });
  };

  const init = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("loginError");
        const successDiv = document.getElementById("loginSuccess");
        successDiv.style.display = "none"; // Make the error message visible
        errorMessageDiv.style.display = "none"; // Make the error message visible
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
