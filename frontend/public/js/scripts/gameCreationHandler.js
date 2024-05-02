import pageRouting from '../../changeContent.js';
import { getFriends } from '../fetchers/friendsFetcher.js';
import { createGame, createGameInvitation, getGames } from '../fetchers/gamesFetcher.js';

export async function gameCreationHandler(dataDict = {}) {
  //fetch all friends
  let friends = [];
  let games = [];

  await updateFriends();

  let playerSelect = document.getElementById("playerSelect");

  let val = 0;
  friends.forEach(friend => {
    console.log(friend);
    let option = document.createElement("option");
    option.value = val++;
    option.text = friend.name;
    playerSelect.add(option);
  });

  document.getElementById('searchInput').addEventListener('input', function () {
    const input = this.value.toLowerCase();
    const options = document.querySelectorAll('#playerSelect option');

    options.forEach(option => {
      const text = option.textContent.toLowerCase();
      const matches = text.includes(input);
      option.style.display = matches ? '' : 'none';
    });
  });

  document.getElementById('gameCreateSubmit').addEventListener('click', async (e) => {
    e.preventDefault();

    if (playerSelect.value == -1) { return; }

    await updateGames();


    let foundGame = false;
    console.log("Games: ", games);
    games.forEach(element => {
      if (foundGame) { return; }
      if (((element.player1 == dataDict.user.user_id && element.player2 == friends[playerSelect.value]) ||
        (element.player2 == dataDict.user.user_id && element.player1 == friends[playerSelect.value])) &&
        (element.score1 == 0 && element.score2 == 0)) {
        //redirect to ongoing party
        console.log("Redirecting to ongoing party with id :", element.id);
        console.log("With players: ", dataDict.user.user_id, " and ", friends[playerSelect.value]);
        console.log("compared to ", element.player1, " and ", element.player2);
        history.pushState(null, '', '/online');
        pageRouting({ gameId: element.id });
        foundGame = true;
        return;
      }
    });
    if (foundGame) { return; }
    //create a new game

    let result = await createGame(dataDict.user.user_id, friends[playerSelect.value].id);
    let resultId = result.id;

    //TODO HANDLE GAME NOT FOUND
    console.log("Result: ", resultId);
    history.pushState(null, '', '/online');
    pageRouting({
      gameId: resultId,
      player1: dataDict.user.user_id,
      player2: friends[playerSelect.value],
    });
    return;
  });

  async function updateFriends() {
    friends = await getFriends();
  }

  async function updateGames() {
    games = await getGames();
  }
}