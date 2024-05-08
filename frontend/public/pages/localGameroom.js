import { getLang } from "../js/utils/getLang.js";

export default function localRoom() {
    const lang = getLang();

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Jeu Local",
            "playfriend": "Jouer contre un ami",
            "playbot": "Jouer contre un bot",
            "botleft": "Bot à Gauche",
            "botright": "Bot à Droite",
            "cardtitle": "Jeu Pong Local",
            "cardtext": "Ceci est un jeu Pong local à deux joueurs. Le joueur 1 contrôle la raquette en utilisant les touches W (haut) et S (bas). Le joueur 2 contrôle la raquette en utilisant les touches flèche vers le haut et flèche vers le bas.",
            "cardtext2": "L'objectif du jeu est de marquer des points en frappant la balle au-delà de la raquette de votre adversaire. Le jeu se termine lorsqu'un joueur atteint un score maximum de 5.",
            "cardtext3": "Amusez-vous à jouer!"
        },
        "EN": {
            "title": "Local Room",
            "playfriend": "Play with Friend",
            "playbot": "Play against Bot",
            "botleft": "Bot on Left",
            "botright": "Bot on Right",
            "cardtitle": "Local Pong Game",
            "cardtext": "This is a local two-player Pong game. Player 1 controls the paddle using the W (up) and S (down) keys. Player 2 controls the paddle using the Up Arrow and Down Arrow keys.",
            "cardtext2": "The objective of the game is to score points by hitting the ball past your opponent's paddle. The game ends when one player reaches a maximum score of 5.",
            "cardtext3": "Enjoy playing!"
		},
        "PT": {
            "title": "Sala local",
            "playfriend": "Jogar com amigo",
            "playbot": "Jogar contra Bot",
            "botleft": "Bot à esquerda",
            "botright": "Bot à direita",
            "cardtitle": "Jogo Pong Local",
            "cardtext": "Este é um jogo Pong local para dois jogadores. O jogador 1 controla a raquete usando as teclas W (para cima) e S (para baixo). O jogador 2 controla a raquete usando as teclas de seta para cima e seta para baixo.",
            "cardtext2": "O objetivo do jogo é marcar pontos acertando a bola além da raquete do seu oponente. O jogo termina quando um jogador atinge um placar máximo de 5.",
            "cardtext3": "Divirta-se jogando!"
		}
    }`);
    const canvasHTML = `<canvas id="pongCanvas" class="rounded shadow-lg" width="1000" height="700" style="background-color: #000;"></canvas>`;
    

    
    return `<div class="container text-center justify-content-center">
				<div class="mb-3">
					<div class="col">
						<h1>${langdict[lang]['title']}</h1>
                        <div id="buttons-container" class="justify-content-between"></div>
					</div>
				</div>
                ${canvasHTML}
                <div id="explanationDiv" class="row justify-content-center">
                    <div class="col-sm">
                        <div class="card shadow-lg">
                            <div class="card-body">
                                <h5 class="card-title">${langdict[lang]['cardtitle']}</h5>
                                <p class="card-text">${langdict[lang]['cardtext']}</p>
                                <p class="card-text">${langdict[lang]['cardtext2']}</p>
                                <p class="card-text">${langdict[lang]['cardtext3']}</p>
                            </div>
                        </div>
                    </div>
                </div>
			</div>`;


}
