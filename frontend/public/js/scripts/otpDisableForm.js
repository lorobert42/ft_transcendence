import pageRouting from "../../changeContent.js";
import { disableMfa } from "../fetchers/mfaFetcher.js";

export const otpDisableModule = (() => {
  const otpDisableRequest = async (email, password, otp) => {
    await disableMfa(email, password, otp);
    history.pushState({}, '', '/login');
    pageRouting();
  };

  const init = (data) => {
    const otpDisableForm = document.getElementById("otpDisableForm");
    if (otpDisableForm) {
      otpDisableForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const otp = document.getElementById("otp").value;
        otpDisableRequest(email, password, otp);
      });
    } else {
      console.error("Disable form not found at init time.");
    }
  };

  return { init };
})();