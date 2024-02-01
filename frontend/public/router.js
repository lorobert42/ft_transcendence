
const routes = {
    '/': {name: 'Home', view: 'home.js'},
    '/profile': {name: 'Profile', view: 'profile.js'},
    '/gameroom': {name: 'Game Room', view: 'gameroom.js'}
}

//load view function
async function loadView(view){
    try {
        const { default: View } = await import(`./views/${view}`);
        return View();
    } catch (error) {
        console.log(error);
        return `<h1>404 Page not Found</h1>`;
    }
}

async function router()
{
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];
    const content = await loadView(route.view);
    document.getElementById('app').innerHTML = content;
}

export function setupListener(){
    window.addEventListener('popstate', router);
    
    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                history.pushState(null, '', e.target.href);
                router();
            }
        });
        router();
    });
}