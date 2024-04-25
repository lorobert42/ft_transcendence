import { getLang } from "../js/utils/getLang.js";

export default function contacts() {
    const lang = getLang();

    let langdict = JSON.parse(`{
        "FR": {
            "title1": "Invitation en attente",
            "title2": "Ajouter un ami",
            "title3": "Liste d'amis",
            "search": "Rechercher un ami...",
            "add": "Ajouter",
            "remove": "Supprimer",
            "pending": "En attente"
        },
        "EN": {
            "title1": "Pending Invites",
            "title2": "Add Friend",
            "title3": "Friend List",
            "search": "Search User...",
            "add": "Add",
            "remove": "Remove",
            "pending": "Pending"
        },
        "PT": {
            "title1": "Convites pendentes",
            "title2": "Adicionar amigo",
            "title3": "Lista de amigos",
            "search": "Procurar utilizador...",
            "add": "Adicionar",
            "remove": "Remover",
            "pending": "Pendente"
        }
    }`);

	return `
    <div class="container mt-5">
    <div class="row">
      <div class="col-md-4">
        <h2>${langdict[lang]['title1']}</h2>
        <input type="text" id="pending-search" class="form-control mb-3" placeholder="${langdict[lang]['search']}">
        <ul id="pending-list" class="list-group">
      </div>
      <div class="col-md-4">
        <h2>${langdict[lang]['title2']}</h2>
        <input type="text" id="user-search" class= "form-control mb-3" placeholder="${langdict[lang]['search']}">
        <ul id="user-list" class="list-group">
      </div>
      <div class="col-md-4">
        <h2>${langdict[lang]['title3']}</h2>
        <input type="text" id="friend-search" class="form-control mb-3" placeholder="${langdict[lang]['search']}">
        <ul id="friend-list" class="list-group">
        </ul>
      </div>
    </div>
  </div>
    `;
}