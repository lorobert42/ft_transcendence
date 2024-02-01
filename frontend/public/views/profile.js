export default function(){
    return `
    <div class="text-center mt-5">
        <h2>User Profile</h2>
        <p>Welcome to your profile page!</p>
    </div>
    <div class="container mt-4">
        <div class="row">
            <!-- Profile Image -->
            <div class="col-md-4">
                <div class="card">
                    <img src="path_to_profile_image.jpg" class="card-img-top" alt="Profile Image">
                    <div class="card-body">
                        <h5 class="card-title">User Name</h5>
                        <p class="card-text">Brief info about the user.</p>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">About Me</h5>
                        <p class="card-text">Detailed information about the user.</p>

                        <!-- More details or a form can go here -->
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}