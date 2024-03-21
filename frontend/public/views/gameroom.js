export default async function GameRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;

    
	const canvasElement = document.createElement('canvas');
	canvasElement.id = 'pongCanvas';
	canvasElement.width = 1000;
	canvasElement.height = 700;
	canvasElement.style.backgroundColor = '#000';
    
    // document.getElementById('app').innerHTML = canvasElement.outerHTML;
	// document.body.appendChild(canvasElement);

    return canvasElement.outerHTML;
}

