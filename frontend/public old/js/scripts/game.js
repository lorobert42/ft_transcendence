export default async function()
{
    await import('../../pong.js').then(module => {
        module.initPongGame();
    }).catch(error => {
        console.error('Failed to load pong game script:', error);
    });
}