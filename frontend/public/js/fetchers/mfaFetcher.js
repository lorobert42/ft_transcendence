import pageRouting from "../../changeContent.js";
import { printError, printMessage, printSuccess } from "../utils/toastMessage.js";
import { getRefreshToken } from "./usersFetcher.js";

export async function requestMfaActivation(email, password) {
  return fetch("/api/mfa/activation/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ 'password': password }),
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
}

export async function confirmMfaActivation(id, otp) {
  return fetch("/api/mfa/activation/confirm/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ 'otp': otp }),
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Invalid token');
      }
      return response.json()
    })
    .then((data) => data)
    .catch((error) => {
      printError(error);
    });
}

export async function disableMfa(email, password, otp) {
  fetch("/api/mfa/disable/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ 'password': password, 'otp': otp }),
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
}

export async function checkOTP(id, otp) {
  return fetch("/api/mfa/check/", {
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
        history.pushState({}, '', '/home');
        pageRouting();
      } else {
        throw new Error('Unable to process your request, please retry.');
      }
    })
    .catch((error) => {
      printError(error);
    });
}