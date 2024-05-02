import { getRefreshToken } from "../utils/loginHandler.js";
import { printError } from "../utils/toastMessage.js";

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
      .then(async (data) => {
        if (Object.hasOwn(data, "success") && data.success === true) {
          const form = document.getElementById("otpForm");
          form.classList.add("d-none");
          const backupList = document.getElementById("backupList");
          data.backup_codes.map((code) => {
            const backupCode = document.createElement("li");
            backupCode.innerText = code;
            backupCode.className = "list-group-item";
            backupList.appendChild(backupCode);
          });
          const backupDiv = document.getElementById("backup");
          backupDiv.classList.remove("d-none");
          await getRefreshToken();
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
  };

  const init = (data) => {
    let src;
    if (Object.hasOwn(data, "qr_code")) {
      src = data.qr_code;
    }
    const qr_code = document.getElementById("qrCode");
    qr_code.src = src;
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const otp = document.getElementById("otp").value;
        otpCheck(data.user.user_id, otp);
      });
    } else {
      console.error("OTP form not found at init time.");
    }
  };

  return { init };
})();
