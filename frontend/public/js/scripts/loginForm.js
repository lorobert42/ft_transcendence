import { loginUser } from '../fetchers/usersFetcher.js';
import { getLang } from '../utils/getLang.js';
import { printError } from '../utils/toastMessage.js';

export const loginFormModule = (() => {
  const init = () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if(!validatePassword(password))
          return;
        if(validateEmail(email) == false)
          return;
        await loginUser(email, password);
      });
    } else {
      console.error("Login form not found at init time.");
    }
  };

  return { init };
})();

let langdict = JSON.parse(`{
    "FR": {
      "emailError": "Veuillez entrer une adresse email valide",
      "passwordError": "Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule et 1 chiffre"
    },
    "EN": {
      "emailError": "Please enter a valid email address",
      "passwordError": "Password must contain at least 8 characters, 1 uppercase letter, and 1 number"
    },
    "PT": {
      "emailError": "Por favor, insira um endereço de e-mail válido",
      "passwordError": "A senha deve conter pelo menos 8 caracteres, 1 letra maiúscula e 1 número"
    }
}`);

function validateEmail(email) {
  //make a regex that checks that the email is valid
  let regex = new RegExp("^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$");
  if (!regex.test(email)) {
    const lang = getLang();
    printError(langdict[lang]['emailError'], "error");
    return false;
  }
  return true;
}


function validatePassword(password) {
  let regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{8,}$");
  if (!regex.test(password)) {
    const lang = getLang();
    printError(langdict[lang]['passwordEmail'], "error");
    return false;
  }
  return true;
}