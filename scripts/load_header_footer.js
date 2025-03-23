document.addEventListener("DOMContentLoaded", function() {
    let pathToRoot = "";
    let currentPath = window.location.pathname;
    let depth = (currentPath.split("/").length - 3); // Điều chỉnh tính toán

    for (let i = 0; i < depth; i++) {
        pathToRoot += "../";
    }

    console.log("Computed pathToRoot:", pathToRoot); // Debug đường dẫn

    fetch(pathToRoot + "header.html")
        .then(response => {
            if (!response.ok) throw new Error("Header not found");
            return response.text();
        })
        .then(data => document.getElementById("header").innerHTML = data)
        .catch(error => console.error("Error loading header:", error));

    fetch(pathToRoot + "footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Footer not found");
            return response.text();
        })
        .then(data => document.getElementById("footer").innerHTML = data)
        .catch(error => console.error("Error loading footer:", error));
});
