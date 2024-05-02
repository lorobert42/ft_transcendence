export async function tournamentHandler(dataDict = {}) {

  class Slot {

    constructor(player1, player2, score1, score2, round, game, status) {
      this.player1 = player1;
      this.player2 = player2;
      this.score1 = score1;
      this.score2 = score2;
      this.round = round;
      this.game = game;
      this.status = status;
    }

    updateSlot(player1, player2, score1, score2, round, game, status) {
      this.player1 = player1;
      this.player2 = player2;
      this.score1 = score1;
      this.score2 = score2;
      this.round = round;
      this.game = game;
      this.status = status;
    }

    template() {
      let li = document.createElement('li');
      li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
      if (this.status == "null") {
        li.className += " border-0";
      }

      let leftdiv = document.createElement('div');
      leftdiv.className = "d-flex justify-content-between align-items-center";
      let rightdiv = document.createElement('div');
      rightdiv.className = "d-flex justify-content-between align-items-center";

      if (this.status == "pending") {
        leftdiv.innerText = this.player1 ? this.player1.name : "...";
        rightdiv.innerText = this.player2 ? this.player2.name : "...";
      } else if (this.status == "finished" || this.status == "running") {
        if (this.player1)
          leftdiv.innerText = this.player1.name;
        if (this.player2)
          rightdiv.innerText = this.player2.name;
      }

      li.appendChild(leftdiv);
      li.appendChild(rightdiv);

      return li;
    }

  }

  dataDict.tournamentId = 4;

  let usersData = await fetch(`/api/user/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      console.error("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data;
  }).catch((error) => {
    console.error("Error:", error);
  });


  let tournamentData = await fetch(`/api/game/tournament/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      console.error("Unauthorized");
    }
    return response.json();
  }).then((data) => {
    return data.filter((tournament) => tournament.id == dataDict.tournamentId)[0];
  }).catch((error) => {
    console.error("Error:", error);
  });

  //try to connect to websocket
  const tournamentSocket = new WebSocket(
    'wss://' + location.host + `/ws/tournament/${dataDict.tournamentId}/?token=` + localStorage.getItem('authToken')
  );


  let disconnect = false;
  function waitConnection() {
    setTimeout(function () {
      if (tournamentSocket.readyState === 1 && tournamentSocket.OPEN === 1) {
        // Function to disable start button
        return;

      } else {
        if (window.location.pathname !== "/online") {
          disconnect = true;
          return;
        }
        console.log("waiting to connect");
        waitConnection();
      }
    }, 5);
  }

  waitConnection();

  if (disconnect) {
    tournamentSocket.close();
    return;
  }

  tournamentSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    console.log(data);
  }

  const round1Bracket = document.getElementById('round1-list');
  const round2Bracket = document.getElementById('round2-list');
  const round3Bracket = document.getElementById('round3-list');
  const roundBrackets = [round1Bracket, round2Bracket, round3Bracket];

  const data = JSON.parse(JSON.stringify(
    {
      "1,1": { player1: "user1", player2: "user5", score1: 5, score2: 1, status: "finished" },
      "1,2": { player1: "user2", player2: "user6", score1: 2, score2: 1, status: "pending" },
      "1,3": { player1: "user3", player2: "user7", score1: 1, score2: 2, status: "running" },
      // "1,4": { player1: "user4", player2: "user8", score1: 2, score2: 1, status: "running" },
      "2,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
      // "2,2": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
      "3,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
    }
  ));

  console.log(data);


  let games = [];
  await updateGames();

  async function updateGames() {
    games = await fetch(`/api/game/games/tournament/${dataDict.tournamentId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }).then((response) => {
      if (response.status === 401) {
        console.error("Unauthorized");
      }
      return response.json();
    }).then((data) => {
      return data;
    }).catch((error) => {
      console.error("Error:", error);
    });
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
        let newSlot = new Slot(null, null, 0, 0, -1, -1, "null");
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

  matrix = fillMatrix(matrix);

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

  for (let gameKey in data) {
    let round = parseInt(gameKey.split(",")[0]);
    let game = parseInt(gameKey.split(",")[1]);
    let dataPlayer1 = data[gameKey].player1;
    let dataPlayer2 = data[gameKey].player2;
    let dataScore1 = data[gameKey].score1;
    let dataScore2 = data[gameKey].score2;
    let dataStatus = data[gameKey].status;

    let pos = getPositionTranslation(round, game);
    console.log("Pos", data, game, pos);
    let slot = matrix[pos[0]][pos[1]];
    slot.updateSlot(dataPlayer1 ? getPlayerDataFromName(dataPlayer1) : null,
      dataPlayer2 ? getPlayerDataFromName(dataPlayer2) : null,
      dataScore1, dataScore2, round, game, dataStatus);
  }

  generateUsingTree(matrix);
  function generateUsingTree(matrixContent) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 14; j++) {
        let matLi = matrixContent[i][j].template();
        roundBrackets[i].appendChild(matLi);
      }
    }
    return matrixContent;
  }
}
