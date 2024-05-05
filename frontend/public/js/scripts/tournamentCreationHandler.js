import pageRouting from '../../changeContent.js';
import { getFriends } from '../fetchers/friendsFetcher.js';
import { createTournament } from '../fetchers/tournamentsFetcher.js';
import { getUsers } from '../fetchers/usersFetcher.js';
import { printError, printSuccess } from '../utils/toastMessage.js';
import { getLang } from "../utils/getLang.js";

export async function tournamentCreationHandler(dataDict = {}) {
  let friends = [];
  let users = [];
  let available = [];
  let selected = [];

  await updateUsers();
  await updateFriends();

  const availablePlayers = document.getElementById('availablePlayers');
  const selectedPlayers = document.getElementById('selectedPlayers');

  availablePlayers.addEventListener('click', function (event) {
    const lang = getLang();

    let langdict = JSON.parse(`
      {
        "FR": {
          "maxselect": "Vous ne pouvez sélectionner qu'un maximum de 7 joueurs"
        },
        "EN": {
          "maxselect": "You can only select a maximum of 7 players"
        },
        "PT": {
          "maxselect": "Só é possível selecionar um máximo de 7 jogadores"
        }
    }`);
  if (event.target.tagName === 'LI') {
      if (selected.length === 7) {
        printError(`${langdict[lang]["maxselect"]}`, "error");
        return;
      }
      selected.push(available.splice(available.findIndex((user) => user.name === event.target.textContent), 1)[0]);
      filterFriends();
      firstTenSelected(selected);
    }
  });

  selectedPlayers.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
      available.push(selected.splice(selected.findIndex((user) => user.name === event.target.textContent), 1)[0]);
      filterFriends();
      firstTenSelected(selected);
    }
  });

  function firstTenFriends(frList) {
    let firstTen = frList.slice(0, 10);
    availablePlayers.innerHTML = "";
    firstTen.forEach((user) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-center align-items-center";
      li.textContent = user.name;
      availablePlayers.appendChild(li);
    });
  }

  function firstTenSelected(frList) {
    let firstTen = frList.slice(0, 8);
    selectedPlayers.innerHTML = "";
    firstTen.forEach((user) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-center align-items-center";
      li.textContent = user.name;
      selectedPlayers.appendChild(li);
    });
  }



  function filterFriends() {
    const search = document.getElementById("available-search").value.toLowerCase();
    let filteredFriends = available.filter((user) => user.email.toLowerCase().includes(search));
    firstTenFriends(filteredFriends);
  }

  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "maxselect": "Vous devez sélectionner entre 2 et 7 joueurs pour créer un tournoi.",
        "success": "Tournoi créé avec succès avec",
        "players": "joueurs"
     },
      "EN": {
        "maxselect": "You must select between 2 and 7 players to create a tournament",
        "success": "Tournament created successfully with",
        "players": "players"
      },
      "PT": {
        "maxselect": "É necessário selecionar entre 2 e 7 jogadores para criar um torneio",
        "success": "Torneio criado com sucesso com",
        "players": "jogadores"
     }
  }`);

  function initAvailable() {
    const search = document.getElementById("available-search").value.toLowerCase();
    let filteredFriends = friends.filter((friend) => friend.email.toLowerCase().includes(search));
    available = filteredFriends;
    firstTenFriends(filteredFriends);
  }

  document.getElementById("available-search").addEventListener("input", filterFriends);

  initAvailable();

  document.getElementById("create-tournament").addEventListener("click", async (e) => {
    e.preventDefault();

    if (selectedPlayers.childNodes.length < 2 || selectedPlayers.childNodes.length > 7) {
      printError(`${langdict[lang]["maxselect"]}`, "error");
      return;
    }

    let selectedPlayersList = [];
    selectedPlayers.childNodes.forEach((child) => {
      selectedPlayersList.push(friends.find((user) => user.name === child.textContent).id);
    });

    let tournamentName = document.getElementById("tournament-name").value;
    
    
    selectedPlayersList.unshift(dataDict.user.user_id);
    let tournamentInfo = await createTournament(tournamentName, dataDict.user.name, selectedPlayersList);
    printSuccess(`${langdict[lang]["success"]} ${selectedPlayersList.length} ${langdict[lang]["players"]}`, "success");
    history.pushState(null, '', "/tournament");
    pageRouting({ tournamentId: tournamentInfo.id });
  });



  async function updateFriends() {
    friends = await getFriends();
  }

  async function updateUsers() {
    users = await getUsers();
  }
}