import { getGames } from "../fetchers/gamesFetcher.js";
import { getUsers } from "../fetchers/usersFetcher.js";
import pageRouting from "../../changeContent.js";
import { getTournaments, joinTournament } from "../fetchers/tournamentsFetcher.js";
import { getLang } from "../utils/getLang.js";

export async function tournamentHandler(dataDict = {}) {

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
          history.pushState(null, '', '/online');
          pageRouting({
            gameId: this.gameId,
            player1: this.player1.id,
            player2: this.player2.id,
          });
          tournamentSocket.close();
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

  let container = document.getElementById('tournament-container');
  let tournament = await getTournaments();
  tournament = tournament.find((tournement) => tournement.id == dataDict.tournamentId);
  console.log("Tournoie: ", tournament, dataDict.tournamentId);
  if (tournament == undefined) {
    history.pushState(null, '', '/gamesearch');
    pageRouting(dataDict);
    return;
  }
  tournament.status = "running";
  if (tournament.status == "pending") {
    container.innerHTML = `
    <div class="row">
       <div class="card">
        <div class="card-body">
            <h4 class="card-title">Join The Tournament!</h4>
            <p class="card-text">Click the button below to participate in the tournament.</p>
            <button id="participateButton" class="btn btn-primary">Accept to Participate</button>
            <div id="counter" class="mt-3">
                <h5>Participants: <span id="participantCount">0</span></h5>
            </div>
        </div>
      </div>
    </div>
    `;
    let participateButton = document.getElementById('participateButton');

    participateButton.addEventListener('click', async () => {
      await joinTournament();
    });

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

    //try to connect to websocket
    let usersData = await getUsers();
    console.log(dataDict.tournamentId);
    const tournamentSocket = new WebSocket(
      'wss://' + location.host + `/ws/tournament/${dataDict.tournamentId}/?token=` + localStorage.getItem('authToken')
    );


    let disconnect = false;
    async function waitConnection() {
      setTimeout(function () {
        if (tournamentSocket.readyState === 1 && tournamentSocket.OPEN === 1) {
          // Function to disable start button
          console.log("Connected to socket");
          return;

        } else {
          if (window.location.pathname !== "/tournament") {
            disconnect = true;
            return;
          }
          console.log("waiting to connect");
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

    // const data = JSON.parse(JSON.stringify(
    //   {
    //     "1,1": { player1: "user1", player2: "user5", score1: 5, score2: 1, status: "finished" },
    //     "1,2": { player1: "user2", player2: "user6", score1: 2, score2: 1, status: "pending" },
    //     "1,3": { player1: "user3", player2: "user7", score1: 1, score2: 2, status: "running" },
    //     // "1,4": { player1: "user4", player2: "user8", score1: 2, score2: 1, status: "running" },
    //     "2,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
    //     // "2,2": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
    //     "3,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
    //   }
    // ));

    console.log(data);


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
      console.log(round, game)
      if (!dataContent[`${round},${game}`])
        return null;
      return dataContent[`${round},${game}`];
    }

    function getPlayerDataFromName(name) {
      if (!name)
        return null;
      return usersData.find((user) => user.name === name);
    }


    console.log(matrix);

    let headRound = 0;
    for (let i in data) {
      if (data[i].player1 != null)
        headRound++;
      if (data[i].player2 != null)
        headRound++;
    }
    headRound = headRound > 4 ? 3 : 2;
    console.log("rounds", headRound);

    function generateUsingTree(matrixContent) {
      for (let i = 0; i < 3; i++) {
        roundBrackets[i].innerHTML = "";
        for (let j = 0; j < 14; j++) {
          let matLi = matrixContent[i][j].template();
          // console.log(matLi);
          roundBrackets[i].appendChild(matLi);
        }
      }
      return matrixContent;
    }

    matrix = fillMatrix(matrix);
    tournamentSocket.onmessage = function (e) {
      data = JSON.parse(e.data);
      console.log("Socket data: ", data);
      updateMatrix();
      console.log(matrix);
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
        // console.log(getPlayerDataFromName(dataPlayer1), getPlayerDataFromName(dataPlayer2));
        matrix[pos[0]][pos[1]] = matrix[pos[0]][pos[1]].updateSlot(dataPlayer1 ? getPlayerDataFromName(dataPlayer1) : null,
          dataPlayer2 ? getPlayerDataFromName(dataPlayer2) : null,
          dataScore1, dataScore2, round, game, currentGameId, dataStatus);
      }
    }
  }
}
