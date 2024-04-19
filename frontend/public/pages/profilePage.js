export default function profilePage() {

    //get language cookie and set it to EN if not set
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

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
                    <img id="avatar" src="placeholder.jpg" alt="User Avatar" style="width: 100px; height: 100px;">
                    <p class="py-4">${langdict[lang]['nameSpace']}<span id="userName">${langdict[lang]['nameLoad']}</span></p>
                    <p>${langdict[lang]['mailSpace']}<span id="userEmail">${langdict[lang]['mailLoad']}</span></p>
                </div>
                <div>
                    <button type="button" href="/profile" class="btn btn-primary" id="update-profile">Update Profile</button>
                </div>
            </div>
        </div>
        <div class="col-md-4 offset-md-4">
            <form id="otpForm">
                <div class="form-group text-center">
                    <h1>${langdict[lang]['enableOTP']}</h1>
                </div>
                <div class="form-group text-center">
                    <label for="password">${langdict[lang]['password']}</label>
                    <input type="password" class="form-control" id="password" placeholder="${langdict[lang]['passwordPlaceholder']}">
                </div>
                <div id="loginError" class="form-group text-center" style="display: none; color: red;"></div>
                <div class="form-group text-center">
                    <button type="submit" class="btn btn-primary">${langdict[lang]['otpSubmit']}</button>
                </div>
            </form>
        </div>
    </div>`;
}