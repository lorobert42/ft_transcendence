// gameroom.js
export default async function GameRoom() {
    // Create the game room content with a canvas for Pong
    const canvasHTML = `<canvas id="pongCanvas" width="1000" height="700" style="background-color: #000;"></canvas>`;

    // Add the canvas to the DOM
    document.getElementById('app').innerHTML = canvasHTML;

    // Ensure canvas is in DOM, then dynamically import pong.js and initialize the game
    await import('../pong.js').then(module => {
        module.initPongGame();
    }).catch(error => {
        console.error('Failed to load pong game script:', error);
    });
}
