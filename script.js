/* =====================================================
   PAGE ELEMENTS
===================================================== */

const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
const page3 = document.querySelector(".page3");


/* =====================================================
   PAGE 1 ELEMENTS
===================================================== */

const arrowWrap =
  document.getElementById("arrowWrap");

const arrow =
  document.getElementById("arrow");

const heartTarget =
  document.getElementById("heartTarget");

const aimLine =
  document.getElementById("aimLine");

const powerText =
  document.getElementById("powerText");


/* =====================================================
   MUSIC
===================================================== */

const bgMusic =
  document.getElementById("bgMusic");

let musicStarted = false;

function startMusic() {

  if (!bgMusic) return;

  if (musicStarted) return;

  bgMusic.volume = 0.65;

  const playPromise =
    bgMusic.play();

  if (playPromise !== undefined) {

    playPromise
      .then(() => {

        musicStarted = true;

      })
      .catch(() => {

        console.log(
          "Music will start after user interaction."
        );

      });

  }

}


/* =====================================================
   ARROW VARIABLES
===================================================== */

let startX = 0;
let startY = 0;

let arrowX = 0;
let arrowY = 0;

let dragging = false;
let shooting = false;

const maxPull = 180;


/* =====================================================
   INITIAL ARROW
===================================================== */

function initializeArrow() {

  if (!arrowWrap) return;

  startX =
    window.innerWidth * 0.23;

  startY =
    window.innerHeight * 0.55;

  arrowX = startX;
  arrowY = startY;

  arrowWrap.style.transition =
    "none";

  arrowWrap.style.left =
    startX + "px";

  arrowWrap.style.top =
    startY + "px";

  arrow.style.transform =
    "rotate(0deg)";
}

initializeArrow();


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
  "resize",
  () => {

    if (!shooting) {

      initializeArrow();

    }

  }
);


/* =====================================================
   HEART CENTER
===================================================== */

function getHeartCenter() {

  const rect =
    heartTarget.getBoundingClientRect();

  return {

    x:
      rect.left +
      rect.width / 2,

    y:
      rect.top +
      rect.height / 2

  };

}


/* =====================================================
   AIM ARROW
===================================================== */

function aimArrow(x, y) {

  const heart =
    getHeartCenter();

  const dx =
    heart.x - x;

  const dy =
    heart.y - y;

  const angle =
    Math.atan2(dy, dx)
    * 180 /
    Math.PI;

  arrow.style.transform =
    `rotate(${angle}deg)`;

  return angle;

}


/* =====================================================
   POINTER DOWN
===================================================== */

arrowWrap.addEventListener(
  "pointerdown",
  (e) => {

    if (shooting)
      return;

    e.preventDefault();

    dragging = true;

    arrowWrap.setPointerCapture(
      e.pointerId
    );

    arrowWrap.style.transition =
      "none";

    aimLine.style.display =
      "block";

    powerText.textContent =
      "Pull back... ❤️";


    /* Start song */

    startMusic();

  }
);


/* =====================================================
   POINTER MOVE
===================================================== */

arrowWrap.addEventListener(
  "pointermove",
  (e) => {

    if (!dragging || shooting)
      return;

    e.preventDefault();


    const heart =
      getHeartCenter();


    /*
      Direction from heart
      toward arrow starting point
    */

    const dx =
      startX - heart.x;

    const dy =
      startY - heart.y;


    const length =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (length === 0)
      return;


    const nx =
      dx / length;

    const ny =
      dy / length;


    /*
      Mouse movement
    */

    const mouseDX =
      e.clientX - startX;

    const mouseDY =
      e.clientY - startY;


    /*
      Calculate pull
    */

    let pull =
      mouseDX * nx +
      mouseDY * ny;


    pull =
      Math.max(
        0,
        Math.min(
          maxPull,
          pull
        )
      );


    /*
      New arrow position
    */

    arrowX =
      startX +
      nx * pull;

    arrowY =
      startY +
      ny * pull;


    arrowWrap.style.left =
      arrowX + "px";

    arrowWrap.style.top =
      arrowY + "px";


    /*
      Rotate toward heart
    */

    const angle =
      aimArrow(
        arrowX,
        arrowY
      );


    /*
      Aim line
    */

    const distance =
      Math.sqrt(
        Math.pow(
          heart.x - arrowX,
          2
        ) +
        Math.pow(
          heart.y - arrowY,
          2
        )
      );


    aimLine.style.left =
      arrowX + "px";

    aimLine.style.top =
      (arrowY + 22) + "px";

    aimLine.style.width =
      distance + "px";

    aimLine.style.transform =
      `rotate(${angle}deg)`;


    /*
      Power
    */

    const power =
      Math.round(
        (pull / maxPull) * 100
      );


    powerText.textContent =
      `Power ${power}% — Release ❤️`;

  }
);


/* =====================================================
   POINTER UP
===================================================== */

arrowWrap.addEventListener(
  "pointerup",
  (e) => {

    if (!dragging || shooting)
      return;

    e.preventDefault();

    dragging = false;

    aimLine.style.display =
      "none";


    const power =
      Math.sqrt(
        Math.pow(
          startX - arrowX,
          2
        ) +
        Math.pow(
          startY - arrowY,
          2
        )
      );


    shootArrow(power);

  }
);


/* =====================================================
   POINTER CANCEL
===================================================== */

arrowWrap.addEventListener(
  "pointercancel",
  () => {

    if (!dragging || shooting)
      return;

    dragging = false;

    aimLine.style.display =
      "none";

    returnArrow();

  }
);


/* =====================================================
   SHOOT ARROW
===================================================== */

