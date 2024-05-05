
import { getLang } from "../js/utils/getLang.js";

export default function tournamentCreation() {
    const lang = getLang();
    const langdict = {
            "FR": {
            "createTournament": "Créez votre tournoi",
            "pickplayers": "Choisissez 3 ou 7 joueurs pour participer au tournoi",
            "availableplayers": "Joueurs disponibles",
            "searchplayers": "Rechercher des joueurs...",
            "tourname": "Nom du tournoi",
            "selectedplayers": "Joueurs",
            "tourncreate": "Créer tournoi"
        },
        "EN": {
            "createTournament": "Create Your Tournament",
            "pickplayers": "Choose 3 or 7 players to participate in the tournament",
            "availableplayers": "Available Players",
            "searchplayers": "Search for players...",
            "tourname": "Tournament Name",
            "selectedplayers": "Selected Players",
            "tourncreate": "Create Tournament"
        },
        "PT": {
            "createTournament": "Criar o seu torneio",
            "pickplayers": "Escolhe 3 ou 7 jogadores para participarem no torneio",
            "availableplayers": "Jogadores disponíveis",
            "searchplayers": "Procurar jogadores...",
            "tourname": "Nome do torneio",
            "selectedplayers": "Jogadores seleccionados",
            "tourncreate": "Criar Torneio"
        }
    };

    return `
    <div class="text-center">
        <h2>${langdict[lang]['createTournament']}</h2>
        <p>${langdict[lang]['pickplayers']}</p>
        <div class="row">
            <div class="col-md-5">
                <h2>${langdict[lang]['availableplayers']}</h2>
                <input type="text" id="available-search" class="form-control mb-3" placeholder="${langdict[lang]['searchplayers']}">
                <ul class="list-group" id="availablePlayers"></ul>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <h2>&rarr; &larr;</h2>
            </div>
            <div class="col-md-5">
                <h2>${langdict[lang]['selectedplayers']}</h2>
                <ul class="list-group" id="selectedPlayers"></ul>
            </div>
        </div>
        <div class="mt-4">
            <input type="text" id="tournament-name" class="form-control mb-3" placeholder="${langdict[lang]['tourname']}">
            <button id="create-tournament" class="btn btn-success">${langdict[lang]['tourncreate']}</button>
        </div>
    </div>`;
    }