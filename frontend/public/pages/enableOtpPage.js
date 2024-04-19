export default function enableOtpPage() {
  //get language cookie and set it to EN if not set
  const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
  let lang = "EN";
  if (cookie) {
    lang = cookie.split("=")[1];
  }

  let langdict = JSON.parse(`
  {
    "FR": {
      "otp": "Entrez votre OTP",
      "submit": "Se connecter",
      "instructions": "Scannez le QR-code avec votre application d'authentification puis entrez le code généré ci-dessous"
    },
    "EN": {
      "otp": "Enter your OTP",
      "submit": "Log in",
      "instructions": "Scan the QR-code with your favorite authenticator app then put the generated code below"
    },
    "PT": {
      "otp": "Entrar",
      "submit": "Entrar"
    }
}`);

return `
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <form id="otpForm">
          <img id="qrCode" src="" class="img-fluid" alt="QR code">
          <p>${langdict[lang]['instructions']}</p>
          <div class="form-group text-center">
            <h1>${langdict[lang]['otp']}</h1>
          </div>
          <div class="form-group text-center">
            <label for="otp">OTP</label>
            <input type="text" class="form-control" id="otp" placeholder="000000">
          </div>
          <div id="loginError" class="form-group text-center" style="display: none; color: red;"></div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">${langdict[lang]['submit']}</button>
          </div>
        </form>
        <div id="backup" class="text-center" style="display: none">
          <h1>Activation Succesful</h1>
          <p class="text-start">Two-Factor Authentiication is now enabled for your account.
            To avoid your account being locked in case of loss of your phone, please save these backup codes.
          </p>
          <ul id="backupList" class="list-group">
          </ul>
        </div>
      </div>
    </div>
  </div>
  `;
}
