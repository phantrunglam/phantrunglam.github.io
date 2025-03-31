document.getElementById("helpBtn").onclick = function() {
    document.getElementById("helpModal").style.display = "block";
};

document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById("helpModal").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("helpModal")) {
        document.getElementById("helpModal").style.display = "none";
    }
};