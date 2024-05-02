import { createUser } from "../fetchers/usersFetcher.js";
import { printError } from "../utils/toastMessage.js";

export const registerFormModule = (() => {
  const registerUser = async (formData) => {
    localStorage.clear();
    if (formData.get("password") !== formData.get("password2")) {
      printError("Password fields do not match");
      return;
    }
    formData.delete("password2");
    await createUser(formData);
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
