import { getRefreshToken } from "../fetchers/usersFetcher.js";
import { isTokenExpired } from "./tokenHandler.js";

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
