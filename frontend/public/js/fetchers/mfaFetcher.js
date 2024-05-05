import pageRouting, { dataSave } from "../../changeContent.js";
import { printError, printMessage, printSuccess } from "../utils/toastMessage.js";
import { getRefreshToken } from "./usersFetcher.js";
import { getLang } from "../utils/getLang.js";

export async function requestMfaActivation(email, password) {
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
        throw new Error(`${langdict[lang]["Invalidcredentials"]}`);
      }
      return response.json()
    })
    .then((data) => {
      if (Object.hasOwn(data, "success") && data.success === true) {
        dataSave.user_has_otp = true;
        history.pushState({}, '', '/enable-otp');
        pageRouting({ 'qr_code': data.qr_code });
      } else {
        throw new Error(`${langdict[lang]["Unable"]}`);
      }
    })
    .catch((error) => {
      printError(error);
    });
}

export async function confirmMfaActivation(id, otp) {
	const lang = getLang();

	let langdict = JSON.parse(`
	  {
		"FR": {
		  "Invalidtoken": "Token invalide",
		  "Successful": "Connexion réussie",
		  "Unable": "Impossible de traiter votre demande, veuillez réessayer."
		 },
		"EN": {
		  "Invalidtoken": "Invalid token",
		  "Successful": "Login Successful",
		  "Unable": "Unable to process your request, please retry."
		},
		"PT": {
		  "Invalidtoken": "Token inválido",
		  "Successful": "Login bem-sucedido",
		  "Unable": "Incapaz de processar sua solicitação, por favor, tente novamente."
		}
	}`);
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
        throw new Error(`${langdict[lang]["Invalidtoken"]}`);
      }
      return response.json()
    })
    .then((data) => data)
    .catch((error) => {
      printError(error);
    });
}

export async function disableMfa(email, password, otp) {
	const lang = getLang();

	let langdict = JSON.parse(`
	  {
		"FR": {
		  "Invalidcredentials": "Identifiants invalides",
		  "Successful": "Connexion réussie",
		  "diableauth": "Authentification à deux facteurs désactivée",
		  "Unable": "Impossible de traiter votre demande, veuillez réessayer."
		 },
		"EN": {
		  "Invalidcredentials": "Invalid credentials",
		  "Successful": "Login Successful",
		  "diableauth": "Two-Factor Authentication disabled",
		  "Unable": "Unable to process your request, please retry."
		},
		"PT": {
		  "Invalidcredentials": "Credenciais inválidas",
		  "Successful": "Login bem-sucedido",
		  "diableauth": "Autenticação em duas etapas desativada",
		  "Unable": "Incapaz de processar sua solicitação, por favor, tente novamente."
		}
	}`);
 return fetch("/api/mfa/disable/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 'email': email, 'password': password, 'otp': otp }),
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error(`${langdict[lang]["Invalidcredentials"]}`);
      }
      return response.json()
    })
    .then(async (data) => {
      if (Object.hasOwn(data, "success") && data.success === true) {
        printMessage(`${langdict[lang]["diableauth"]}`);
        dataSave.user_has_otp = false;
      } else {
        throw new Error(`${langdict[lang]["Unable"]}`);
      }
      return data;
    })
    .catch((error) => {
      printError(error);
    });
}

export async function checkOTP(id, otp) {
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
 return fetch("/api/mfa/check/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 'otp': otp, 'user_id': id }),
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error(`${langdict[lang]["Invalidcredentials"]}`);
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
        throw new Error(`${langdict[lang]["Unable"]}`);
      }
    })
    .catch((error) => {
      printError(error);
    });
}