document.addEventListener("DOMContentLoaded", function () {
    const gallerySlides = document.getElementById("gallery_slides");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const closeLightbox = document.getElementById("closeLightbox");

    let currentIndex = 0;
    let mediaList = [];

    // Fetch media data
    fetch("/scripts/media_list.json")
        .then(response => response.json())
        .then(data => {
            mediaList = data;
            loadGallery();
        })
        .catch(error => console.error("Error loading media list:", error));

    function loadGallery() {
        gallerySlides.innerHTML = "";
        const basePath = "/"; // Đường dẫn tuyệt đối đến thư mục resources
        mediaList.forEach((media, index) => {
            let img = document.createElement("img");
            img.src = basePath + media.media_thumbnail;
            img.alt = media.media_name;
            img.classList.add("gallery-image");
            img.dataset.index = index;
            img.addEventListener("click", openLightbox);
            gallerySlides.appendChild(img);
        });
    }

    function openLightbox(event) {
        currentIndex = event.target.dataset.index;
        lightboxImage.src = "/" + mediaList[currentIndex].media_path;
        lightbox.style.display = "flex";
    }

    function closeLightboxHandler() {
        lightbox.style.display = "none";
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % mediaList.length;
        lightboxImage.src = mediaList[currentIndex].media_path;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
        lightboxImage.src = mediaList[currentIndex].media_path;
    }

    closeLightbox.addEventListener("click", closeLightboxHandler);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightboxHandler();
        }
    });
});
