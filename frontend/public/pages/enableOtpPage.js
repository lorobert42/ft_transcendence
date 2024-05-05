import { getLang } from "../js/utils/getLang.js";

export default function enableOtpPage() {
  const lang = getLang();

  let langdict = JSON.parse(`
  {
    "FR": {
      "otp": "Entrez votre OTP",
	  "submit": "Se connecter",
	  "activationSuccess": "Activation réussie",
	  "text1": "L'authentification à deux facteurs est désormais activée pour votre compte",
	  "text2": "Pour éviter que votre compte ne soit verrouillé en cas de perte de votre téléphone, veuillez sauvegarder ces codes de secours",		
	  "instructions": "Scannez le QR-code avec votre application d'authentification puis entrez le code généré ci-dessous"
    },
    "EN": {
      "otp": "Enter your OTP",
      "submit": "Log in",
	  "activationSuccess": "Activation Succesful",
	  "text1": "Two-Factor Authentiication is now enabled for your account",
	  "text2": "To avoid your account being locked in case of loss of your phone, please save these backup codes",
	  "instructions": "Scan the QR-code with your favorite authenticator app then put the generated code below"
    },
    "PT": {
      "otp": "Entrar",
      "submit": "Entrar",
	  "activationSuccess": "Ativação bem-sucedida",
	  "text1": "A autenticação de dois fatores está agora ativada para a sua conta",
	  "text2": "Para evitar que sua conta seja bloqueada em caso de perda do seu telefone, por favor, salve estes códigos de backup",
	  "instructions": "Escanee o QR-code com o seu aplicativo de autenticação e, em seguida, insira o código gerado abaixo"
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
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">${langdict[lang]['submit']}</button>
          </div>
        </form>
        <div id="backup" class="text-center d-none">
          <h1>${langdict[lang]['activationSuccess']}</h1>
          <p class="text-start">${langdict[lang]['text1']}.
		  ${langdict[lang]['text2']}.
          </p>
          <ul id="backupList" class="list-group">
          </ul>
        </div>
      </div>
    </div>
  </div>
  `;
}
