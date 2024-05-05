import { getGames } from "../fetchers/gamesFetcher.js";
import { getUsers } from "../fetchers/usersFetcher.js";
import pageRouting, { dataSave, pageRefreshRate } from "../../changeContent.js";
import { getParticipations, getTournaments, joinTournament, startTournament } from "../fetchers/tournamentsFetcher.js";
import { getLang } from "../utils/getLang.js";
import { printError } from "../utils/toastMessage.js";


export async function tournamentHandler(dataDict = {}) {
  let tournamentSocket;
  class Slot {

    constructor(player1, player2, score1, score2, round, game, gameId, status) {
      this.player1 = player1;
      this.player2 = player2;
      this.score1 = score1;
      this.score2 = score2;
      this.round = round;
      this.game = game;
      this.status = status;
      this.gameId = gameId;
    }

    updateSlot(player1, player2, score1, score2, round, game, gameId, status) {
      this.player1 = player1;
      this.player2 = player2;
      this.score1 = score1;
      this.score2 = score2;
      this.round = round;
      this.game = game;
      this.status = status;
      this.gameId = gameId;
      return this;
    }

    template() {
      let li = document.createElement('li');
      li.className = "fixed-size-list-item d-flex row justify-content-center align-items-center";
      if (this.status == "null") {
        li.className += " border-0";
        return li;
      }

      let contentContainer = document.createElement('div');
      contentContainer.className = "row";

      let leftdiv = document.createElement('div');
      let leftDivtext = document.createElement('div');
      leftDivtext.className = "d-flex col-sm justify-content-start align-items-center text-start";
      leftdiv.className = "d-flex col-sm justify-content-center align-items-center text-start";

      let rightdiv = document.createElement('div');
      let rightDivtext = document.createElement('div');
      rightDivtext.className = "d-flex col-sm justify-content-end align-items-end text-end";
      rightdiv.className = "d-flex col-sm justify-content-center align-items-center ";

      if (this.status == "pending" || this.status == "running" || this.status == "finished" || this.status == "canceled") {
        leftDivtext.innerText = this.player1 ? this.player1.name : "...";
        rightDivtext.innerText = this.player2 ? this.player2.name : "...";
      }

      if (this.status == "canceled") {
        leftDivtext.innerText = "Canceled";
        rightDivtext.innerText = "Canceled";
        li.className += " bg-light-subtle";
      }

      if (this.status == "finished") {
        if (this.score1 > this.score2) {
          leftdiv.className += " text-success";
          rightdiv.className += " text-danger";
        }
        else {
          leftdiv.className += " text-danger";
          rightdiv.className += " text-success";
        }
      }

      leftdiv.appendChild(leftDivtext);
      if (this.status != "canceled" && this.player1 && this.player2) {
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        span1.className = "d-flex badge bg-primary rounded-pill";
        span2.className = "badge d-flex bg-primary rounded-pill";
        span1.innerText = this.score1;
        span2.innerText = this.score2;
        leftdiv.appendChild(span1);
        rightdiv.appendChild(span2);
      }

      contentContainer.appendChild(leftdiv);
      if ((this.status == "pending" || this.status == "running") && (this.player1 && this.player2) && (dataDict.user.user_id == this.player1.id || dataDict.user.user_id == this.player2.id)) {
        let centerButtonDiv = document.createElement('div');
        let centerButton = document.createElement('button');
        centerButtonDiv.className = "d-flex col-sm justify-content-center align-items-center";
        centerButton.className = "btn btn-primary";
        centerButton.innerText = "Join";
        centerButton.addEventListener('click', () => {
          if(tournamentSocket != undefined && tournamentSocket.readyState === 1 && tournamentSocket.OPEN === 1)
            tournamentSocket.close();
          history.pushState(null, '', '/online');
          pageRouting({
            gameId: this.gameId,
            player1: this.player1.id,
            player2: this.player2.id,
          });
        });
        centerButtonDiv.appendChild(centerButton);
        contentContainer.appendChild(centerButtonDiv);
      }
      rightdiv.appendChild(rightDivtext);
      contentContainer.appendChild(rightdiv);
      li.appendChild(contentContainer);
      return li;
    }

  }

  const lang = getLang();

  let langdict = JSON.parse(`
    {
      "FR": {
        "round": "Tour",
        "tournament": "Tournois"
      },
      "EN": {
        "round": "Round",
        "tournament": "Tournament"
      },
      "PT": {
        "round": "Rodada",
        "tournament": "Torneio"
      }
    }`);

  let tournament;
  async function getCurrentTournament() {
    let tournaments = await getTournaments();
    if(!tournaments) {
      history.pushState(null, '', '/gamesearch');
      pageRouting(dataDict);
      return;
    }
    tournaments = tournaments.find((tour) => tour.id == dataDict.tournamentId);
    return tournaments
  }

  async function checkForTournament() {
    const tour = await getCurrentTournament();
    if(tour == undefined || tour == null || tour.status.toLowerCase() == "canceled" || tour.status.toLowerCase() == "finished") {
      history.pushState(null, '', '/gamesearch');
      pageRouting(dataDict);
      printError("Tournament has been canceled or finished", "error");
      return;
    }
  }

  let container = document.getElementById('tournament-container');
  tournament = await getCurrentTournament();
  if (tournament == undefined) {
    history.pushState(null, '', '/gamesearch');
    pageRouting(dataDict);
    return;
  }
  let participation = await getParticipations();
  participation = participation.find((part) => part.tournament == dataDict.tournamentId);

  dataSave.intervalsList.push(setInterval(async () => {
    tournament = await getCurrentTournament();
    if(tournament && tournament.has_started)
    {
      history.pushState(null, '', window.location.pathname);
      pageRouting(dataDict);
      return;
    } else if (tournament == undefined || tournament.status.toLowerCase() == "canceled" || tournament.status.toLowerCase() == "finished") {
      history.pushState(null, '', '/gamesearch');
      pageRouting(dataDict);
      printError("Tournament has been canceled or finished", "error");
      return;
    } else {
      let participantCount = document.getElementById('participantCount');
      participantCount.innerText = tournament.participants.filter((participant) => participant.status == "accepted").length;
    }
  }, pageRefreshRate));
  if(tournament.has_started) tournament.status = "running";
  else if (tournament.status.toLowerCase() == "canceled" || tournament.status.toLowerCase() == "finished") {
    history.pushState(null, '', '/gamesearch');
    pageRouting(dataDict);
    printError("Tournament has been canceled or finished", "error");
    return;
  }
  if (tournament.status.toLowerCase() == "pending") {

    let lang = getLang();

    let langdict = JSON.parse(`
    {
      "FR": {
        "card-title": "Rejoignez le tournoi!",
        "card-text": "Cliquez sur le bouton ci-dessous pour participer au tournoi. (Minimum 3 participants pour commencer le tournoi)",
        "participants": "Participants: ",
        "accept": "Accepter pour participer",
        "optout": "Refuser la participation",
        "start": "Commencer le tournoi"
      },
      "EN": {
        "card-title": "Join The Tournament!",
        "card-text": "Click the button below to participate in the tournament. (Minimum 3 participants to start the tournament)",
        "participants": "Participants: ",
        "accept": "Accept to Participate",
        "optout": "Opt Out Participation",
        "start": "Start Tournament"
      },
      "PT": {
        "card-title": "Junte-se ao torneio!",
        "card-text": "Clique no botão abaixo para participar do torneio. (Mínimo de 3 participantes para iniciar o torneio)",
        "participants": "Participantes: ",
        "accept": "Aceitar para participar",
        "optout": "Optar por não participar",
        "start": "Iniciar torneio"
      }
    }`);




    container.innerHTML = `
    <div class="row">
       <div class="card">
        <div class="card-body">
            <h4 class="card-title">${langdict[lang]['card-title']}</h4>
            <p class="card-text">${langdict[lang]['card-text']}</p>
            <div id="button-participation-div"></div>
            <div id="counter" class="mt-3">
                <h5>${langdict[lang]['participants']}<span id="participantCount">0</span></h5>
            </div>
        </div>
      </div>
    </div>
    `;
    if(participation.status.toLowerCase() == "pending") {
      let buttonDiv = document.getElementById('button-participation-div');
      let participateButton = document.createElement('participateButton');
      participateButton.className = 'btn btn-primary';
      participateButton.innerText = langdict[lang]['accept'];
  
      participateButton.addEventListener('click', async () => {
        await checkForTournament();
        await joinTournament(participation.id, "accepted");
        pageRouting(dataDict);
      });
      buttonDiv.appendChild(participateButton);
    } else if (participation.status.toLowerCase() == "accepted") {
      let buttonDiv = document.getElementById('button-participation-div');
      let optOutParticipationButton = document.createElement('optOutParticipationButton');
      optOutParticipationButton.className = 'btn btn-danger me-2';
      optOutParticipationButton.innerText = langdict[lang]['optout'];

      optOutParticipationButton.addEventListener('click', async () => {
        await checkForTournament();
        await joinTournament(participation.id, "pending");
        pageRouting(dataDict);
      });

      buttonDiv.appendChild(optOutParticipationButton);
      if(!buttonDiv) 
      {
        history.pushState(null, '', '/gamesearch');
        pageRouting(dataDict);
        return;
      }
      let startTournamentButton = document.createElement('startTournamentButton');
      startTournamentButton.className = 'btn btn-success';
      startTournamentButton.innerText = langdict[lang]['start'];

      startTournamentButton.addEventListener('click', async () => {
        await checkForTournament();
        await startTournament(dataDict.tournamentId);
        pageRouting(dataDict);
      });

      buttonDiv.appendChild(startTournamentButton);
    }
    tournament = await getCurrentTournament();
    if (tournament == undefined) {
      history.pushState(null, '', '/gamesearch');
      pageRouting(dataDict);
      return;
    }
    let participantCount = document.getElementById('participantCount');

    participantCount.innerText = tournament.participants.filter((participant) => participant.status == "accepted").length;

    
  } else if (tournament.status == "running") {
    container.innerHTML = `
    <h1>${langdict[lang]['tournament']}</h1>
    <div class="row">
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 1</h2>
        <ul id="round1-list" class="list-group">
      </div>
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 2</h2>
        <ul id="round2-list" class="list-group">
        </ul>
      </div>
      <div class="col-sm">
        <h2>${langdict[lang]['round']} 3</h2>
        <ul id="round3-list" class="list-group">
      </div>
    </div>`;

    let loader = document.createElement('div');
    loader.className = "spinner-border text-primary";
    let hasLoaded = false;
    container.appendChild(loader);
  
    let usersData = await getUsers();
    tournamentSocket = new WebSocket(
      'wss://' + location.host + `/ws/tournament/${dataDict.tournamentId}/?token=` + localStorage.getItem('authToken')
    );

    dataSave.socketArrayCollector.push(tournamentSocket);



    let disconnect = false;
    async function waitConnection() {
      setTimeout(function () {
        if (tournamentSocket.readyState === 1 && tournamentSocket.OPEN === 1) {
          return;

        } else {
          if (window.location.pathname !== "/tournament") {
            disconnect = true;
            return;
          }
          waitConnection();
        }
      }, 5);
    }

    await waitConnection();

    if (disconnect) {
      tournamentSocket.close();
      return;
    }

    let data;

    const round1Bracket = document.getElementById('round1-list');
    const round2Bracket = document.getElementById('round2-list');
    const round3Bracket = document.getElementById('round3-list');
    const roundBrackets = [round1Bracket, round2Bracket, round3Bracket];



    let games = [];
    await updateGames();

    async function updateGames() {
      games = await getGames();
    }

    let matrix = [[], [], []];

    function getPositionTranslation(round, game) {
      if (round == 1) {
        return [0, (game * 4) - 4];
      } else if (round == 2) {
        return [1, (game * 8) - 6];
      } else if (round == 3) {
        return [2, (game * 16) - 10];
      }
      return null;
    }

    function fillMatrix(matrixContent) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 14; j++) {
          let newSlot = new Slot(null, null, 0, 0, -1, -1, -1, "null");
          matrixContent[i].push(newSlot);
        }
      }
      return matrixContent;
    }

    function getData(dataContent, round, game) {
      if (!dataContent[`${round},${game}`])
        return null;
      return dataContent[`${round},${game}`];
    }

    function getPlayerDataFromId(id) {
      if (!id)
        return null;
      return usersData.find((user) => user.id === id);
    }



    let headRound = 0;
    for (let i in data) {
      if (data[i].player1 != null)
        headRound++;
      if (data[i].player2 != null)
        headRound++;
    }
    headRound = headRound > 4 ? 3 : 2;

    function generateUsingTree(matrixContent) {
      for (let i = 0; i < 3; i++) {
        roundBrackets[i].innerHTML = "";
        for (let j = 0; j < 14; j++) {
          let matLi = matrixContent[i][j].template();
          roundBrackets[i].appendChild(matLi);
        }
      }
      return matrixContent;
    }

    matrix = fillMatrix(matrix);
    tournamentSocket.onmessage = function (e) {
      data = JSON.parse(e.data);
      if(!hasLoaded)
      {
        loader.style.display = "none";
        hasLoaded = true;
      }
      updateMatrix();
      matrix = generateUsingTree(matrix);
    }

    function updateMatrix() {
      for (let gameKey in data) {
        let round = parseInt(gameKey.split(",")[0]);
        let game = parseInt(gameKey.split(",")[1]);
        let dataPlayer1 = data[gameKey].player1;
        let dataPlayer2 = data[gameKey].player2;
        let dataScore1 = data[gameKey].score1;
        let dataScore2 = data[gameKey].score2;
        let dataStatus = data[gameKey].status;
        let currentGameId = data[gameKey].game_id;

        let pos = getPositionTranslation(round, game);
        matrix[pos[0]][pos[1]] = matrix[pos[0]][pos[1]].updateSlot(dataPlayer1 ? getPlayerDataFromId(dataPlayer1) : null,
          dataPlayer2 ? getPlayerDataFromId(dataPlayer2) : null,
          dataScore1, dataScore2, round, game, currentGameId, dataStatus);
      }
    }
}
}