import { printError } from "./toastMessage.js";
import { isTokenExpired } from "./tokenHandler.js";

export async function getUserInfo() {
    let response = await fetch("/api/user/me/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
    });
    if (!response.ok) {
        throw new Error(response.text());
    }
    let data = await response.json();
    return data;
}

export function isLoggedIn() {
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
    console.log('invalid refresh token, not logged in');
    return false;
}
