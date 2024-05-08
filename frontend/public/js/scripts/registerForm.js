import { createUser } from "../fetchers/usersFetcher.js";
import { getLang } from "../utils/getLang.js";
import { printError } from "../utils/toastMessage.js";


//name error: max 25 characters and no special characters
let langdict = JSON.parse(`{
	"FR": {
	  "emailError": "Veuillez entrer une adresse email valide",
	  "passwordError": "Le mot de passe doit contenir au moins 5 caractères, 1 lettre majuscule et 1 chiffre",
	  "nameError": "Le nom doit contenir au maximum 25 caractères (espaces et tirets autorisés)",
	  "matchPwd": "Les champs du mot de passe ne correspondent pas"
	},
	"EN": {
	  "emailError": "Please enter a valid email address",
	  "passwordError": "Password must contain at least 5 characters, 1 uppercase letter, and 1 number",
	  "nameError": "Name must contain at most 25 characters (spaces and hyphens allowed)",
	  "matchPwd": "Password fields do not match"
	},
	"PT": {
	  "emailError": "Por favor, insira um endereço de e-mail válido",
	  "passwordError": "A senha deve conter pelo menos 5 caracteres, 1 letra maiúscula e 1 número",
	  "nameError": "O nome deve conter no máximo 25 caracteres (espaços e hífens permitidos)",
	  "matchPwd": "Os campos de senha não correspondem"
	}
}`);

export const registerFormModule = (() => {
  const registerUser = async (formData, registerForumlar) => {
    localStorage.clear();
    if (formData.get("password") !== formData.get("password2")) {
		const lang = getLang();
		printError(langdict[lang]['matchPwd']);
		return;
	  }
    formData.delete("password2");

    if(!validatePassword(formData.get("password")))
      return;
    if(validateEmail(formData.get("email")) == false)
      return;
    if(validateName(formData.get("name")) == false)
      return;

      registerForumlar.reset();

    await createUser(formData);
  };

  const init = () => {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(registerForm);
        registerUser(formData, registerForm);
      });
    } else {
      console.error("register form not found at init time.");
    }
  };

  return { init };
})();

function validateEmail(email) {
  let regex = new RegExp("^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$");
  if (!regex.test(email)) {
    const lang = getLang();
    printError(langdict[lang]['emailError'], "error");
    return false;
  }
  return true;
}

function validatePassword(password) {
  let regex = new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{5,}$");
  if (!regex.test(password)) {
    const lang = getLang();
    printError(langdict[lang]['passwordError'], "error");
    return false;
  }
  return true;
}
function validateName(name) {
  let regex = new RegExp("^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{1,25}$", "u");
  if(!regex.test(name)) {
    const lang = getLang();
    printError(langdict[lang]['nameError'], "error");
    return false;
  }
}
