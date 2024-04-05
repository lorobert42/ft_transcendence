export default function loginPage() {
  return `
    <div class="container">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <form id="loginForm">
                    <div class="form-group text-center">
                        <h1>Login</h1>
                    </div>
                    <div class="form-group text-center">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" placeholder="Enter email">
                    </div>
                    <div class="form-group text-center">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password">
                    </div>
                    <div class="form-group text-center">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
                <div class="form-group text-center">
                    <a href="/register">Register</a>
                </div>
            </div>
        </div>
    </div>`;
}
