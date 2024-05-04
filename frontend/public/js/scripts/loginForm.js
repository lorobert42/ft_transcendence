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
      "Error": "Identifiant ou mot de passe incorrect"
    },
    "EN": {
      "Error": "Incorrect email or password"
    },
    "PT": {
      "Error": "E-mail ou senha incorretos"
    }
}`);

function validateEmail(email) {
  let regex = new RegExp("^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$");
  if (!regex.test(email)) {
    const lang = getLang();
    printError(langdict[lang]['Error'], "error");
    return false;
  }
  return true;
}


function validatePassword(password) {
  let regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{8,}$");
  if (!regex.test(password)) {
    const lang = getLang();
    printError(langdict[lang]['Error'], "error");
    return false;
  }
  return true;
}