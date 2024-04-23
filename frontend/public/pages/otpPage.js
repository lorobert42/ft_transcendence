export default function otpPage() {
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
          "submit": "Se connecter"
      },
      "EN": {
          "otp": "Enter your OTP",
          "submit": "Log in"
      },
      "PT": {
          "otp": "Entrar OTP",
          "submit": "Entrar"
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
