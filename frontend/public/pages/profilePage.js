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
            "mailLoad": "Chargement..."
        },
        "EN": {
            "title": "Profile Page",
            "nameSpace": "Name: ",
            "mailSpace": "Email: ",
            "nameLoad": "Loading...",
            "mailLoad": "Loading..."
        },
        "PT": {
            "title": "Pagina de perfil",
            "nameSpace": "Nome: ",
            "mailSpace": "Email: ",
            "nameLoad": "Carregando...",
            "mailLoad": "Carregando..."
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
            </div>
        </div>
    </div>`;
}