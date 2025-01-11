const imageColumns = document.querySelectorAll('.image_column');
const outerWrapper = document.querySelector('.outer_wrapper'); 
const textContainers = document.querySelectorAll('.third_column > div'); 
const numberImages = document.querySelectorAll('.number_img');
const fourthColumnTexts = document.querySelectorAll('.fourth_column > div'); 

function handleScroll(column) {
    const scrollTop = column.scrollTop; 
    const viewportHeight = window.innerHeight; 
    const images = column.querySelectorAll('.scroll_image');

    let closestImage = null;
    let closestDistance = Infinity;
    let selectedIndex = 0;

   
    const lastImageIndex = images.length - 1;

    
    images.forEach((img, index) => {
        img.classList.remove('selected');

        const imageRect = img.getBoundingClientRect();
        const imageCenter = imageRect.top + imageRect.height / 2;

        
        const distance = Math.abs(viewportHeight / 2 - imageCenter);

        if (distance < closestDistance && index < lastImageIndex) {
            closestImage = img;
            closestDistance = distance;
            selectedIndex = index;
        }
    });

   
    if (closestImage) {
        closestImage.classList.add('selected');

        
        textContainers.forEach((textContainer) => {
            textContainer.style.display = 'none'; 
        });
        numberImages.forEach((numImg) => {
            numImg.style.display = 'none';
        });

       
        if (textContainers[selectedIndex]) {
            textContainers[selectedIndex].style.display = 'block';
        }
        if (numberImages[selectedIndex]) {
            numberImages[selectedIndex].style.display = 'block'; 
        }

        
        fourthColumnTexts.forEach((fourthText, index) => {
            fourthText.style.display = (index === selectedIndex) ? 'block' : 'none';
        });

        const selectedImageRect = closestImage.getBoundingClientRect();
        const selectedImageCenter = selectedImageRect.top + selectedImageRect.height / 2;

        
        let offset = selectedImageCenter - viewportHeight / 2;
        let newScrollTop = scrollTop + offset;

        column.scrollTo({ top: newScrollTop, behavior: 'smooth' });

        
        console.log(`Selected image index: ${selectedIndex}`);
    }
}


function debounceScroll(callback, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
    };
}


imageColumns.forEach((column) => {
    column.addEventListener('scroll', debounceScroll(() => {
        handleScroll(column);
    }, 100)); 
});


imageColumns.forEach((column) => {
    const firstImage = column.querySelector('.scroll_image');
    if (firstImage) {
        firstImage.classList.add('selected');
        const firstImageRect = firstImage.getBoundingClientRect();
        const firstImageCenter = firstImageRect.top + firstImageRect.height / 2;

        
        const offset = firstImageCenter - window.innerHeight / 2;
        const newScrollTop = column.scrollTop + offset;

        column.scrollTo({ top: newScrollTop, behavior: 'smooth' });

       
        textContainers.forEach((textContainer, index) => {
            textContainer.style.display = (index === 0) ? 'block' : 'none';
        });
        numberImages.forEach((numImg, index) => {
            numImg.style.display = (index === 0) ? 'block' : 'none';
        });
        
        fourthColumnTexts.forEach((fourthText, index) => {
            fourthText.style.display = (index === 0) ? 'block' : 'none';
        });

        console.log(`Selected image index: 0`);
    }
});

// click img animation

document.addEventListener("DOMContentLoaded", function() { 
    const imageColumns = document.querySelector('.image_column');
    const scrollImages = document.querySelectorAll('.scroll_image');
    const videoElement = document.querySelector('.video');
    let currentAudio = null;

   
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                const audioSrc = entry.target.getAttribute('data-audio');
                
                
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                
                
                currentAudio = new Audio(audioSrc);
                currentAudio.play();
            }
        });
    }, {
        root: imageColumns,
        threshold: 0.5 
    });

    
    scrollImages.forEach((img) => {
        observer.observe(img);

        
        img.addEventListener("click", function() {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        });
    });

    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null; 
                }
            }
        });
    }, {
        threshold: 0.5 
    });

   
    videoObserver.observe(videoElement);
});



