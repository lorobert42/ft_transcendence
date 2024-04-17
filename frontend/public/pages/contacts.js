export default function contacts() {

    console.log(localStorage.getItem("authToken"));
    let users = fetch('https://localhost:8080/api/user/users/', {
        mode: "cors",
        authToken: localStorage.getItem("authToken"),
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    })
    .catch((error) => {
        console.error('Failed to fetch users:', error);
    });


    return `
    `;
}