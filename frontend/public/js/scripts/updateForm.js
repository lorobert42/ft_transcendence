export function updateForm() {
    const form = document.getElementById("updateForm");


    console.log("in update form");


    async function updateUser(name) {

        let authToken = localStorage.getItem("authToken");
        let response = await fetch("/api/user/add-friend/", {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authToken}`, // Use the appropriate header according to your backend's auth scheme
              "Content-Type": "application/json",
            },
            body: `{
                "email": "user@example.com",
                "name": "string",
                "avatar": "string",
                "password": "string",
                "last_active": "2024-04-17T14:39:52.091Z"
              }`,
          }).then((response) => {
            if (response.status === 401) {
              console.error("Unauthorized");
            }
            return response.json();
          }).then((data) => {
            return data;
          }).catch((error) => {
            console.error("Error:", error);
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("nameUpdate").value;
        console.log(name);
        updateUser(name);
    });
}