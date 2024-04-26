import pageRouting from "../../changeContent.js";
import { printError, printSuccess } from "../utils/toastMessage.js";

export const otpFormModule = (() => {
  const otpCheck = (data, otp) => {
    console.log("in otp check");
    let user_id;
    if (Object.hasOwn(data, "user_id")) {
      user_id = data.user_id;
      console.log('user_id: ' + user_id);
    }
    fetch("/api/user/otp/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'otp': otp, 'user_id': user_id }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        return response.json()
      })
      .then((data) => {
        if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
          printSuccess("Login Successful");
          localStorage.setItem("authToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
          history.pushState({}, '','/home');
          pageRouting();
        } else {
          throw new Error('Unable to process your request, please retry.');
        }
      })
      .catch((error) => {
        printError(error);
      });
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
