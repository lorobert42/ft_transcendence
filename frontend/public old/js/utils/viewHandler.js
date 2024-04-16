//load view function
export async function loadView(view){
    try {
        const { default: View } = await import(`../../views/${view}`);
        return View();
    } catch (error) {
        console.log(error);
        return `<h1>404 Page not Found</h1>`;
    }
}