// loading animation
document.addEventListener("DOMContentLoaded", function() { 
    const mainSelectSection = document.getElementById("select"); 
    const loadingSection = document.getElementById("loading");
    const selected01Container = document.querySelector(".selected_01");
    const selected02Container = document.querySelector(".selected_02");
    const loadingAnimation = document.querySelector(".loading_ani dotlottie-player");
    const loadingText = document.querySelector(".loading_text");
    const videoElement = document.querySelector(".video");
    const videos = document.querySelectorAll('.video_item');
    const videoTextContainers = document.querySelectorAll('.video_text_container_01, .video_text_container_02, .video_text_container_03, .video_text_container_04');
    const replayButton = document.querySelector('.replay_button');
    const scrollImages = document.querySelectorAll('.scroll_image');
    let selectedVideoIndex = null;

    scrollImages.forEach((img, index) => {
        img.addEventListener("click", function() {
            const selectedImageSrc = img.getAttribute('src');
            const selectedImageBaseName = selectedImageSrc.substring(selectedImageSrc.lastIndexOf('/') + 1, selectedImageSrc.lastIndexOf('.'));

            selected01Container.innerHTML = `<img src="${selectedImageSrc}" alt="">`;
            selected02Container.innerHTML = `<img src="/sources/img/${selectedImageBaseName}_1.png" alt="">`;

            setTimeout(function() {
                mainSelectSection.style.display = "none"; 
                loadingSection.style.display = "flex";

                const selected01Img = selected01Container.querySelector("img");
                const selected02Img = selected02Container.querySelector("img");

                selected01Img.classList.add("fade-out");

                setTimeout(function() {
                    selected02Img.classList.add("grow-back");

                    setTimeout(function() {
                        loadingAnimation.style.opacity = "1";
                        loadingAnimation.play();

                        setTimeout(function() {
                            loadingText.style.opacity = "1";

                            setTimeout(function() {
                                selectedVideoIndex = index;
                                videoElement.style.display = "flex";
                                videoElement.classList.remove("slide-in"); 
                                void videoElement.offsetWidth;
                                videoElement.classList.add("slide-in"); 
                                showSelectedVideo();
                                showSelectedTextContainer();
                            }, 2000); 

                        }, 600);

                    }, 500);

                }, 400);
            }, 200);
        });
    });

    function showSelectedVideo() {
        replayButton.classList.remove("show"); 

        videos.forEach((video) => {
            video.pause();
            video.currentTime = 0;
            video.classList.add("hidden");
            video.classList.remove("show");
        });

        const selectedVideo = videos[selectedVideoIndex];
        selectedVideo.classList.remove("hidden");
        selectedVideo.classList.add("show");
        selectedVideo.muted = false; 
        selectedVideo.play();

       
        selectedVideo.onended = function() {
            replayButton.classList.add("show");
        };
    }

    function showSelectedTextContainer() {
        videoTextContainers.forEach((container, index) => {
            container.classList.remove("show");
            container.style.display = "none";
    
            if (index === selectedVideoIndex) {
                container.classList.add("show");
                container.style.display = "flex";
            }
        });
    }

    replayButton.addEventListener("click", function() {
        replayButton.classList.remove("show");
        const selectedVideo = videos[selectedVideoIndex];
        selectedVideo.play();
    });
});

function slideOutVideo() {
    const videoElement = document.querySelector(".video");
    const loadingSection = document.getElementById("loading");
    const mainSelectSection = document.getElementById("select");
    const selected01Container = document.querySelector(".selected_01");
    const selected02Container = document.querySelector(".selected_02");
    const loadingAnimation = document.querySelector(".loading_ani dotlottie-player");
    const loadingText = document.querySelector(".loading_text");
    const videos = document.querySelectorAll('.video_item');

    videos.forEach((video) => {
        video.pause();
        video.currentTime = 0;
    });

    videoElement.classList.remove("slide-in");
    videoElement.classList.add("slide-out");

    loadingAnimation.style.opacity = "0";
    loadingText.style.opacity = "0";
    loadingAnimation.stop();

    setTimeout(() => {
        videoElement.style.display = "none";
        videoElement.classList.remove("slide-out");
        mainSelectSection.style.display = "block";
        loadingSection.style.display = "none";

        selected01Container.innerHTML = '';
        selected02Container.innerHTML = '';
        
        videos.forEach((video) => {
            video.classList.add("hidden");
            video.classList.remove("show");
        });
    }, 1000);
}


// index 호출
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.hash === "#click_main_link") {
        const targetSection = document.querySelector(".click_main_link");
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
    }
});