function shootArrow(power) {

  if (shooting)
    return;

  shooting = true;


  const heart =
    getHeartCenter();


  /*
    Direction toward heart
  */

  const dx =
    heart.x - arrowX;

  const dy =
    heart.y - arrowY;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  /*
    Speed
  */

  const speed =
    650 +
    (power / maxPull) * 1200;


  const duration =
    distance / speed;


  /*
    Make arrow point at heart
  */

  aimArrow(
    arrowX,
    arrowY
  );


  /*
    Target
  */

  const targetX =
    heart.x - 20;

  const targetY =
    heart.y - 22;


  /*
    Fly
  */

  arrowWrap.style.transition =
    `left ${duration}s cubic-bezier(.1,.7,.1,1),
     top ${duration}s cubic-bezier(.1,.7,.1,1)`;


  arrowWrap.style.left =
    targetX + "px";

  arrowWrap.style.top =
    targetY + "px";


  /*
    Check collision
  */

  setTimeout(
    () => {

      checkHit();

    },
    duration * 1000 + 100
  );

}


/* =====================================================
   HIT CHECK
===================================================== */

function checkHit() {

  const arrowRect =
    arrow.getBoundingClientRect();

  const heartRect =
    heartTarget.getBoundingClientRect();


  /*
    Slightly larger hit area
    so game feels smooth
  */

  const padding = 25;


  const hit =

    arrowRect.right >
      heartRect.left - padding &&

    arrowRect.left <
      heartRect.right + padding &&

    arrowRect.bottom >
      heartRect.top - padding &&

    arrowRect.top <
      heartRect.bottom + padding;


  if (hit) {

    hitHeart();

  } else {

    missArrow();

  }

}


/* =====================================================
   HIT HEART
===================================================== */

function hitHeart() {

  powerText.textContent =
    "Perfect shot! ❤️";


  heartTarget.style.animation =
    "none";


  heartTarget.style.transition =
    "transform .4s ease, opacity .5s ease";


  heartTarget.style.transform =
    "translate(-50%, -50%) scale(1.5)";


  setTimeout(
    () => {

      heartTarget.style.opacity =
        "0";

      heartTarget.style.transform =
        "translate(-50%, -50%) scale(0)";

    },
    250
  );


  /*
    Page 2
  */

  setTimeout(
    () => {

      page1.classList.remove(
        "active"
      );

      page2.classList.add(
        "active"
      );


      startPage2();

    },
    900
  );

}


/* =====================================================
   MISS
===================================================== */

function missArrow() {

  powerText.textContent =
    "Missed! Try again ❤️";


  returnArrow();

}


/* =====================================================
   RETURN ARROW
===================================================== */

function returnArrow() {

  arrowWrap.style.transition =
    "left .8s cubic-bezier(.2,.8,.2,1), top .8s cubic-bezier(.2,.8,.2,1)";


  arrowWrap.style.left =
    startX + "px";

  arrowWrap.style.top =
    startY + "px";


  setTimeout(
    () => {

      arrowX = startX;
      arrowY = startY;

      arrowWrap.style.transition =
        "";

      arrow.style.transform =
        "rotate(0deg)";

      shooting = false;

      dragging = false;

      powerText.textContent =
        "Pull the arrow back and release ❤️";

    },
    850
  );

}


/* =====================================================
   PAGE 2 LETTER ANIMATION
===================================================== */

function startPage2() {

  const text =
    "Happy Birthday";


  const birthdayText =
    document.getElementById(
      "birthdayText"
    );


  const birthdayLine =
    document.getElementById(
      "birthdayLine"
    );


  birthdayText.innerHTML =
    "";


  birthdayLine.classList.remove(
    "show"
  );


  /*
    Letter by letter
  */

  [...text].forEach(
    (letter, index) => {

      const span =
        document.createElement(
          "span"
        );


      span.className =
        "char";


      span.textContent =
        letter === " "
          ? "\u00A0"
          : letter;


      span.style.animationDelay =
        `${index * 0.12}s`;


      birthdayText.appendChild(
        span
      );

    }
  );


  /*
    Total animation time
  */

  const animationTime =
    text.length * 120 + 800;


  /*
    Show line
  */

  setTimeout(
    () => {

      birthdayLine.classList.add(
        "show"
      );

    },
    animationTime
  );


  /*
    Page 3
  */

  setTimeout(
    () => {

      page2.classList.remove(
        "active"
      );

      page3.classList.add(
        "active"
      );

      startPage3();

    },
    5000
  );

}


/* =====================================================
   PAGE 3
===================================================== */

let petalsStarted = false;

function startPage3() {

  if (petalsStarted)
    return;

  petalsStarted = true;

  startPetals();

}


/* =====================================================
   FALLING PETALS
===================================================== */

function startPetals() {

  const container =
    document.getElementById(
      "petals"
    );


  if (!container)
    return;


  setInterval(
    () => {

      const petal =
        document.createElement(
          "div"
        );


      petal.className =
        "petal";


      /*
        Hearts + flowers
      */

      petal.textContent =
        Math.random() > .3
          ? "♥"
          : "✿";


      /*
        Position
      */

      petal.style.left =
        Math.random() * 100 + "%";


      /*
        Size
      */

      petal.style.fontSize =
        (
          12 +
          Math.random() * 22
        ) + "px";


      /*
        Speed
      */

      petal.style.animationDuration =
        (
          5 +
          Math.random() * 5
        ) + "s";


      container.appendChild(
        petal
      );


      /*
        Remove
      */

      setTimeout(
        () => {

          petal.remove();

        },
        11000
      );

    },
    500
  );

}


/* =====================================================
   START MUSIC ON ANY USER INTERACTION
===================================================== */

document.addEventListener(
  "pointerdown",
  () => {

    startMusic();

  },
  {
    once: true
  }
);