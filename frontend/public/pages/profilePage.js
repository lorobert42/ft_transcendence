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
      "disableOTP": "Enlever 2FA",
      "password": "Mot de passe",
      "passwordPlaceholder": "Entrez votre mot de passe",
      "enableOTPSubmit": "Activer",
      "disableOTPSubmit": "Enlever"
    },
    "EN": {
      "title": "Profile Page",
      "nameSpace": "Name: ",
      "mailSpace": "Email: ",
      "nameLoad": "Loading...",
      "mailLoad": "Loading...",
      "enableOTP": "Enable 2FA",
      "disableOTP": "Remove 2FA",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "enableOTPSubmit": "Enable",
      "disableOTPSubmit": "Remove"
    },
    "PT": {
      "title": "Pagina de perfil",
      "nameSpace": "Nome: ",
      "mailSpace": "Email: ",
      "nameLoad": "Carregando...",
      "mailLoad": "Carregando...",
      "enableOTP": "Ativar 2FA",
      "disableOTP": "TODO",
      "password": "Senha",
      "passwordPlaceholder": "Insira sua senha",
      "enableOTPSubmit": "Ativar",
      "disableOTPSubmit": "TODO"
    }
  }`);

  return `
    <div class="container">
      <div class="row">
        <div class="col-sm text-center">
          <div id="profileContainer">
            <h1 class="text-centered text-nowrap">${langdict[lang]['title']}</h1>
            <img id="avatar" src="/media/user_avatars/default-avatar.png" alt="User Avatar" style="width: 100px; height: 100px;">
            <p class="py-4">${langdict[lang]['nameSpace']}<span id="userName">${langdict[lang]['nameLoad']}</span></p>
            <p>${langdict[lang]['mailSpace']}<span id="userEmail">${langdict[lang]['mailLoad']}</span></p>
          </div>
          <button type="button" href="/profile" class="btn btn-primary" id="update-profile">Update Profile</button>
          <h3>Two-Factor Authentication</h3>
          <div id="otpEnable" class="container-fluid d-none">
            <div class="d-grid gap-2">
              <button id="otpBtn" type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#otpForm">
                ${langdict[lang]['enableOTP']}
              </button>
            </div>
            <form id="otpForm" class="collapse">
              <div class="form-group text-center">
                <label for="otpEnablePassword">${langdict[lang]['password']}</label>
                <input type="password" class="form-control" id="otpEnablePassword" placeholder="${langdict[lang]['passwordPlaceholder']}">
              </div>
              <div class="form-group text-center">
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">${langdict[lang]['enableOTPSubmit']}</button>
                </div>
              </div>
            </form>
          </div>
          <div id="otpDisable" class="container-fluid d-none">
            <div class="d-grid gap-2">
              <button id="otpDisableBtn" type="button" class="btn btn-danger" data-bs-toggle="collapse" data-bs-target="#otpDisableForm">
                ${langdict[lang]['disableOTP']}
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
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary">${langdict[lang]['disableOTPSubmit']}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-sm text-center">
          <div>
            <h2>Stats</h2>
            <div class="container">
              <div class="row">
                <div class="col">
                  <h3>Wins</h3>
                  <p id="wins">0</p>
                </div>
                <div class="col">
                  <h3>Losses</h3>
                  <p id="losses">0</p>
                </div>
                <div class="col">
                  <h3>Played</h3>
                  <p id="played">0</p>
              </div>
          </div>
          <div>
            <h2>History</h2>
            <input type="text" id="historySearch" class="form-control" placeholder="Search by adversary name...">
            <div class="mt-3" style="max-height: 400px; overflow-y: scroll;">
                <ul id="historyList" class="list-group"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // return `
  //   <div class="container">
  //     <div class="row">
  //       <div class="col-md-4 offset-md-4">
  //         <div id="profileContainer">
  //           <h1 class="text-centered text-nowrap">${langdict[lang]['title']}</h1>
  //           <img id="avatar" src="/media/user_avatars/default-avatar.png" alt="User Avatar" style="width: 100px; height: 100px;">
  //           <p class="py-4">${langdict[lang]['nameSpace']}<span id="userName">${langdict[lang]['nameLoad']}</span></p>
  //           <p>${langdict[lang]['mailSpace']}<span id="userEmail">${langdict[lang]['mailLoad']}</span></p>
  //         </div>
  //         <button type="button" href="/profile" class="btn btn-primary" id="update-profile">Update Profile</button>
  //       </div>
  //       <div class="col-md-4 offset-md-4">
  //         <h2>Settings</h2>
  //         <h3>Two-Factor Authentication</h3>
  //         <div id="otpEnable" class="container-fluid d-none">
  //           <div class="d-grid gap-2">
  //             <button id="otpBtn" type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#otpForm">
  //               Enable 2FA
  //             </button>
  //           </div>
  //         <form id="otpForm" class="collapse">
  //         <div class="form-group text-center">
  //           <label for="otpEnablePassword">${langdict[lang]['password']}</label>
  //           <input type="password" class="form-control" id="otpEnablePassword" placeholder="${langdict[lang]['passwordPlaceholder']}">
  //         </div>
  //         <div class="form-group text-center">
  //           <button type="submit" class="btn btn-primary">${langdict[lang]['otpSubmit']}</button>
  //         </div>
  //         </form>
  //         <div id="otpDisable" class="container-fluid d-none">
  //           <div class="d-grid gap-2">
  //             <button id="otpDisableBtn" type="button" class="btn btn-danger" data-bs-toggle="collapse" data-bs-target="#otpDisableForm">
  //               Disable 2FA
  //             </button>
  //           </div>
  //           <form id="otpDisableForm" class="collapse">
  //           <div class="form-group text-center">
  //             <label for="otpDisablePassword">${langdict[lang]['password']}</label>
  //             <input type="password" class="form-control" id="otpDisablePassword" placeholder="${langdict[lang]['passwordPlaceholder']}">
  //           </div>
  //           <div class="form-group text-center">
  //             <label for="otp">OTP</label>
  //             <input type="text" class="form-control" id="otp" placeholder="000000">
  //           </div>
  //           <div class="form-group text-center">
  //             <button type="submit" class="btn btn-primary">Disable</button>
  //           </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </div>`;
}
