export const otpFormModule = (() => {
  const otpCheck = (data, otp) => {
    console.log("in otp check");
    let id;
    if (Object.hasOwn(data, "id")) {
      id = data.id;
      console.log('id: ' + id);
    }
    fetch("/api/user/otp/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'otp': otp, 'user_id': id }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then((data) => {
        console.log("data received");
        console.log(data);
        if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
          const successDiv = document.getElementById("loginSuccess");
          successDiv.textContent = "Login Successful.";
          successDiv.style.display = "block";
          localStorage.setItem("authToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
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

  const init = (data) => {
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("loginError");
        const successDiv = document.getElementById("loginSuccess");
        successDiv.style.display = "none"; // Make the error message visible
        errorMessageDiv.style.display = "none"; // Make the error message visible
        const otp = document.getElementById("otp").value;
        otpCheck(data, otp);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
