import { printError, printSuccess } from "../utils/toastMessage.js";

export const registerFormModule = (() => {
  const registerUser = (formData) => {
    console.log("in register user");
    localStorage.removeItem("authToken");
    fetch("/api/user/create/", {
      method: "POST",

      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (Object.hasOwn(data, "name") && Object.hasOwn(data,"email")) {
          printSuccess("Registration success");
        } else {
          printError("Registration error");
        }
      })
      .catch((error) => {
        printError(error);
      });
  };

  const init = () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(registerForm);
        registerUser(formData);
      });
    } else {
      console.error("register form not found at init time.");
    }
  };

  return { init };
})();
