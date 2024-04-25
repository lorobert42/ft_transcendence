import { getLang } from "../js/utils/getLang.js";

export default function registerPage() {
  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "registerTitle": "Inscription",
        "email": "Email",
        "emailPlaceholder": "Entrez votre email",
        "nameTitle": "Nom",
        "namePlaceholder": "Entrez votre nom",
        "avatarTitle": "Avatar",
        "passwordPlaceholder": "Entrez votre mot de passe",
        "registerBtn": "S'inscrire",
        "loginBtn": "Déjà un compte? Connectez-vous!"
      },
      "EN": {
        "registerTitle": "Register",
        "email": "Email",
        "emailPlaceholder": "Enter your email",
        "nameTitle": "Name",
        "namePlaceholder": "Enter your name",
        "avatarTitle": "Avatar",
        "passwordPlaceholder": "Enter your password",
        "registerBtn": "Register",
        "loginBtn": "Already have an account? Login!"
      },
      "PT": {
        "registerTitle": "Registro",
        "email": "Email",
        "emailPlaceholder": "Insira seu email",
        "nameTitle": "Nome",
        "namePlaceholder": "Insira seu nome",
        "avatarTitle": "Avatar",
        "passwordPlaceholder": "Insira sua senha",
        "registerBtn": "Registro",
        "loginBtn": "Já tem uma conta? Conecte-se!"
      }
    }`);

  return `
    <div class="container">
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <form id="registerForm" enctype="multipart/form-data">
            <div class="form-group
            text-center">
              <h1>${langdict[lang]['registerTitle']}</h1>
            </div>
            <div class="form-group
            text-center">
              <label for="email">${langdict[lang]['email']}</label>
              <input type="email" autocomplete="email" class="form-control" id="email"  name="email" placeholder="${langdict[lang]['emailPlaceholder']}">
            </div>
            <div class="form-group
            text-center">
              <label for="name">${langdict[lang]['nameTitle']}</label>
              <input type="text" class="form-control" autocomplete="username" id="name" name="name" placeholder="${langdict[lang]['namePlaceholder']}">
            </div>
            <div class="form-group
            text-center">
              <label for="avatar">${langdict[lang]['avatarTitle']}:</label>
              <input type="file" id="avatar" name="avatar" name="avatar" accept="image/*"><br><br>
            </div>
            <div class="form-group
            text-center">
              <label for="password">${langdict[lang]['passwordPlaceholder']}</label>
              <input type="password" autocomplete="current-password" class="form-control" id="password" name="password" placeholder="${langdict[lang]['passwordPlaceholder']}">
            </div>
            <div class="form-group
            text-center">
              <button type="submit" class="btn btn-primary">${langdict[lang]['registerBtn']}</button>
            </div>
          </form>
          <div class="form-group
          text-center">
            <a href="/login">${langdict[lang]['loginBtn']}</a>
          </div>
        </div>
      </div>
    </div>`;
}
