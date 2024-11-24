document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("#videoElement");
  const replayButton = document.querySelector("#replayButton");

  // 비디오 무음 설정 및 자동 재생 시도
  videoElement.muted = true; // 초기 무음 설정
  videoElement.play()
    .then(() => {
      console.log("Video is playing automatically.");
    })
    .catch((error) => {
      console.error("Automatic play failed:", error);
      replayButton.style.display = "block"; // 자동 재생 실패 시 리플레이 버튼 표시
    });

  // 비디오 메타데이터가 로드된 후 실행
  videoElement.addEventListener("loadedmetadata", () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            videoElement.pause();
            if (!isNaN(videoElement.duration)) {
              videoElement.currentTime = videoElement.duration; // 끝난 상태로 설정
            }
            replayButton.style.display = "block"; // 리플레이 버튼 표시
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(document.querySelector("#intro_video"));
  });

  // 비디오가 종료되었을 때 리플레이 버튼 표시
  videoElement.addEventListener("ended", () => {
    replayButton.style.display = "block";
  });

  // 비디오가 재생될 때 리플레이 버튼 숨기기 및 소리 활성화
  videoElement.addEventListener("play", () => {
    videoElement.muted = false; // 소리 활성화
    replayButton.style.display = "none"; // 리플레이 버튼 숨기기
  });

  // 리플레이 버튼 클릭 이벤트
  replayButton.addEventListener("click", () => {
    videoElement.currentTime = 0; // 비디오 처음으로 되감기
    videoElement.play(); // 비디오 재생
    videoElement.muted = false; // 소리 활성화
    replayButton.style.display = "none"; // 리플레이 버튼 숨기기
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
  const imgContainers = document.querySelectorAll('.tri_img_container div');
  const textContainers = document.querySelectorAll('.tri_text_containter div');
  let currentIndex = 0;
  let isScrolling = false;
  let isActive = false;
  let hasReset = false;

  const SCROLL_DELAY = 800; // 스크롤 처리 지연 시간

  // 이미지 및 텍스트 변경 함수
  const changeImage = (index) => {
    imgContainers.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });

    textContainers.forEach((text, i) => {
      text.classList.toggle('active', i === index);
    });
  };

  // 강제로 현재 섹션 위치를 고정하는 함수
  const lockScrollToSection = () => {
    if (triggerMain) {
      triggerMain.scrollIntoView({ behavior: 'auto' });
    }
  };

  // 스크롤 이벤트 처리
  const onScroll = (e) => {
    if (!isActive || isScrolling) return;

    const deltaY = e.deltaY;

    // 스크롤 동작 잠금
    isScrolling = true;

    // 첫 번째 이미지에서 위로 스크롤 시 이전 섹션으로 이동
    if (currentIndex === 0 && deltaY < 0) {
      window.removeEventListener('wheel', onScroll);
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.addEventListener('wheel', onScroll, { passive: false });
        isScrolling = false;
      }, SCROLL_DELAY);
      return;
    }

    // 마지막 이미지에서 아래로 스크롤 시 다음 섹션으로 이동
    if (currentIndex === imgContainers.length - 1 && deltaY > 0) {
      window.removeEventListener('wheel', onScroll);
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.addEventListener('wheel', onScroll, { passive: false });
        isScrolling = false;
      }, SCROLL_DELAY);
      return;
    }

    // 이미지 변경 처리
    if (deltaY > 0 && currentIndex < imgContainers.length - 1) {
      currentIndex++;
    } else if (deltaY < 0 && currentIndex > 0) {
      currentIndex--;
    }

    changeImage(currentIndex);

    // 스크롤 잠금 해제
    setTimeout(() => {
      isScrolling = false;
      lockScrollToSection(); // 섹션 위치 강제 고정
    }, SCROLL_DELAY);
  };

  // Intersection Observer 설정
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isActive = true;

        if (!hasReset) {
          currentIndex = 0;
          changeImage(currentIndex);
          hasReset = true;
        }

        // 섹션이 화면에 완전히 맞춰지도록 강제 보정
        entry.target.scrollIntoView({ behavior: 'smooth' });
        window.addEventListener('wheel', preventScroll, { passive: false });
      } else {
        isActive = false;
        window.removeEventListener('wheel', preventScroll);
      }
    });
  }, { threshold: 0.5 });

  // 기본 스크롤 방지
  const preventScroll = (e) => {
    if (isActive) e.preventDefault();
  };

  observer.observe(triggerMain);
  window.addEventListener('wheel', onScroll, { passive: false });

  // 페이지가 로드되었을 때 섹션 고정
  window.addEventListener('load', lockScrollToSection);
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









  
  
  




