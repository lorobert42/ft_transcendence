
export function isLoggedIn() {
    let isLogged = localStorage.getItem('authToken') !== null && localStorage.getItem('authToken') !== undefined;
    if(!isLogged) {
        return {'value': false};
    }
    let ret = {value:false, avatarURL:''};
    fetch('api/user/me/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': 'Token ' + localStorage.getItem('authToken')
    }})
    .then(response => {
        if(!response.ok){
            throw new Error('User Not Logged In');
        }
        return response.json();
    })
    .then(data => {
        ret.value = true
        ret.avatarURL = 'https://tenor.com/view/raccoon-ayasan-gif-24417811';
    })
    .catch(error => {
        console.log(error);
        return false;
    });
    return ret;
}

