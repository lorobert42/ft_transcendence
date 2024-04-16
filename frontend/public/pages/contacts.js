export default function contacts() {

    let users = fetch('https://localhost:8080/api/user/users/', {
        mode: "cors",
    }).then(response => response.json())
    .then(data => {
        console.log(data);
        return data;
    })
    .catch((error) => {
        console.error('Failed to fetch users:', error);
    });


    return `
    <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names..">

    <ul id="myUL">
      <li><a href="#">Adele</a></li>
      <li><a href="#">Agnes</a></li>
    
      <li><a href="#">Billy</a></li>
      <li><a href="#">Bob</a></li>
    
      <li><a href="#">Calvin</a></li>
      <li><a href="#">Christina</a></li>
      <li><a href="#">Cindy</a></li>
    </ul>`;
}