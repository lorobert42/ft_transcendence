import { printError } from "./toastMessage.js";
import { isTokenExpired } from "./tokenHandler.js";

export async function getUserInfo() {
  return await fetch("/api/user/me/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  })
    .then(response => response.json())
    .then(data => data)
    .catch((error) => {
      printError(error);
    });
}

export function getRefreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken === null) {
    printError("unable to refresh data");
    return false;
  }
  return fetch("/api/user/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then(response => response.json())
    .then(data => {
      if (Object.hasOwn(data, "access")) {
        localStorage.setItem("authToken", data.access);
        return true;
      }
      return false;
    })
    .catch((error) => {
      printError(error);
    });
}

export async function isLoggedIn() {
  const authToken = localStorage.getItem('authToken');
  if (authToken !== null &&
    authToken !== undefined &&
    !isTokenExpired(authToken)
  ) {
    return true;
  }
  console.log('invalid access token, checking refresh token');
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken !== null &&
    refreshToken !== undefined &&
    !isTokenExpired(refreshToken)
  ) {
    return getRefreshToken();
  }
  console.log('invalid refresh token, not logged in');
  return false;
}
