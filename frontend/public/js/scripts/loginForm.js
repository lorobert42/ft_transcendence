export default function() {
    document.getElementById("loginForm").addEventListener("submit", function(event){
        event.preventDefault();
        let user = { 
            "email" : document.getElementById("email").value,
            "password" : document.getElementById("password").value
        };
        fetch('/api/user/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("authToken", data.token);
            window.location.href = '/';
        })
        .catch(error => {
            console.log(error);
        });
    });
}