document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("#videoElement");
  const replayButton = document.querySelector("#replayButton");

  videoElement.muted = true;
  videoElement.play().catch(() => {
    replayButton.style.display = "block";
  });

  videoElement.addEventListener("loadedmetadata", () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            videoElement.pause();
            if (!isNaN(videoElement.duration)) {
              videoElement.currentTime = videoElement.duration;
            }
            replayButton.style.display = "block";
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(document.querySelector("#intro_video"));
  });

  videoElement.addEventListener("ended", () => {
    replayButton.style.display = "block";
  });

  videoElement.addEventListener("play", () => {
    videoElement.muted = false;
    replayButton.style.display = "none";
  });

  replayButton.addEventListener("click", () => {
    videoElement.currentTime = 0;
    videoElement.play();
    videoElement.muted = false;
    replayButton.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const triggerText = document.querySelectorAll(".trigger_intro .trigger_text p");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerText.forEach((p, index) => {
          setTimeout(() => {
            p.classList.add("show");
          }, index * 300);
        });
      } else {
        triggerText.forEach(p => {
          p.classList.remove("show");
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.querySelector(".trigger_intro"));
});

document.addEventListener('DOMContentLoaded', () => {
  const triggerMain = document.querySelector('.trigger_main');
  const imgContainers = document.querySelectorAll('.tri_img_container div');
  const textContainers = document.querySelectorAll('.tri_text_containter div');
  let currentIndex = 0;
  let isScrolling = false;
  let isActive = false;
  let hasReset = false;

  const SCROLL_DELAY = 800;

  const changeImage = (index) => {
    imgContainers.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });

    textContainers.forEach((text, i) => {
      text.classList.toggle('active', i === index);
    });
  };

  const lockScrollToSection = () => {
    if (triggerMain) {
      triggerMain.scrollIntoView({ behavior: 'auto' });
    }
  };

  const onScroll = (e) => {
    if (!isActive || isScrolling) return;

    const deltaY = e.deltaY;

    isScrolling = true;

    if (currentIndex === 0 && deltaY < 0) {
      window.removeEventListener('wheel', onScroll);
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.addEventListener('wheel', onScroll, { passive: false });
        isScrolling = false;
      }, SCROLL_DELAY);
      return;
    }

    if (currentIndex === imgContainers.length - 1 && deltaY > 0) {
      window.removeEventListener('wheel', onScroll);
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      setTimeout(() => {
        window.addEventListener('wheel', onScroll, { passive: false });
        isScrolling = false;
      }, SCROLL_DELAY);
      return;
    }

    if (deltaY > 0 && currentIndex < imgContainers.length - 1) {
      currentIndex++;
    } else if (deltaY < 0 && currentIndex > 0) {
      currentIndex--;
    }

    changeImage(currentIndex);

    setTimeout(() => {
      isScrolling = false;
      lockScrollToSection();
    }, SCROLL_DELAY);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isActive = true;

        if (!hasReset) {
          currentIndex = 0;
          changeImage(currentIndex);
          hasReset = true;
        }

        entry.target.scrollIntoView({ behavior: 'smooth' });
        window.addEventListener('wheel', preventScroll, { passive: false });
      } else {
        isActive = false;
        window.removeEventListener('wheel', preventScroll);
      }
    });
  }, { threshold: 0.5 });

  const preventScroll = (e) => {
    if (isActive) e.preventDefault();
  };

  observer.observe(triggerMain);
  window.addEventListener('wheel', onScroll, { passive: false });

  window.addEventListener('load', lockScrollToSection);
});

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

document.addEventListener('DOMContentLoaded', () => {
  const musicLottie = document.getElementById('musicLottie');
  const observerTarget = document.querySelector('.music_img_container');

  if (observerTarget) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          musicLottie.style.display = 'block';
          musicLottie.stop();
          musicLottie.play();

          document.querySelectorAll('.text_box p').forEach(text => {
            text.classList.remove('show');
          });

          musicLottie.addEventListener('complete', () => {
            document.querySelectorAll('.text_box p').forEach((text, index) => {
              setTimeout(() => {
                text.classList.add('show');
              }, index * 500);
            });
          }, { once: true });
        } else {
          musicLottie.style.display = 'none';
          document.querySelectorAll('.text_box p').forEach(text => {
            text.classList.remove('show');
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(observerTarget);
  }
});

document.addEventListener('scroll', () => {
  const container = document.querySelector('.click_main_link');
  const title = container.querySelector('.click_title');
  const textParagraphs = container.querySelectorAll('.click_text p');
  const button = container.querySelector('.link_button');

  const rect = container.getBoundingClientRect();
  if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 2) {
    title.classList.add('animate');
    textParagraphs.forEach((p, index) => {
      p.classList.add('animate');
    });

    const lastParagraph = textParagraphs[textParagraphs.length - 1];
    lastParagraph.addEventListener('transitionend', () => {
      button.classList.add('animate');
    }, { once: true });
  } else {
    title.classList.remove('animate');
    textParagraphs.forEach((p) => {
      p.classList.remove('animate');
    });
    button.classList.remove('animate');
  }
});

const bodyTextObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const paragraphs = entry.target.querySelectorAll("p");
        paragraphs.forEach((paragraph, index) => {
          setTimeout(() => {
            paragraph.classList.add("visible");
          }, index * 500);
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
      setTimeout(() => text1.classList.add("visible"), 200);
      setTimeout(() => text2.classList.add("visible"), 400);
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

document.addEventListener("DOMContentLoaded", function() {
  const lottiePlayer = document.querySelector(".motif_ex_img dotlottie-player");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lottiePlayer.stop();
        lottiePlayer.play();
      }
    });
  }, { threshold: 0.2 });

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

$(window).resize(function () {
  window.resizeTo(size[0], size[1]);
});








  
  
  




