import { pageRouting, gData } from "../../changeContent.js";
import { printError, printSuccess } from "../utils/toastMessage.js";

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

  const init = () => {
    const otpForm = document.getElementById("otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const otp = document.getElementById("otp").value;
        otpCheck(gData, otp);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();
