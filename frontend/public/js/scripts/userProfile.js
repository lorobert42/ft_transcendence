import pageRouting from '../../changeContent.js'
import { getRefreshToken } from '../utils/loginHandler.js';
import { printMessage, printError } from '../utils/toastMessage.js';

export const userProfileModule = (() => {
  const setUserProfile = (user) => {
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;
    if (user.avatar != '')
      document.getElementById("avatar").src = "media/" + user.avatar;
  }

  const otpEnableRequest = (user, password) => {
    fetch("/api/user/otp/activation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'email': user.email, 'password': password }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then((data) => {
        console.log(data);
        if (Object.hasOwn(data, "success") && data.success === true) {
          history.pushState({}, '', '/enable-otp');
          pageRouting({ 'qr_code': data.qr_code });
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
  };

  const otpDisableRequest = (user, password, otp) => {
    fetch("/api/user/otp/disable/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ 'email': user.email, 'password': password, 'otp': otp }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then(async (data) => {
        console.log(data);
        if (Object.hasOwn(data, "success") && data.success === true) {
          printMessage('Two-Factor Authentication disabled');
          await getRefreshToken();
          history.pushState({}, '', '/profile');
          pageRouting();
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
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
