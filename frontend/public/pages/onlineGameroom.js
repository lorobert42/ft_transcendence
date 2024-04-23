
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

