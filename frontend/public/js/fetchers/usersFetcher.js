import { printMessage, printError, printSuccess } from '../utils/toastMessage.js'
import pageRouting from '../../changeContent.js'
import { getLang } from "../utils/getLang.js";
import { decodeJWT } from '../utils/tokenHandler.js';

export async function getUsers() {
  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "Unauthorized": "Non autorisé"
      },
      "EN": {
        "Unauthorized": "Unauthorized"
      },
      "PT": {
        "Unauthorized": "Não autorizado"
      }
  }`);
  return await fetch("/api/users/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error(`${langdict[lang]["Unauthorized"]}`);
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
  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "Unauthorized": "Non autorisé",
        "successful": "Enregistrement réussi"
      },
      "EN": {
        "Unauthorized": "Unauthorized",
        "successful": "Registration successful"
      },
      "PT": {
        "Unauthorized": "Não autorizado",
        "successful": "Registro bem-sucedido"
      }
  }`);
 fetch("/api/users/", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`${langdict[lang]["Unauthorized"]}`);
    }
    return response.json();
  }).then(async () => {
    printSuccess(`${langdict[lang]["successful"]}`);
  }).catch((error) => {
    printError(error);
  });
}

export async function loginUser(email, password) {
  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "Invalidcredentials": "Identifiants invalides",
        "Successful": "Connexion réussie",
        "Unable": "Impossible de traiter votre demande, veuillez réessayer."
       },
      "EN": {
        "Invalidcredentials": "Invalid credentials",
        "Successful": "Login Successful",
        "Unable": "Unable to process your request, please retry."
      },
      "PT": {
        "Invalidcredentials": "Credenciais inválidas",
        "Successful": "Login bem-sucedido",
        "Unable": "Incapaz de processar sua solicitação, por favor, tente novamente."
      }
  }`);
 fetch("/api/users/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (response.status === 401) {
      throw new Error(`${langdict[lang]["Invalidcredentials"]}`);
    }
    return response.json()
  }).then((data) => {
    if (Object.hasOwn(data, "access") && Object.hasOwn(data, "refresh")) {
      printSuccess(`${langdict[lang]["Successful"]}`);
      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      history.pushState({}, '', '/home');
      pageRouting();
    } else if (Object.hasOwn(data, "success") && data.success === true) {
      history.pushState({}, '', '/otp');
      pageRouting({ 'user_id': data.user });
    } else {
      throw new Error(`${langdict[lang]["Unable"]}`);
    }
  }).catch((error) => {
    printError(error);
  });
}

export async function editUser(formData) {
	const lang = getLang();

	let langdict = JSON.parse(`
	  {
		"FR": {
			"succupdate": "Mise à jour réussie",
			"errupdate": "Impossible de mettre à jour"
				 },
		"EN": {
			"succupdate": "Update successful",
			"errupdate": "Cannot update"
		},
		"PT": {
			"succupdate": "Atualização bem-sucedida",
			"errupdate": "Não é possível atualizar"
				}
	}`);
   fetch("/api/users/me/", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`${langdict[lang]["errupdate"]}`);
    }
    return response.json();
  }).then(async () => {
    printMessage(`${langdict[lang]["succupdate"]}`);
    await getRefreshToken();
    history.pushState({}, '', '/profile');
    pageRouting();
  }).catch((error) => {
    printError(error);
  });
}

export async function getRefreshToken() {
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
