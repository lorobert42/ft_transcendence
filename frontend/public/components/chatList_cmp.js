export default function()
{
    return `
    <div class="d-flex md-3 flex-column flex-grow-1">
        <div class="p-2 bd-highlight flex-row">
            <input class="p-0" type="text" placeholder="Search..">
            <button id="createUser" class="btn btn-primary">Create User</button>
        </div>
        <div class="overflow-auto">
            <ul id="userList" class="list-group">
            </ul>
        </div>
    </div>
    `;
}