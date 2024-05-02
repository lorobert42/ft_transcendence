import { printMessage, printError, printSuccess } from '../utils/toastMessage.js'
import pageRouting from '../../changeContent.js'

export async function getUsers() {
  return await fetch("/api/user/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then((data) => data)
    .catch((error) => {
      printError(error);
    });
}

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

export async function createUser(formData) {
  fetch("/api/user/", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then(async () => {
    printSuccess("Registration successful");
  }).catch((error) => {
    printError(error);
  });
}

export async function loginUser(email, password) {
  fetch("/api/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (response.status === 401) {
      throw new Error('Invalid credentials');
    }
    return response.json()
  }).then((data) => {
    if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
      printSuccess('Login Successful');
      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      history.pushState({}, '', '/home');
      pageRouting();
    } else if (Object.hasOwn(data, "success") && data.success === true) {
      history.pushState({}, '', '/otp');
      pageRouting({ 'user_id': data.user });
    } else {
      throw new Error('Unable to process your request, please retry.');
    }
  }).catch((error) => {
    printError(error);
  });
}

export async function editUser(formData) {
  fetch("/api/user/me/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    return response.json();
  }).then(async () => {
    printMessage("Update successful");
    await getRefreshToken();
    history.pushState({}, '', '/profile');
    pageRouting();
  }).catch((error) => {
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
