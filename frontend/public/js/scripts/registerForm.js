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
        console.log("data received");
        console.log(data);
        if (Object.hasOwn(data, "id")) {
          const successDiv = document.getElementById("registerSuccess");
          successDiv.textContent = "Register Successful.";
          successDiv.style.display = "block";
        } else {
          var errorString = "Registration Error";

          for (const property in data) {
            console.log(`${property}: ${data[property]}`);
            errorString += `\n${property}: ${data[property]}`;
          }
          const errorMessageDiv = document.getElementById("registerError");
          errorMessageDiv.textContent = errorString;
          errorMessageDiv.style.display = "block"; // Make the error message visible
        }
        //   window.location.href = "/";
      })
      .catch((error) => {
        console.error("register error:", error);
        // Handle register error, e.g., show error message
      });
  };

  const init = () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("registerError");
        const successDiv = document.getElementById("registerSuccess");
        successDiv.style.display = "none"; // Make the error message visible
        errorMessageDiv.style.display = "none"; // Make the error message visible
        const formData = new FormData(registerForm);
        registerUser(formData);
      });
    } else {
      console.error("register form not found at init time.");
    }
  };

  return { init };
})();
