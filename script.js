'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hiddenn')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const selector = e.target.getAttribute('href');
    document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
  }
});

const h1 = document.querySelector('h1');

// tabsContainer.addEventListener('click', function (e) {
//   console.log('came');
//   const currentTab = e.target.dataset.tab;

//   if (e.target.classList.contains('operations__tab')) {
//     e.target.classList.add('operations__tab--active');
//     [...e.target.parentElement.children].forEach(t => {
//       if (t !== e.target) t.classList.remove('operations__tab--active');
//     });
//   }
// });

//Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;

  //Removing active classes from all
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tC => tC.classList.remove('operations__content--active'));
  //Active active Tab
  clicked?.classList.add('operations__tab--active');

  //Adding active content with the dataset value
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = nav.querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');

    siblings.forEach(sib => {
      if (link !== sib) sib.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

//Menu Fade animation
nav.addEventListener('mouseout', handleHover.bind(1));
nav.addEventListener('mouseover', handleHover.bind(0.5));

// const initialCoords = section1.getBoundingClientRect();
// //Sticky navigation
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

//Intersection Observer API

/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry.target));
  // console.log(observer);
};

const obsOptions = {
  root: null,
  threshold: 0.1,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  // console.log(entries);

  const [entry] = entries;
  // console.log(entry);
  !entry.isIntersecting && nav.classList.add('sticky');
  entry.isIntersecting && nav.classList.remove('sticky');
};
const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, options);

headerObserver.observe(header);

//Reveal Sections
const allSections = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    //Use this line alone to slide in all the time
    // entry.target.classList.toggle('section--hidden', !entry.isIntersecting);

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.1,
});

allSections.forEach(sec => {
  sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

console.log('Ninja works');

//Lazy loading images
//Really important for performance

const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    console.log(entries);

    //Replace the src with data-src
    entry.target.src = entry.target.dataset.src;

    //Making sure that we remove the blur only after the image is loaded
    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });

    //Unobserving the loaded images
    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //Start loading 200px before we reach the image
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider component
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  console.log(slides);

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  //Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
    activateDots(slide);
  };

  let curSlide = 0;
  //Limit to stop slide
  const maxSlide = slides.length;

  //Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else curSlide++;
    goToSlide(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;
    goToSlide(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };

  init();

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      //Using destructuring
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();

window.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOMContentLoaded', e);
});

window.addEventListener('load', function (e) {
  console.log('Window Load Event', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log('Before Unload', e);
  e.returnValue = '';
});
