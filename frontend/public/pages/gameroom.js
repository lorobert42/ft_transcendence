export default function localRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    return `<div class="container">
				<div>
					<div class="col">
						<h1>Local Room</h1>
						<button id="button-start-human">Play with Friend</button>
						<button id="button-start-bot">Play against Bot</button>
						</div>
						<p id="scoreZone"></p>
				</div>
				${canvasHTML}
			</div>`;


}

export function onlineRoom() {
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

