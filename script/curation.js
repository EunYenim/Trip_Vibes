const imageColumns = document.querySelectorAll('.image_column');
const outerWrapper = document.querySelector('.outer_wrapper'); 
const textContainers = document.querySelectorAll('.third_column > div'); // 텍스트 컨테이너 선택
const numberImages = document.querySelectorAll('.number_img'); // 넘버 이미지 선택
const fourthColumnTexts = document.querySelectorAll('.fourth_column > div'); // fourth_column 텍스트 선택

function handleScroll(column) {
    const scrollTop = column.scrollTop; // 현재 스크롤 위치
    const viewportHeight = window.innerHeight; // 뷰포트 높이
    const images = column.querySelectorAll('.scroll_image');

    let closestImage = null;
    let closestDistance = Infinity;
    let selectedIndex = 0;

    // 마지막 이미지를 선택하지 않도록 제한
    const lastImageIndex = images.length - 1;

    // 모든 이미지에서 selected 클래스 제거
    images.forEach((img, index) => {
        img.classList.remove('selected');

        const imageRect = img.getBoundingClientRect();
        const imageCenter = imageRect.top + imageRect.height / 2;

        // 뷰포트 중앙과 이미지 중앙 간의 거리 계산
        const distance = Math.abs(viewportHeight / 2 - imageCenter);

        if (distance < closestDistance && index < lastImageIndex) { // 마지막 이미지는 제외
            closestImage = img;
            closestDistance = distance;
            selectedIndex = index;
        }
    });

    // 선택된 이미지에 selected 클래스 추가
    if (closestImage) {
        closestImage.classList.add('selected');

        // 모든 텍스트 및 넘버 이미지 숨김 처리
        textContainers.forEach((textContainer) => {
            textContainer.style.display = 'none'; // 텍스트 숨기기
        });
        numberImages.forEach((numImg) => {
            numImg.style.display = 'none'; // 넘버 이미지 숨기기
        });

        // 선택된 이미지에 해당하는 텍스트 및 넘버 이미지 표시
        if (textContainers[selectedIndex]) {
            textContainers[selectedIndex].style.display = 'block';
        }
        if (numberImages[selectedIndex]) {
            numberImages[selectedIndex].style.display = 'block'; // 넘버 이미지 표시
        }

        // fourth_column 텍스트 업데이트: 선택된 인덱스에 맞는 텍스트만 표시
        fourthColumnTexts.forEach((fourthText, index) => {
            fourthText.style.display = (index === selectedIndex) ? 'block' : 'none';
        });

        const selectedImageRect = closestImage.getBoundingClientRect();
        const selectedImageCenter = selectedImageRect.top + selectedImageRect.height / 2;

        // 선택된 이미지의 중앙을 뷰포트의 중앙에 맞추기
        let offset = selectedImageCenter - viewportHeight / 2;
        let newScrollTop = scrollTop + offset;

        column.scrollTo({ top: newScrollTop, behavior: 'smooth' });

        // 선택된 이미지의 인덱스를 콘솔에 출력
        console.log(`Selected image index: ${selectedIndex}`);
    }
}

// 디바운스 함수: 이벤트가 지나치게 자주 발생하지 않도록 제한
function debounceScroll(callback, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
    };
}

// 각 이미지 컬럼에 스크롤 이벤트 리스너 추가
imageColumns.forEach((column) => {
    column.addEventListener('scroll', debounceScroll(() => {
        handleScroll(column);
    }, 100)); // 100ms로 디바운스 적용
});

// 페이지 시작 시 첫 번째 이미지 선택
imageColumns.forEach((column) => {
    const firstImage = column.querySelector('.scroll_image');
    if (firstImage) {
        firstImage.classList.add('selected');
        const firstImageRect = firstImage.getBoundingClientRect();
        const firstImageCenter = firstImageRect.top + firstImageRect.height / 2;

        // 첫 번째 이미지의 중앙을 뷰포트의 중앙에 맞추기
        const offset = firstImageCenter - window.innerHeight / 2;
        const newScrollTop = column.scrollTop + offset;

        column.scrollTo({ top: newScrollTop, behavior: 'smooth' });

        // 첫 번째 이미지에 맞는 텍스트 및 넘버 이미지 표시
        textContainers.forEach((textContainer, index) => {
            textContainer.style.display = (index === 0) ? 'block' : 'none';
        });
        numberImages.forEach((numImg, index) => {
            numImg.style.display = (index === 0) ? 'block' : 'none';
        });
        // 첫 번째 이미지에 맞는 fourth_column 텍스트 표시
        fourthColumnTexts.forEach((fourthText, index) => {
            fourthText.style.display = (index === 0) ? 'block' : 'none';
        });

        console.log(`Selected image index: 0`); // 첫 번째 이미지 인덱스 출력
    }
});

// click img animation

document.addEventListener("DOMContentLoaded", function() { 
    const imageColumns = document.querySelector('.image_column');
    const scrollImages = document.querySelectorAll('.scroll_image');
    const videoElement = document.querySelector('.video');
    let currentAudio = null;

    // Intersection Observer 설정 (이미지 중앙에 올 때마다 오디오 재생)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 화면 중앙에 보이는 이미지에 대한 오디오 파일 재생
                const audioSrc = entry.target.getAttribute('data-audio');
                
                // 이전 오디오 정지
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                
                // 새로운 오디오 파일 재생
                currentAudio = new Audio(audioSrc);
                currentAudio.play();
            }
        });
    }, {
        root: imageColumns,
        threshold: 0.5 // 이미지가 50% 이상 중앙에 위치할 때 트리거
    });

    // 각 이미지에 대해 observer 연결
    scrollImages.forEach((img) => {
        observer.observe(img);

        // 이미지 클릭 시 현재 오디오 멈춤
        img.addEventListener("click", function() {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        });
    });

    // 비디오 div가 화면에 보일 때 음악 재생 중단
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 비디오 div가 뷰포트에 들어오면 현재 재생 중인 오디오 중단
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null; // 오디오 참조 해제
                }
            }
        });
    }, {
        threshold: 0.5 // 비디오 div가 50% 이상 보일 때 트리거
    });

    // 비디오 div에 observer 연결
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
        replayButton.classList.remove("show"); // 영상 시작 시 리플레이 버튼 숨기기

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

        // 영상이 끝나야 리플레이 버튼 표시
        selectedVideo.onended = function() {
            replayButton.classList.add("show");
        };
    }

    function showSelectedTextContainer() {
        videoTextContainers.forEach((container, index) => {
            container.classList.remove("show");
            container.style.display = "none"; // 숨긴 요소는 자리 차지하지 않음
    
            if (index === selectedVideoIndex) {
                container.classList.add("show");
                container.style.display = "flex"; // 활성화된 요소만 표시
            }
        });
    }

    replayButton.addEventListener("click", function() {
        replayButton.classList.remove("show"); // 재생 시작 시 리플레이 버튼 숨기기
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





