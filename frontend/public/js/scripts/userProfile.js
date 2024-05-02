import pageRouting from '../../changeContent.js'
import { disableMfa, requestMfaActivation } from '../fetchers/mfaFetcher.js';

export const userProfileModule = (() => {
  const setUserProfile = (user) => {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    if (user.avatar != '')
      document.getElementById("avatar").src = "media/" + user.avatar;
  }

  const otpEnableRequest = async (user, password) => {
    await requestMfaActivation(user.email, password);
  };

  const otpDisableRequest = async (user, password, otp) => {
    await disableMfa(user.email, password, otp);
  };

  const showOtpOption = (user) => {
    const otpEnable = document.getElementById("otpEnable");
    otpEnable.classList.add("d-none");
    const otpDisable = document.getElementById("otpDisable");
    otpDisable.classList.add("d-none");
    if (user.otp_enabled === false) {
      otpEnable.classList.remove("d-none");
      const otpForm = document.getElementById("otpForm");
      if (otpForm) {
        otpForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("otpEnablePassword").value;
          otpEnableRequest(user, password);
        });
      } else {
        console.error("Login form not found at init time.");
      }
    } else {
      otpDisable.classList.remove("d-none");
      const otpDisableForm = document.getElementById("otpDisableForm");
      if (otpDisableForm) {
        otpDisableForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const password = document.getElementById("otpDisablePassword").value;
          const otp = document.getElementById("otp").value;
          otpDisableRequest(user, password, otp);
        });
      } else {
        console.error("Login form not found at init time.");
      }
    }
  };

  const init = (data) => {
    const updateButton = document.getElementById("update-profile");
    updateButton.addEventListener("click", function (event) {
      event.preventDefault();
      history.pushState({}, '', '/update');
      pageRouting();
    });
    setUserProfile(data.user);
    showOtpOption(data.user);
  };

  return { init };
})();
