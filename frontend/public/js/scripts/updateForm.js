import { editUser } from "../fetchers/usersFetcher.js";
import { getLang } from "../utils/getLang.js";
import { printError } from "../utils/toastMessage.js";

export function updateForm() {
  const form = document.getElementById("updateForm");

  async function updateUser() {
    const formData = new FormData();
    const fileInput = document.getElementById("avatar");
    if (fileInput.files[0]) {
      formData.append("avatar", fileInput.files[0]);
    }
    const email = document.getElementById("email").value;
    if (email) {
      formData.append("email", email);
    }
    const name = document.getElementById("name").value;
    if (name) {
      formData.append("name", name);
    }
    const password = document.getElementById("password").value;
    if (password) {
      formData.append("password", password);
    }

    if((email != "" && !validateEmail(email)) ||
    (password != "" && !validatePassword(password)) ||
    (name != "" && !validateName(name)) ||
    (fileInput.files[0] && !validateFile()))
    {
      return;
    }



    await editUser(formData);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateUser();
  });
}

let langdict = JSON.parse(`{
  "FR": {
    "emailError": "Veuillez entrer une adresse email valide",
    "passwordError": "Le mot de passe doit contenir au moins 8 caractères, 1 lettre majuscule et 1 chiffre",
    "nameError": "Le nom doit contenir au maximum 25 caractères et aucun caractère spécial",
    "fileError": "Le fichier doit être une image .png ou .jpg"
  },
  "EN": {
    "emailError": "Please enter a valid email address",
    "passwordError": "Password must contain at least 8 characters, 1 uppercase letter, and 1 number",
    "nameError": "Name must contain at most 25 characters and no special characters",
    "fileError": "File must be an image .png or .jpg"
  },
  "PT": {
    "emailError": "Por favor, insira um endereço de e-mail válido",
    "passwordError": "A senha deve conter pelo menos 8 caracteres, 1 letra maiúscula e 1 número",
    "nameError": "O nome deve conter no máximo 25 caracteres e nenhum caractere especial",
    "fileError": "O arquivo deve ser uma imagem .png ou .jpg"
  }
}`);

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
    const lang = getLang ();
    printError(langdict[lang]['passwordError'], "error");
    return false;
  }
  return true;
}
function validateName(name) {
  console.log(name);
  let regex = new RegExp("^[1-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{1,25}$", "u");
  if(!regex.test(name)) {
    const lang = getLang();
    printError(langdict[lang]['nameError'], "error");
    return false;
  }
  return true;
}

function validateFile(){
  let file = document.getElementById("avatar").value;
  console.log(file);
  if(!file.endsWith(".png") && !file.endsWith(".jpg")){
    const lang = getLang();
    printError(langdict[lang]['fileError'], "error");
    return false;
  }
  return true;
}