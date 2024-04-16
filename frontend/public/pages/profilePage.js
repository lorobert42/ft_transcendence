export default function profilePage() {
  return `
    <div class="container">
                <div class="row">
                    <div class="col-md-4 offset-md-4">
                    <div id="profileContainer">
                    <h1>User Profile</h1>
                    <img id="avatar" src="placeholder.jpg" alt="User Avatar" style="width: 100px; height: 100px;">
                    <p>Name: <span id="userName">Loading...</span></p>
                    <p>Email: <span id="userEmail">Loading...</span></p>
                </div>

            </div>
        </div>
    </div>`;
}
