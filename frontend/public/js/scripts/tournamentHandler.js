export function tournamentHandler() {
  let userList = [
    { name: "user1", status: "accepted", tournamentPos: 1 },
    { name: "user2", status: "accepted", tournamentPos: 2 },
    { name: "user3", status: "accepted", tournamentPos: 3 },
    { name: "user4", status: "accepted", tournamentPos: 4 },
    { name: "user5", status: "accepted", tournamentPos: 5 },
  ]

  generateBrackets(userList);
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
      } else if (this.previousRound1 == null && this.previousRound2 == null) {
        this.li.innerText = "Waiting for previous round...";
      } else if (this.player && this.previousRound1 && this.previousRound2) {
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

function generateBrackets(playerList) {
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
    for (let i = 0; i < round2.length; i++) {
      round3Bracket.appendChild(round2[i].li);
    }

    if (playerList.length > 4) {
      let round3 = generateRound(round2);
      console.log(round3);
      for (let i = 0; i < round3.length; i++) {
        round4Bracket.appendChild(round3[i].li);
      }
    }


    // // Generate Round 2

    // let slotArray2 = [];

    // for (let i = 0, j = 0; i < (playerList.length * 2) - 1; i++) {
    //   if ((i % 4) - 1 == 0) {
    //     j++;
    //     slotArray2.push(new Slot(playerList[j++], 0, 1, j));
    //   }
    //   else
    //     slotArray2.push(new Slot(null, 0, 1));
    // }

    // for (let i = 0; i < roundsValues; i++) {
    //   const li = document.createElement('li');
    //   li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";

    //   if ((i % 4) - 1 == 0) {
    //     li.innerText = "User";
    //     const span = document.createElement('span');
    //     span.className = "badge text-bg-primary rounded-pill";
    //     span.innerText = "0";
    //     li.appendChild(span);
    //   }
    //   else
    //     li.innerText = "";
    //   round2Bracket.appendChild(li);
    // }

    //   // Generate Round 3
    //   for (let i = 0; i < roundsValues; i++) {
    //     const li = document.createElement('li');
    //     li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
    //     if ((i % 8) - 3 == 0) {
    //       li.innerText = "User";
    //       const span = document.createElement('span');
    //       span.className = "badge text-bg-primary rounded-pill";
    //       span.innerText = "0";
    //       li.appendChild(span);
    //     }
    //     else
    //       li.innerText = "";
    //     round3Bracket.appendChild(li);
    //   }

    //   // Generate Round 4
    //   for (let i = 0; i < roundsValues; i++) {
    //     const li = document.createElement('li');
    //     li.className = "fixed-size-list-item d-flex justify-content-between align-items-center";
    //     if ((i % 16) - 7 == 0)
    //       li.innerText = "User";
    //     else
    //       li.innerText = "";
    //     round4Bracket.appendChild(li);
    //   }

    // }

    // Example usage:
  }
}