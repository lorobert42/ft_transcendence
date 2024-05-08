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

    let loading = document.getElementById('res-winner');
    let loadingDiv = document.createElement('div');
    loadingDiv.className = 'spinner-border text-primary';
    let winner = document.getElementById('res-winner');
    let player1Score = document.getElementById('res-player1score');
    let player2Score = document.getElementById('res-player2score');
    
    let users = await getUsers();
    let games;
    let game;
    let isappended = false;
    let count = 0;
    games = await getGames();
    game = games.find(game => game.id == dataDict.gameId);
    while (game.score1 != 5 && game.score2 != 5) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        games = await getGames();
        game = games.find(game => game.id == dataDict.gameId);
        if(!isappended)
        {
            loading.appendChild(loadingDiv);
            loading.style = 'display: block';
            player1Score.appendChild(loadingDiv);
            player2Score.appendChild(loadingDiv);
            isappended = true;
        }

        if(count = 30) {
            history.pushState(null, '', '/gamesearch');
            pageRouting();
        }
        count++;
    }

    if(loading.contains(loadingDiv))
    {
        loading.removeChild(loadingDiv);
    }
    if(player1Score.contains(loadingDiv))
    {
        player1Score.removeChild(loadingDiv);
    }
    if(player2Score.contains(loading))
    {
        player2Score.removeChild(loadingDiv);
    }


    let u1name = users.find(user => user.id == game.player1).name;
    let u2name = users.find(user => user.id == game.player2).name;

    let winnerName = game.score1 > game.score2 ? u1name : u2name;
    winner.textContent += `${winnerName}`;
    player1Score.textContent = `${u1name} : ${game.score1}`;
    player2Score.textContent = `${u2name} : ${game.score2}`;
  
    document.getElementById('button-res-home').addEventListener('click', function(e)
    {
        e.preventDefault();
        history.pushState(null, '', '/gamesearch');
        pageRouting();
    });

}