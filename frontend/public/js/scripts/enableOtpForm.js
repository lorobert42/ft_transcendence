export const enableOtpFormModule = (() => {
  const otpCheck = (id, otp) => {
    fetch("/api/user/otp/activation/confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'user_id': id, 'otp': otp }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid token');
        }
        return response.json()
      })
      .then((data) => {
        if (Object.hasOwn(data, "success") && data.success === true) {
          const successDiv = document.getElementById("loginSuccess");
          successDiv.textContent = "2FA enabled.";
          successDiv.style.display = "block";
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
    let src, id;
    if (Object.hasOwn(data, "qr_code") && Object.hasOwn(data, "id")) {
      src = data.qr_code;
      id = data.id;
    }
    const qr_code = document.getElementById("qrCode");
    qr_code.src = src;
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const errorMessageDiv = document.getElementById("loginError");
        const successDiv = document.getElementById("loginSuccess");
        successDiv.style.display = "none"; // Make the error message visible
        errorMessageDiv.style.display = "none"; // Make the error message visible
        const otp = document.getElementById("otp").value;
        otpCheck(id, otp);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
