import { printError, printSuccess } from "../utils/toastMessage.js";

export const registerFormModule = (() => {
  const registerUser = async (formData) => {
    localStorage.clear();
    if (formData.get("password") !== formData.get("password2")) {
      printError("Password fields do not match");
      return;
    }
    formData.delete("password2");
    let response = await fetch("/api/user/create/", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      printError(await response.text());
      return;
    }
    let data = await response.json();
    if (Object.hasOwn(data, "name") && Object.hasOwn(data,"email")) {
      printSuccess("Registration success");
    } else {
      printError("Registration error");
    }
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
