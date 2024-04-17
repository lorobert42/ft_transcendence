export default function contacts() {
    return `
    <div class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <h2>Add Friend</h2>
        <input type="text" id="user-search" class="form-control mb-3" placeholder="Search User...">
        <ul id="user-list" class="list-group">
      </div>
      <div class="col-md-6">
        <h2>Friend List</h2>
        <input type="text" id="friend-search" class="form-control mb-3" placeholder="Search friend...">
        <ul id="friend-list" class="list-group">
        </ul>
      </div>
    </div>
  </div>
    `;
}