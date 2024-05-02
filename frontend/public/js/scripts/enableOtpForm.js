import { confirmMfaActivation } from "../fetchers/mfaFetcher.js";
import { getRefreshToken } from "../fetchers/usersFetcher.js";
import { printError } from "../utils/toastMessage.js";

export const enableOtpFormModule = (() => {
  const otpCheck = async (id, otp) => {
    let data = await confirmMfaActivation(id, otp);
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
      printError('Unable to process your request, please retry.');
    }
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
