export default function onlineRoom() {
    const cookie = document.cookie.split(";").find((cookie) => cookie.includes("lang"));
    let lang = "EN";
    if (cookie) {
        lang = cookie.split("=")[1];
    }

    let langdict = JSON.parse(`{
        "FR": {
            "title": "Jeu en Ligne",
            "startgame": "Commencer le jeu"
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
    const canvasHTML = `<canvas id="pongCanvas" class="rounded shadow-lg" width="1000" height="700" style="background-color: #000;"></canvas>`;

    
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