import { pageRouting } from './js/htmlConcat.js';



function orderedRouting(){
    pageRouting();

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