export default function localRoom() {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Jeu Local",
            "playfriend": "Jouer contre un ami",
            "playbot": "Jouer contre un bot",
            "botleft": "Bot à Gauche",
            "botright": "Bot à Droite"
        },
        "EN": {
            "title": "Local Room",
            "playfriend": "Play with Friend",
            "playbot": "Play against Bot",
            "botleft": "Bot on Left",
            "botright": "Bot on Right"
		},
        "PT": {
            "title": "Sala local",
            "playfriend": "Jogar com amigo",
            "playbot": "Jogar contra Bot",
            "botleft": "Bot à esquerda",
            "botright": "Bot à direita"

		}
    }`);
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    return `<div class="container">
				<div>
					<div class="col">
						<h1>${langdict[lang]['title']}</h1>
						<div>
						<button id="button-start-human">${langdict[lang]['playfriend']}</button>
						<button id="button-start-bot">${langdict[lang]['playbot']}</button>
						<div>
							<label><input type="radio" name="botSide" value="left" checked> ${langdict[lang]['botleft']}</label>
							<label><input type="radio" name="botSide" value="right"> ${langdict[lang]['botright']}</label>
						</div>
					</div>
							<p id="scoreZone"></p>
				</div>
				${canvasHTML}
			</div>`;


}

export function onlineRoom() {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Jeu en Ligne",
            "startgame": "Commencer le jeu",
        },
        "EN": {
            "title": "Local Room",
            "startgame": "Start Game"
		},
        "PT": {
            "title": "Jogo Online",
            "startgame": "Iniciar o jogo"

		}
    }`);
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    return `<div class="container">
				<div>
					<div class="col">
						<h1>${langdict[lang]['title']}</h1>
						<button id="button-start">${langdict[lang]['title']}</button>
						</div>
						<p id="scoreZone"></p>
				</div>
				${canvasHTML}
			</div>`;


}
