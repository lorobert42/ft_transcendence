
export default function onlineRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    return `<div class="container">
				<div>
					<div class="col">
						<h1>Online Room</h1>
						<button id="button-start">Start Game</button>
						</div>
						<p id="scoreZone"></p>
				</div>
				${canvasHTML}
			</div>`;


}
/*
import { getLang } from "../js/utils/getLang.js";

export default function onlineRoom() {
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
            "title": "Online Room",
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


*/

