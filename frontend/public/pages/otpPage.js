import { getLang } from "../js/utils/getLang.js";

export default function otpPage() {
  const lang = getLang();

  let langdict = JSON.parse(`
  {
    "FR": {
      "otp": "Entrez votre OTP",
      "submit": "Se connecter",
      "disable": "Utiliser un code de secours"
    },
    "EN": {
      "otp": "Enter your OTP",
      "submit": "Log in",
      "disable": "Use a backup code"
    },
    "PT": {
      "otp": "Entrar OTP",
      "submit": "Entrar",
      "disable": "Utilizar um código de reserva"
    }
}`);

  return `
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <form id="otpForm">
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
        <div class="form-group text-center">
          <a href="/disable-otp">${langdict[lang]['disable']}</a>
        </div>
      </div>
    </div>
  </div>
  `;
}
