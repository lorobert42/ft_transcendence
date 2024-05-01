export async function tournamentHandler(dataDict = {}) {

  class Slot {
    #player;
    #score;

    constructor(player, score, round, game, previousRound1 = null, previousRound2 = null) {
      this.round = round;
      this.game = game;
      this.#player = player;
      this.#score = score;
      this.previousRound1 = previousRound1;
      this.previousRound2 = previousRound2;
      this.li = document.createElement('li');
      this.li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
      if (!this.#player && !this.previousRound1 && !this.previousRound2)
        this.li.className += " bg-secondary";
      this.li.innerText = "";

      if (this.round == 0 && this.#player && this.player.status === "accepted") {
        this.li.innerText = player.name;
        this.span = document.createElement('span');
        this.span.className = "badge text-bg-primary rounded-pill";
        this.span.innerText = this.#score;
        this.li.appendChild(this.span);
      }
      if (round) {
        if (this.#player && this.player.status === "accepted") {
          this.li.innerText = player.name;
        } else if (this.previousRound1 && this.previousRound2 && this.previousRound1.player == null && this.previousRound2.player == null) {
          this.li.innerText = "Waiting for previous round...";
        } else if (this.previousRound1 && this.previousRound2 && this.previousRound1.player && this.previousRound2.player) {
          this.li.innerText = `${this.previousRound1.player.name} - ${this.previousRound2.player.name}`;
        }
      }
    }

    set score(score) {
      this.#score = score;
      if (this.#player && this.player.status === "accepted") {
        this.span.innerText = score;
      }
    }

    get score() {
      return this.#score;
    }

    set player(player) {
      this.#player = player;
      if (this.#player && this.player.status === "accepted") {
        this.li.innerText = player.name;
      } else {
        this.li.innerText = "";
      }
    }

    get player() {
      return this.#player;
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

  console.log(tournamentData);
  if (tournamentData.has_started == true) {
    //handle button for start tournament
  } else {
    //show turnament brackets


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


    const data = JSON.parse(JSON.stringify(
      {
        "1,1": { player1: "user1", player2: "user5", score1: 5, score2: 1, status: "finished" },
        "1,2": { player1: "user2", player2: "user6", score1: 2, score2: 1, status: "running" },
        "1,3": { player1: "user3", player2: "user7", score1: 1, score2: 2, status: "running" },
        "1,4": { player1: "user4", player2: "user8", score1: 2, score2: 1, status: "running" },
        "2,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
        "2,2": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
        "3,1": { player1: null, player2: null, score1: 2, score2: 1, status: "pending" },
      }
    ));

    console.log(data);
    const round1Bracket = document.getElementById('round1-list');
    const round2Bracket = document.getElementById('round2-list');
    const round3Bracket = document.getElementById('round3-list');
    const round4Bracket = document.getElementById('round4-list');


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

    // generateBrackets(userList, dataDict);
    let head = new Slot(null, 0, Object.keys(data).length > 4 ? 3 : 2, 1);
    initTree(head, 3, 1, data);
    console.log(head);

    generateUsingTree(head);

    function getData(dataContent, round, game) {
      if (!dataContent[`${round},${game}`])
        return null;
      return dataContent[`${round},${game}`];
    }

    function getPlayerDataFromName(name) {
      return usersData.find((user) => user.name === name);
    }

    function initTree(slotHead, round, game, dataContent) {
      if (round < 1)
        return;

      let roundData = getData(dataContent, round, game);
      if (roundData == null)
        return;
      slotHead.previousRound1 = new Slot(roundData.player1 ? getPlayerDataFromName(roundData.player1) : null,
        roundData.score1, round - 1, game * 2 - 1);
      initTree(slotHead.previousRound1, round - 1, game * 2 - 1, dataContent);

      slotHead.previousRound2 = new Slot(roundData.player2 ? getPlayerDataFromName(roundData.player2) : null,
        roundData.score2, round - 1, game * 2);
      initTree(slotHead.previousRound2, round - 1, game * 2, dataContent);
    }
    function generateUsingTree(slotHead) {
      console.log(slotHead);
      if (slotHead.round == 3) {
        for (let i = 0; i < (8 * 2) - 1; i++) {
          if ((i % 16) - 7 == 0) {
            round4Bracket.appendChild(slotHead.li);
          } else
            round4Bracket.appendChild(new Slot(null, 0, 0, 0).li);
        }
      }
    }
  }




  /*
    function generateBrackets(playerList, dataDict = {}) {
      let numPlayers = playerList.length;
      const roundsValues = ((2 * numPlayers) - 1);
      
      generateBracket(numPlayers);
      
      function generateBracket(numPlayers) {
        round1Bracket.innerHTML = ``; // Clear previous content
        round2Bracket.innerHTML = ``; // Clear previous content
        round3Bracket.innerHTML = ``; // Clear previous content
        round4Bracket.innerHTML = ``; // Clear previous content
        
        let baseList = playerList.map((player) => new Slot(player, 0, 0, player.tournamentPos));
        
        console.log(baseList);
        function generateRound(slotList) {
          if (slotList.length == 1)
          return slotList;
        let newList = [];
        for (let i = 0; i < slotList.length; i += 2) {
            newList.push(new Slot(null, 0, slotList[i].previousRound1 ? slotList[i].round + 1 : 1,
              i / 2, slotList[i], slotList[i + 1]));
            }
            return newList;
          }
          
          for (let i = 0, j = 0; i < (8 * 2) - 1; i++) {
            
            if (i % 2 == 0 && j < baseList.length) {
              round1Bracket.appendChild(baseList[j].li);
              j++;
            } else
            round1Bracket.appendChild(new Slot(null, 0, 0, 0).li);
        }
        
        let round1 = generateRound(baseList);
        console.log(round1);
        
        for (let i = 0, j = 0; i < (8 * 2) - 1; i++) {
          
          if ((i % 4) - 1 == 0 && j < round1.length) {
            round2Bracket.appendChild(round1[j].li);
            j++;
          } else
          round2Bracket.appendChild(new Slot(null, 0, 0, 0).li);
        }
        
        let round2 = generateRound(round1);
        console.log(round2);
        for (let i = 0, j = 0; i < (8 * 2) - 1; i++) {
  
          if ((i % 8) - 3 == 0 && j < round2.length) {
            round3Bracket.appendChild(round2[j].li);
            j++;
          } else
          round3Bracket.appendChild(new Slot(null, 0, 0, 0).li);
        }
        
        if (playerList.length > 4) {
          let round3 = generateRound(round2);
          console.log(round3);
          for (let i = 0, j = 0; i < (8 * 2) - 1; i++) {
            if ((i % 16) - 7 == 0 && j < round3.length) {
              round4Bracket.appendChild(round3[j].li);
              j++;
            } else
            round4Bracket.appendChild(new Slot(null, 0, 0, 0).li);
          }
        }
      } */
}