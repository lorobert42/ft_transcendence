import { printMessage, printError, printSuccess } from '../utils/toastMessage.js'
import pageRouting from '../../changeContent.js'

export async function getUsers() {
  return await fetch("/api/users/", {
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
  return await fetch("/api/users/me/", {
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
  fetch("/api/users/", {
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
  fetch("/api/users/login/", {
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
  fetch("/api/users/me/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Cannot update");
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
    localStorage.clear();
    return false;
  }
  return fetch("/api/users/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to stay logged in.");
      }
      return response.json()
    })
    .then(data => {
      if (Object.hasOwn(data, "access")) {
        localStorage.setItem("authToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        return true;
      }
      localStorage.clear();
      return false;
    })
    .catch((error) => {
      localStorage.clear();
      printError(error);
    });
}
