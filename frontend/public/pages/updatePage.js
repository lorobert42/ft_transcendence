export default function updatePage() {
    return `
    <div class="row justify-content-center"> 
    <div class="col">
      <h1>User Status Update</h1>
    </div>
  </div>
<form id="updateForm">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" class="form-control" id="email" placeholder="Enter email">
  </div>
  <div class="form-group">
    <label for="nameUpadte">Name</label>
    <input type="text" class="form-control" id="nameUpdate" placeholder="Enter name">
  </div>
  <div class="form-group">
    <label for="avatar">Avatar</label>
    <input type="text" class="form-control" id="avatar" placeholder="Enter avatar URL">
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password" placeholder="Enter password">
  </div>
  <button type="sumbit" class="btn btn-primary">Update</button>
</form>
`;
}