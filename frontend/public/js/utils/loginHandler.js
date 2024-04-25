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
    const isLogged = authToken !== null &&
        authToken !== undefined &&
        !isTokenExpired(authToken);
    if (isLogged) {
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
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                // Handle login error, e.g., show error message
            });
    }
    console.log('invalid refresh token, not logged in');
    return false;
}

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(payload);
}

function isTokenExpired(token) {
    const decodedToken = decodeJWT(token);
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return expirationTime <= currentTime - 30;
}

