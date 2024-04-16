export default function() {
    let el = document.getElementById('registerForm');
    if(el === null){
        return;
    }
    el.addEventListener("submit", function(event){
        event.preventDefault();
        let user = { 
            "email" : document.getElementById("email").value,
            "password" : document.getElementById("password").value,
            "name" : document.getElementById("name").value
        };
        fetch('/api/user/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = '/';
        })
        .catch(error => {
            console.log(error);
            window.location.href = '/';
        })
    });
}