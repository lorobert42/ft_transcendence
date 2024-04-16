export default function localRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    return `<div class="container">
						${canvasHTML}
			</div>`;


}

