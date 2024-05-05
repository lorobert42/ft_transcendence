import pageRouting from '../../changeContent.js';
import { getFriends } from '../fetchers/friendsFetcher.js';
import { createGame, getGames } from '../fetchers/gamesFetcher.js';

export async function gameCreationHandler(dataDict = {}) {
  let friends = [];
  let games = [];

  await updateFriends();

  let playerSelect = document.getElementById("playerSelect");

  let val = 0;
  friends.forEach(friend => {
    let option = document.createElement("option");
    option.value = val++;
    option.text = friend.name;
    playerSelect.add(option);
    if(val == 1) {
      option.selected = true;
    }
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
    games.forEach(element => {
      if (foundGame) { return; }
      if (((element.player1 == dataDict.user.user_id && element.player2 == friends[playerSelect.value]) ||
        (element.player2 == dataDict.user.user_id && element.player1 == friends[playerSelect.value])) &&
        (element.score1 == 0 && element.score2 == 0)) {
        history.pushState(null, '', '/online');
        pageRouting({ gameId: element.id });
        foundGame = true;
        return;
      }
    });
    if (foundGame) { return; }

    if(playerSelect.value == undefined || playerSelect.value == null)
      return ;
    let result = await createGame(dataDict.user.user_id, friends[playerSelect.value].id);
    let resultId = result.id;

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