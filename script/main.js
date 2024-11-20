document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.querySelector("#intro_video video");
  const replayButton = document.getElementById("replayButton");

  let hasPlayedOnce = false;

  // 비디오 무음 설정 및 자동 재생
  videoElement.muted = true;
  videoElement.play()
    .then(() => {
      hasPlayedOnce = true;
    })
    .catch((error) => {
      console.error("Video play failed:", error);
    });

  // Intersection Observer 설정
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          // 비디오가 화면에서 벗어날 때
          videoElement.pause();
          if (!isNaN(videoElement.duration)) {
            videoElement.currentTime = videoElement.duration;
          }
          replayButton.style.display = "block";
        } else {
          // 비디오가 화면에 다시 들어올 때
          replayButton.style.display = "none";
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(document.querySelector("#intro_video"));

  // 리플레이 버튼 클릭 이벤트
  replayButton.addEventListener("click", () => {
    videoElement.currentTime = 0;
    videoElement.play();
    replayButton.style.display = "none";
  });
});




// triger
document.addEventListener("DOMContentLoaded", () => {
    const triggerText = document.querySelectorAll(".trigger_intro .trigger_text p");

    // Intersection Observer 생성
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerText.forEach((p, index) => {
                    setTimeout(() => {
                        p.classList.add("show");
                    }, index * 300); // 순차적으로 나타나도록 딜레이 설정
                });
            } else {
                // 섹션이 보이지 않으면 다시 초기화 (원한다면 제거 가능)
                triggerText.forEach(p => {
                    p.classList.remove("show");
                });
            }
        });
    }, { threshold: 0.5 }); // 섹션이 50% 보이면 애니메이션 시작

    // .trigger_intro 섹션 감시
    const triggerIntroSection = document.querySelector(".trigger_intro");
    observer.observe(triggerIntroSection);
});

//trigger_img 
document.addEventListener('DOMContentLoaded', () => {
    const triggerMain = document.querySelector('.trigger_main');
    const triCon = document.querySelector('.tri_con'); // tri_con 섹션
    const triIntro = document.querySelector('.trigger_intro'); // trigger_intro 섹션
    const imgContainers = document.querySelectorAll('.tri_img_container div');
    const textContainers = document.querySelectorAll('.tri_text_containter div');
    let currentIndex = 0;
    let isScrolling = false;
    let isActive = false;
    let hasReset = false; // 이미지 리셋 여부를 추적하는 플래그
  
    // 이미지 및 텍스트 변경 함수
    const changeImage = (index) => {
      imgContainers.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
          img.classList.add('active');
        }
      });
  
      textContainers.forEach((text, i) => {
        text.classList.remove('active');
        if (i === index) {
          text.classList.add('active');
        }
      });
    };
  
    // 기본 스크롤 이벤트 방지
    const preventScroll = (e) => {
      if (isActive) { // 섹션이 활성화된 상태일 때만 스크롤 방지
        e.preventDefault();
      }
    };
  
    // 스크롤 이벤트 처리 함수
    const onScroll = (e) => {
      if (!isActive || isScrolling) return;
  
      const deltaY = e.deltaY;
  
      // 첫 번째 이미지에서 위로 스크롤 허용
      if (currentIndex === 0 && deltaY < 0) {
        // 이전 섹션으로 이동
        window.removeEventListener('wheel', onScroll);
        window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        setTimeout(() => {
          window.addEventListener('wheel', onScroll, { passive: false });
        }, 500);
        return;
      }
  
      // 네 번째 이미지에서 아래로 스크롤 허용
      if (currentIndex === imgContainers.length - 1 && deltaY > 0) {
        // 다음 섹션으로 이동
        window.removeEventListener('wheel', onScroll);
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        setTimeout(() => {
          window.addEventListener('wheel', onScroll, { passive: false });
        }, 500);
        return;
      }
  
      // 스크롤 애니메이션을 위한 로직
      isScrolling = true;
      setTimeout(() => {
        isScrolling = false;
      }, 500);
  
      if (deltaY > 0 && currentIndex < imgContainers.length - 1) {
        currentIndex++;
      } else if (deltaY < 0 && currentIndex > 0) {
        currentIndex--;
      }
  
      changeImage(currentIndex);
    };
  
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isActive = true;
  
          // 섹션으로 처음 진입 시 한 번만 이미지 리셋
          if (!hasReset) {
            changeImage(0);
            hasReset = true; // 한 번 리셋되었음을 표시
          }
  
          // 자연스럽게 섹션이 화면에 맞춰지도록 스크롤 조정
          entry.target.scrollIntoView({ behavior: 'smooth' });
          // 기본 스크롤 동작 방지 활성화
          window.addEventListener('wheel', preventScroll, { passive: false });
        } else {
          isActive = false;
          // 기본 스크롤 동작 방지 비활성화
          window.removeEventListener('wheel', preventScroll);
        }
      });
    }, { threshold: .3 });
  
    observer.observe(triggerMain);
    window.addEventListener('wheel', onScroll, { passive: false });
  });
  
  // tri_con animation
  document.addEventListener('scroll', () => {
    const triggerCon = document.querySelector('.trigger_con');
    const text0 = triggerCon.querySelector('.tri_con_text0');
    const text = triggerCon.querySelector('.tri_con_text');

    const rect = triggerCon.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        if (!text0.classList.contains('animate')) {
            text0.classList.add('animate');
        }
        if (!text.classList.contains('animate')) {
            text.classList.add('animate');
        }
    } else {
        text0.classList.remove('animate');
        text.classList.remove('animate');
    }
});

