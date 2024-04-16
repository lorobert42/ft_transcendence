export default function localRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    return `<div class="container">
				<div> 
				<h1>Local Room</h1>
				<p id="scoreZone"></p>
				</div>
				${canvasHTML}
			</div>`;


}

