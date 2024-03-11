import { loadView } from './utils/viewHandler.js';
import { routes } from './routes.js';

export async function pageRouting()
{
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];
    const content = await loadView(route.view);
    document.getElementById('app').innerHTML = content;
    for(const feature of route.features){
        const { default : feature_function } = await import(`./js/scripts/${feature}`);
        feature_function();
    }
}