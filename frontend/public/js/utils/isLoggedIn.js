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
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken !== null &&
    refreshToken !== undefined &&
    !isTokenExpired(refreshToken)
  ) {
    return getRefreshToken();
  }
  return false;
}
