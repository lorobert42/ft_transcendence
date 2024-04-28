import { getLang } from "../js/utils/getLang.js";

export default function updatePage() {
  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "title": "Mise à Jour de l'Utilisateur",
        "nameSpace": "Nom: ",
        "mailSpace": "Email: ",
        "enterName": "Entrez votre Nom ",
        "enterMail": "Entrez votre Email ",
        "enterAvatar": "Entrez l'Url de votre Avatar ",
        "password": "Mot de Passe",
        "passwordPlaceholder": "Entrez votre mot de passe",
        "profileButton": "Mettre à Jour"
      },
      "EN": {
        "title": "User Status Update",
        "nameSpace": "Name: ",
        "mailSpace": "Email: ",
        "enterName": "Enter your Name",
        "enterMail": "Enter your Email",
        "enterAvatar": "Enter your Avatar Url",
        "password": "Password",
        "passwordPlaceholder": "Enter your password",
        "profileButton": "Update"
      },
      "PT": {
        "title": "Atualização do estado do utilizador",
        "nameSpace": "Nome: ",
        "mailSpace": "Email: ",
        "enterName": "Introduza o seu nome ",
        "enterMail": "Introduza o seu e-mail ",
        "enterAvatar": "Introduzir o URL do teu Avatar ",
        "password": "Palavra-passe",
        "passwordPlaceholder": "Introduza a sua palavra-passe",
        "profileButton": "Atualizar"
      }
    }`);

  return `
    <div class="row justify-content-center"> 
      <div class="col">
        <h1>${langdict[lang]['title']}</h1>
      </div>
    </div>
    <form id="updateForm">
      <div class="form-group">
        <label for="email">${langdict[lang]['mailSpace']}</label>
        <input type="email" class="form-control" id="email" placeholder="${langdict[lang]['enterMail']}">
      </div>
      <div class="form-group">
        <label for="name">${langdict[lang]['nameSpace']}</label>
        <input type="text" class="form-control" id="name" placeholder="${langdict[lang]['enterName']}">
      </div>
      <div class="form-group">
        <label for="avatar">Avatar</label>
        <input type="file" class="form-control-file" id="avatar" placeholder="${langdict[lang]['enterAvatar']}">
      </div>
      <div class="form-group">
        <label for="password">${langdict[lang]['password']}</label>
        <input type="password" class="form-control" id="password" placeholder="${langdict[lang]['passwordPlaceholder']}">
      </div>
      <button type="sumbit" class="btn btn-primary">${langdict[lang]['profileButton']}</button>
    </form>`;
}