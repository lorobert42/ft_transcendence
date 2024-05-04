import { getLang } from "../js/utils/getLang.js";

export default function otpPage() {
  const lang = getLang();

  let langdict = JSON.parse(`
  {
    "FR": {
      "otp": "Entrez votre OTP",
      "emailPlaceholder": "Entrez votre email",
      "password": "Mot de passe",
      "passwordPlaceholder": "Entrez votre mot de passe",
      "submit": "Envoyer"
    },
    "EN": {
      "otp": "Enter your OTP",
      "emailPlaceholder": "Enter your email",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "submit": "Submit"
    },
    "PT": {
      "otp": "Entrar OTP",
      "emailPlaceholder": "Insira seu email",
      "password": "Senha",
      "passwordPlaceholder": "Insira sua senha",
      "submit": "Entrar"
    }
}`);

  return `
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <form id="otpDisableForm">
          <div class="form-group text-center">
            <h1>${langdict[lang]['otp']}</h1>
          </div>
          <div class="form-group text-center">
            <label for="email">Email</label>
            <input type="email" class="form-control" autocomplete="email" id="email" placeholder="${langdict[lang]['emailPlaceholder']}">
          </div>
          <div class="form-group text-center">
              <label for="password">${langdict[lang]['password']}</label>
              <input type="password" autocomplete="password" class="form-control" id="password" placeholder="${langdict[lang]['passwordPlaceholder']}">
          </div>
          <div class="form-group text-center">
            <label for="otp">OTP</label>
            <input type="text" class="form-control" id="otp" placeholder="000000">
          </div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">${langdict[lang]['submit']}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
}