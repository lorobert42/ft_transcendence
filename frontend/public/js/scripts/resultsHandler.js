import pageRouting from "../../changeContent.js";
import { getGames } from "../fetchers/gamesFetcher.js";
import { getUsers } from "../fetchers/usersFetcher.js";

export async function resultsHandler(dataDict = {}) {
    if(!dataDict.gameId)
    {
        history.pushState(null, '', '/gamesearch');
        pageRouting();
        return;
    }
    let users = await getUsers();
    let games = await getGames();
    let game = games.find(game => game.id == dataDict.gameId);

    let winner = document.getElementById('res-winner');
    let player1Score = document.getElementById('res-player1score');
    let player2Score = document.getElementById('res-player2score');

    console.log("DataDict: ", dataDict);
    let u1name = users.find(user => user.id == game.player1).name;
    let u2name = users.find(user => user.id == game.player2).name;

    let winnerName = game.score1 > game.score2 ? u1name : u2name;
    winner.textContent += `${winnerName} wins!`;
    player1Score.textContent = `${u1name} : ${game.score1}`;
    player2Score.textContent = `${u2name} : ${game.score2}`;
  
    document.getElementById('button-res-home').addEventListener('click', function(e)
    {
        e.preventDefault();
        history.pushState(null, '', '/gamesearch');
        pageRouting();
    });

}