export default function(){
    fetch('/api/user/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('authToken'),
        },
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let usersDiv = document.getElementById('userList');
        usersDiv.innerHTML = '';
        data.forEach(user => {
            usersDiv.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${user.name}</h5>
                    <p class="card-text">${user.email}</p>
                </div>
            </div>
            `;
        });
    })
    .catch(error => {
        console.log(error);
    });
}
