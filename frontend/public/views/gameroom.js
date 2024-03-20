export default async function GameRoom() {
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;

    //document.getElementById('app').innerHTML = canvasHTML;

	const canvasElement = document.createElement('canvas');
	canvasElement.id = 'pongCanvas';
	canvasElement.width = 1000;
	canvasElement.height = 500;
	canvasElement.style.backgroundColor = '#000';

	document.body.appendChild(canvasElement);
	

	await import('../pong.js').then(module => {
        module.initPongGame();
    }).catch(error => {
        console.error('Failed to load pong game script:', error);
    });
}

