export async function tournamentHandler(dataDict = {}) {
  let games = [];
  await updateGames();

  let userList = [
    { name: "user1", status: "accepted", tournamentPos: 1 },
    { name: "user2", status: "accepted", tournamentPos: 2 },
    { name: "user3", status: "accepted", tournamentPos: 3 },
    { name: "user4", status: "accepted", tournamentPos: 4 },
  ]

  async function updateGames() {
    games = await fetch("/api/game/", {
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

  generateBrackets(userList, dataDict);
}

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
      } else if (this.previousRound1.player == null && this.previousRound2.player == null) {
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

function generateBrackets(playerList, dataDict = {}) {
  let numPlayers = playerList.length;
  const roundsValues = ((2 * numPlayers) - 1);
  const round1Bracket = document.getElementById('round1-list');
  const round2Bracket = document.getElementById('round2-list');
  const round3Bracket = document.getElementById('round3-list');
  const round4Bracket = document.getElementById('round4-list');

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
  }
}