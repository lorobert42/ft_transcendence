import { getLang } from "../js/utils/getLang.js";

export default function gameResults() {

    const lang = getLang();

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Résultats du jeu",
            "winner": "Gagnant: ",
            "player1score": "Score du joueur 1: ",
            "player2score": "Score du joueur 2: ",
            "button": "Retour au hub de jeux"
        },
        "EN": {
            "title": "Game Results",
            "winner": "Winner: ",
            "player1score": "Player 1 Score: ",
            "player2score": "Player 2 Score: ",
            "button": "Back to Games Hub"
        },
        "PT": {
            "title": "Resultados do jogo",
            "winner": "Vencedor: ",
            "player1score": "Pontuação do jogador 1: ",
            "player2score": "Pontuação do jogador 2: ",
            "button": "Voltar ao Hub de Jogos"
        }
    }`);
    
    
    
    
    
        return `
    <h1 class="text-center">${langdict[lang]['title']}</h1>
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title" id="res-winner">${langdict[lang]['winner']}</h5>
                        <p class="card-text" id="res-player1score">${langdict[lang['player1score']]}</p>
                        <p class="card-text" id="res-player2score">${langdict[lang['player2score']]}</p>
                        <a href="/gamesearch" id="button-res-home" class="btn btn-primary">${langdict[lang]['button']}</a>
                    </div>
                </div>
            </div>
        </div>`;
}