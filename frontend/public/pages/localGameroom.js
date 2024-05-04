import { getLang } from "../js/utils/getLang.js";

export default function localRoom() {
    const lang = getLang();

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
    const canvasHTML = `<canvas id="pongCanvas" class="rounded shadow-lg" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    
    return `<div class="container text-center justify-content-center">
				<div class="mb-3">
					<div class="col">
						<h1>${langdict[lang]['title']}</h1>
                        <div id="buttons-container" class="justify-content-between"></div>
					</div>
				</div>
                ${canvasHTML}
			</div>`;


}
