import { pageRouting } from './js/htmlConcat.js';



function orderedRouting(){
    cleanupPreviousView();
    pageRouting();
}

function cleanupPreviousView() {
    console.log("Router called, path: " + window.location.pathname);

	const canvas = document.getElementById('pongCanvas');
    if (canvas) {
        console.log("Removing canvas");
        canvas.parentNode.removeChild(canvas);
    } else {
        console.log("No canvas found to remove");
    }
}

export function setupListener(){
    window.addEventListener('popstate', pageRouting);
    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                console.log(e.target.href);
                history.pushState(null, '', e.target.href);
                orderedRouting();
            }
        }); 
        orderedRouting();
    });
}
