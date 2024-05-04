import { getLang } from "../js/utils/getLang.js";

export default function loginPage() {
      const lang = getLang();

  let langdict = JSON.parse(`
    {
        "FR": {
            "login": "Connexion",
            "emailPlaceholder": "Entrez votre email",
            "password": "Mot de passe",
            "passwordPlaceholder": "Entrez votre mot de passe",
            "log": "Se connecter",
            "register": "Pas de compte? Inscrivez-vous!"
        },
        "EN": {
            "login": "Login",
            "emailPlaceholder": "Enter your email",
            "password": "Password",
            "passwordPlaceholder": "Enter your password",
            "log": "Log in",
            "register": "No account? Register!"
        },
        "PT": {
            "login": "Entrar",
            "emailPlaceholder": "Insira seu email",
            "password": "Senha",
            "passwordPlaceholder": "Insira sua senha",
            "log": "Entrar",
            "register": "Sem conta? Registre-se!"
        }
}`);

  return `
    <div class="container">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <form id="loginForm">
                    <div class="form-group text-center">
                        <h1>${langdict[lang]['login']}</h1>
                    </div>
                    <div class="form-group text-center">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" autocomplete="email" id="email" placeholder="${langdict[lang]['emailPlaceholder']}" required>
                    </div>
                    <div class="form-group text-center">
                        <label for="password">${langdict[lang]['password']}</label>
                        <input type="password" autocomplete="current-password" class="form-control" id="password" placeholder="${langdict[lang]['passwordPlaceholder']}" required>
                    </div>
                    <div class="form-group text-center">
                        <button type="submit" class="btn btn-primary">${langdict[lang]['log']}</button>
                    </div>
                </form>
                <div class="form-group text-center">
                    <a href="/register">${langdict[lang]['register']}</a>
                </div>
            </div>
        </div>
    </div>


    `;
}
