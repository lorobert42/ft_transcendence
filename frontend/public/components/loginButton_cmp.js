import { isLoggedIn } from "../js/utils/loginHandler";

function connected(avatarURL){
    return `
    <a href="/profile" class="d-inline-block">
        <img src="${avatarURL}" class="rounded-circle" style="width: 40px; height: 40px;" alt="Profile">
    </a>`;
}

function notConnected(){
    return `
    <a href="/login" class="d-inline-block">
        <button class="btn btn-primary">Login</button>
    </a>`;
}


export function loadButton() {
    let { isLogged, avatarURL } = isLoggedIn();
    if(isLogged){
        return connected(avatarURL);
    } else {
        return notConnected();
    }
}