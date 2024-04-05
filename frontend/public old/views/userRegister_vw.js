export default function(){
    return `
    <div class="container">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <form id="registerForm">
                    <div class="form-group
                    text-center">
                        <h1>Register</h1>
                    </div>
                    <div class="form-group
                    text-center">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" placeholder="Enter email">
                    </div>
                    <div class="form-group
                    text-center">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Enter name">
                    </div>
                    <div class="form-group
                    text-center">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password">
                    </div>
                    <div class="form-group
                    text-center">
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
                <div class="form-group
                text-center">
                    <a href="/login">Login</a>
                </div>
            </div>
        </div>
    </div>`;
}