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
        <img id="qrCode" src="" class="img-fluid" alt="QR code">
        <p>${langdict[lang]['instructions']}</p>
        <form id="otpForm">
          <div class="form-group text-center">
            <h1>${langdict[lang]['otp']}</h1>
          </div>
          <div class="form-group text-center">
            <label for="otp">OTP</label>
            <input type="text" class="form-control" id="otp" placeholder="000000">
          </div>
          <div id="loginError" class="form-group text-center" style="display: none; color: red;"></div>
          <div id="loginSuccess" class="form-group text-center" style="display: none; color: black;"></div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">${langdict[lang]['submit']}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
}
