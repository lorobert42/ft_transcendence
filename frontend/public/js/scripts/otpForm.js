import { checkOTP } from "../fetchers/mfaFetcher.js";

export const otpFormModule = (() => {
  const otpCheck = async (data, otp) => {
    let user_id;
    if (Object.hasOwn(data, "user_id")) {
      user_id = data.user_id;
    }
    await checkOTP(user_id, otp);
  };

  const init = (data) => {
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const otp = document.getElementById("otp").value;
        otpCheck(data, otp);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