// music_img
document.addEventListener('DOMContentLoaded', () => {
  const musicLottie = document.getElementById('musicLottie');
  const observerTarget = document.querySelector('.music_img_container');

  if (observerTarget) {
      const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  console.log('Lottie 애니메이션이 화면에 보이기 시작 - 애니메이션 재시작');

                  // Lottie 애니메이션 보이게 하고 재시작
                  musicLottie.style.display = 'block';
                  musicLottie.stop(); // 중지 후
                  musicLottie.play(); // 재생

                  // 텍스트 애니메이션 초기화
                  document.querySelectorAll('.text_box p').forEach(text => {
                      text.classList.remove('show');
                  });

                  // Lottie 애니메이션이 끝나면 텍스트 애니메이션 시작
                  musicLottie.addEventListener('complete', () => {
                      document.querySelectorAll('.text_box p').forEach((text, index) => {
                          setTimeout(() => {
                              text.classList.add('show');
                          }, index * 500); // 텍스트 간의 지연 시간 조절
                      });
                  }, { once: true }); // 이벤트 리스너가 한 번만 실행되도록 설정
              } else {
                  console.log('섹션이 화면에서 벗어남 - Lottie 애니메이션 숨김');
                  
                  // 섹션이 화면에서 벗어나면 Lottie 애니메이션 숨김
                  musicLottie.style.display = 'none';

                  // 화면에서 벗어났을 때 텍스트 애니메이션 초기화
                  document.querySelectorAll('.text_box p').forEach(text => {
                      text.classList.remove('show');
                  });
              }
          });
      }, { threshold: 0.1 }); // 20% 이상 보일 때 트리거

      observer.observe(observerTarget);
  } else {
      console.warn('옵저버 대상이 발견되지 않음');
  }
});



// main button link
document.addEventListener('scroll', () => {
  const container = document.querySelector('.click_main_link');
  const title = container.querySelector('.click_title');
  const textParagraphs = container.querySelectorAll('.click_text p');
  const button = container.querySelector('.link_button');

  const rect = container.getBoundingClientRect();
  if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 2) {
    // 텍스트 애니메이션 트리거
    title.classList.add('animate');
    textParagraphs.forEach((p, index) => {
      p.classList.add('animate');
    });

    // 마지막 텍스트 애니메이션이 끝난 후 버튼 애니메이션 시작
    const lastParagraph = textParagraphs[textParagraphs.length - 1];
    lastParagraph.addEventListener('transitionend', () => {
      button.classList.add('animate');
    }, { once: true });
  } else {
    // 섹션이 뷰포트 밖으로 나가면 초기 상태로 복귀
    title.classList.remove('animate');
    textParagraphs.forEach((p) => {
      p.classList.remove('animate');
    });
    button.classList.remove('animate');
  }
});

// con_text
const bodyTextObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const paragraphs = entry.target.querySelectorAll("p");
        paragraphs.forEach((paragraph, index) => {
          setTimeout(() => {
            paragraph.classList.add("visible");
          }, index * 500); // 순차적으로 애니메이션 시작
        });

        setTimeout(() => {
          const conText = entry.target.nextElementSibling;
          if (conText && conText.classList.contains("con_text")) {
            conText.classList.add("visible");
          }
        }, paragraphs.length * 500);
      } else {
        entry.target.querySelectorAll("p").forEach((paragraph) => {
          paragraph.classList.remove("visible");
        });
        const conText = entry.target.nextElementSibling;
        if (conText && conText.classList.contains("con_text")) {
          conText.classList.remove("visible");
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".body_text").forEach((bodyText) => {
  bodyTextObserver.observe(bodyText);
});

// strategy ani
const observerOptions = {
  threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target.querySelector(".st_img_01");
      const text1 = entry.target.querySelector(".st_text_01");
      const text2 = entry.target.querySelector(".st_text_02");

      img.classList.add("visible");
      setTimeout(() => text1.classList.add("visible"), 200); // `st_img_01` 이후
      setTimeout(() => text2.classList.add("visible"), 400); // `st_text_01` 이후
    } else {
      entry.target.querySelector(".st_img_01").classList.remove("visible");
      entry.target.querySelector(".st_text_01").classList.remove("visible");
      entry.target.querySelector(".st_text_02").classList.remove("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".strategy").forEach((section) => {
  observer.observe(section);
});

//로띠_motif
document.addEventListener("DOMContentLoaded", function() {
  const lottiePlayer = document.querySelector(".motif_ex_img dotlottie-player");

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              lottiePlayer.stop(); // 현재 애니메이션을 멈춘 후
              lottiePlayer.play(); // 다시 재생하여 처음부터 시작되도록 설정
          }
      });
  }, { threshold: 0.2 }); // 50% 이상 보일 때 감지

  observer.observe(document.querySelector(".motif_ex"));
});

document.addEventListener("DOMContentLoaded", function() {
  const lottiePlayers = document.querySelectorAll("dotlottie-player");

  lottiePlayers.forEach(player => {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  player.stop();
                  player.play();
              }
          });
      }, { threshold: 0.1});

      observer.observe(player.closest("section"));
  });
});









  
  
  




