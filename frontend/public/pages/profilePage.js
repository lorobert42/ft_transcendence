import { getLang } from "../js/utils/getLang.js";

export default function profilePage() {
  const lang = getLang();

  let langdict = JSON.parse(`{
    "FR": {
      "title": "Page de profil",
      "nameSpace": "Nom: ",
      "mailSpace": "Email: ",
      "nameLoad": "Chargement...",
      "mailLoad": "Chargement...",
      "enableOTP": "Activer 2FA",
      "password": "Mot de passe",
      "passwordPlaceholder": "Entrez votre mot de passe",
      "otpSubmit": "Activer"
    },
    "EN": {
      "title": "Profile Page",
      "nameSpace": "Name: ",
      "mailSpace": "Email: ",
      "nameLoad": "Loading...",
      "mailLoad": "Loading...",
      "enableOTP": "Enable 2FA",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "otpSubmit": "Enable"
    },
    "PT": {
      "title": "Pagina de perfil",
      "nameSpace": "Nome: ",
      "mailSpace": "Email: ",
      "nameLoad": "Carregando...",
      "mailLoad": "Carregando...",
      "enableOTP": "Ativar 2FA",
      "password": "Senha",
      "passwordPlaceholder": "Insira sua senha",
      "otpSubmit": "Ativar"
    }
  }`);

  return `
    <div class="container">
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <div id="profileContainer">
            <h1 class="text-centered text-nowrap">${langdict[lang]['title']}</h1>
            <img id="avatar" src="/media/user_avatars/default-avatar.png" alt="User Avatar" style="width: 100px; height: 100px;">
            <p class="py-4">${langdict[lang]['nameSpace']}<span id="userName">${langdict[lang]['nameLoad']}</span></p>
            <p>${langdict[lang]['mailSpace']}<span id="userEmail">${langdict[lang]['mailLoad']}</span></p>
          </div>
          <button type="button" href="/profile" class="btn btn-primary" id="update-profile">Update Profile</button>
        </div>
        </div>
      <div class="col-md-4 offset-md-4">
        <h2>Settings</h2>
        <h3>Two-Factor Authentication</h3>
        <div id="otpEnable" class="container-fluid d-none">
          <div class="d-grid gap-2">
            <button id="otpBtn" type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#otpForm">
              Enable 2FA
            </button>
          </div>
          <form id="otpForm" class="collapse">
            <div class="form-group text-center">
              <label for="otpEnablePassword">${langdict[lang]['password']}</label>
              <input type="password" class="form-control" id="otpEnablePassword" placeholder="${langdict[lang]['passwordPlaceholder']}">
            </div>
            <div class="form-group text-center">
              <button type="submit" class="btn btn-primary">${langdict[lang]['otpSubmit']}</button>
            </div>
          </form>
        </div>
        <div id="otpDisable" class="container-fluid d-none">
          <div class="d-grid gap-2">
            <button id="otpDisableBtn" type="button" class="btn btn-danger" data-bs-toggle="collapse" data-bs-target="#otpDisableForm">
              Disable 2FA
            </button>
          </div>
          <form id="otpDisableForm" class="collapse">
            <div class="form-group text-center">
              <label for="otpDisablePassword">${langdict[lang]['password']}</label>
              <input type="password" class="form-control" id="otpDisablePassword" placeholder="${langdict[lang]['passwordPlaceholder']}">
            </div>
            <div class="form-group text-center">
              <label for="otp">OTP</label>
              <input type="text" class="form-control" id="otp" placeholder="000000">
            </div>
            <div class="form-group text-center">
              <button type="submit" class="btn btn-primary">Disable</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
}
