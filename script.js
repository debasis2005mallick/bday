// CORE JAVASCRIPT: BIRTHDAY SURPRISE WEBSITE

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE VARIABLES ---
  let config = getBirthdayConfig();
  let isUnlocked = false;
  let birthdayThemeActive = false; // Birthday melody playing status
  let audioCtx = null;
  let synthIntervalId = null;
  let synthNoteTimeouts = [];
  
  // Particles & Confetti
  let particleAnimationId = null;
  let confettiAnimationId = null;
  let particles = [];
  let confettiPieces = [];

  // Memory Card Index
  let memoryIndex = 0;

  // Game Variables
  let gameScore = 0;
  let balloonsArray = [];
  let isGameRunning = false;
  let gameAnimationId = null;

  // Typewriter
  let typewriterActive = false;
  let typewriterFinished = false;

  // Gift Box Opened?
  let isBoxOpened = false;

  // --- ELEMENT SELECTORS ---
  const lockScreen = document.getElementById("lockScreen");
  const mainDashboard = document.getElementById("mainDashboard");
  const passcodeInput = document.getElementById("passcodeInput");
  const unlockBtn = document.getElementById("unlockBtn");
  const skipLockBtn = document.getElementById("skipLockBtn");
  const lockErrorMsg = document.getElementById("lockErrorMsg");
  const lockHintText = document.getElementById("lockHintText");

  // Audio Controls
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const musicIconMuted = document.getElementById("musicIconMuted");
  const musicIconPlaying = document.getElementById("musicIconPlaying");

  // Settings Panel Controls
  const settingsOpenBtn = document.getElementById("settingsOpenBtn");
  const settingsCloseBtn = document.getElementById("settingsCloseBtn");
  const settingsDrawer = document.getElementById("settingsDrawer");
  const customizerForm = document.getElementById("customizerForm");
  const resetConfigBtn = document.getElementById("resetConfigBtn");
  const exportConfigBtn = document.getElementById("exportConfigBtn");
  const importConfigInput = document.getElementById("importConfigInput");

  // Tab Elements (resolved directly inside tabsMap below)

  // Dynamic Content Placeholders
  const recipientNameText = document.getElementById("recipientNameText");
  const recipientAgeText = document.getElementById("recipientAgeText");
  const mainTitle = document.getElementById("mainTitle");
  const letterTitleText = document.getElementById("letterTitleText");
  const typewriterTextContainer = document.getElementById("typewriterTextContainer");
  const memoryCardsContainer = document.getElementById("memoryCardsContainer");
  const deckIndicators = document.getElementById("deckIndicators");
  const prevMemoryBtn = document.getElementById("prevMemoryBtn");
  const nextMemoryBtn = document.getElementById("nextMemoryBtn");

  // Game elements
  const gameScoreText = document.getElementById("gameScoreText");
  const gamePlayArea = document.getElementById("gamePlayArea");
  const restartGameBtn = document.getElementById("restartGameBtn");
  const wishOverlayMessage = document.getElementById("wishOverlayMessage");
  const wishToastEmoji = document.getElementById("wishToastEmoji");
  const wishToastBody = document.getElementById("wishToastBody");

  // Gift elements
  const cssGiftBox3D = document.getElementById("cssGiftBox3D");
  const giftClickHint = document.getElementById("giftClickHint");
  const giftRewardContainer = document.getElementById("giftRewardContainer");
  const giftCouponTitle = document.getElementById("giftCouponTitle");
  const giftCouponCode = document.getElementById("giftCouponCode");
  const giftCouponTerms = document.getElementById("giftCouponTerms");
  const giftRewardHeading = document.getElementById("giftRewardHeading");
  const giftImageContainer = document.getElementById("giftImageContainer");
  const giftRewardImage = document.getElementById("giftRewardImage");

  // Canvas
  const particlesCanvas = document.getElementById("particlesCanvas");
  const pCtx = particlesCanvas.getContext("2d");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const cCtx = confettiCanvas.getContext("2d");

  // --- INITIALIZE PAGE STATE ---
  function initApp() {
    config = getBirthdayConfig();
    
    // Apply theme
    document.body.className = "theme-" + (config.theme || "royal-magic");

    // Lock Screen setup
    lockHintText.textContent = config.lockHint || "";
    lockErrorMsg.classList.add("hidden");
    passcodeInput.value = "";

    // Load Header details
    recipientNameText.textContent = config.recipientName;
    recipientAgeText.textContent = config.recipientAge;
    mainTitle.textContent = config.headerWishes || "HAPPY BIRTHDAY!";

    // Load Letter details
    letterTitleText.textContent = config.letterTitle || "A Special Letter...";
    
    // Reset Typewriter
    typewriterTextContainer.innerText = "";
    typewriterActive = false;
    typewriterFinished = false;
    typewriterTextContainer.classList.remove("typing-finished");
    
    // Load Memories Cards Deck
    buildMemoryDeck();

    // Reset game parameters
    gameScore = 0;
    gameScoreText.textContent = gameScore;
    gamePlayArea.innerHTML = '<div id="gameInstructions" class="tap-hint">Tap floating balloons to pop! 👆</div>';
    balloonsArray = [];
    isGameRunning = false;
    if (gameAnimationId) cancelAnimationFrame(gameAnimationId);

    // Reset Gift Box parameters
    isBoxOpened = false;
    cssGiftBox3D.classList.remove("opened-box-effect");
    giftClickHint.classList.remove("hidden");
    giftRewardContainer.classList.add("hidden");
    
    giftCouponTitle.textContent = config.giftSurprise.couponTitle;
    giftCouponCode.textContent = config.giftSurprise.couponCode;
    giftCouponTerms.textContent = config.giftSurprise.couponTerms;
    giftRewardHeading.textContent = config.giftSurprise.message;
    
    if (config.giftSurprise.giftImageUrl) {
      giftRewardImage.src = config.giftSurprise.giftImageUrl;
      giftImageContainer.classList.remove("hidden");
    } else {
      giftImageContainer.classList.add("hidden");
      giftRewardImage.src = "";
    }

    // Populate Creator Settings Panel Form
    populateSettingsForm();
  }

  initApp();

  // --- AUDIO SYNTHESIZER MODULE (Web Audio API) ---
  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Marimba synth note generator
  function playSynthNote(frequency, duration, startTime) {
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const oscNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Cute music box sound: Mix triangle and sine waves
    oscNode.type = 'triangle';
    oscNode.frequency.setValueAtTime(frequency, startTime);

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime);
    // Instant attack
    gainNode.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
    // Gentle decay to sustain
    gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + duration * 0.4);
    // Silent release
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscNode.start(startTime);
    oscNode.stop(startTime + duration + 0.1);
  }

  // Play popping bubble sound
  function playPopNoise() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.log("Audio play error", e);
    }
  }

  // Play tada fanfare sound
  function playTadaFanfare() {
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Chord sweep
      
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.6);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.7);
      });
    } catch(e) {
      console.log(e);
    }
  }

  // Happy Birthday Music Schedule
  // Frequency definitions
  const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

  const melody = [
    {note: C4, duration: 0.3}, {note: C4, duration: 0.15}, {note: D4, duration: 0.45},
    {note: C4, duration: 0.45}, {note: F4, duration: 0.45}, {note: E4, duration: 0.9},

    {note: C4, duration: 0.3}, {note: C4, duration: 0.15}, {note: D4, duration: 0.45},
    {note: C4, duration: 0.45}, {note: G4, duration: 0.45}, {note: F4, duration: 0.9},

    {note: C4, duration: 0.3}, {note: C4, duration: 0.15}, {note: C5, duration: 0.45},
    {note: A4, duration: 0.45}, {note: F4, duration: 0.45}, {note: E4, duration: 0.45}, {note: D4, duration: 0.45},

    {note: Bb4, duration: 0.3}, {note: Bb4, duration: 0.15}, {note: A4, duration: 0.45},
    {note: F4, duration: 0.45}, {note: G4, duration: 0.45}, {note: F4, duration: 0.9}
  ];

  function startBirthdayMelody() {
    if (!audioCtx) initAudio();
    stopBirthdayMelody();
    
    birthdayThemeActive = true;
    updateMusicButtonState();



    const playFullSong = () => {
      if (!birthdayThemeActive) return;
      const now = audioCtx.currentTime;
      let noteDelay = 0;

      melody.forEach((item) => {
        const playTime = item.duration * 1.25; // slow tempo slightly
        
        const noteTimeout = setTimeout(() => {
          if (birthdayThemeActive) {
            playSynthNote(item.note, playTime, audioCtx.currentTime);
          }
        }, noteDelay * 1000);

        synthNoteTimeouts.push(noteTimeout);
        noteDelay += playTime;
      });

      // Restart loop after song finishes plus delay
      const pauseDuration = 3000;
      const loopTimeout = setTimeout(() => {
        if (birthdayThemeActive) playFullSong();
      }, (noteDelay * 1000) + pauseDuration);

      synthNoteTimeouts.push(loopTimeout);
    };

    playFullSong();
  }

  function stopBirthdayMelody() {
    birthdayThemeActive = false;
    updateMusicButtonState();
    
    // Clear all scheduled timers
    synthNoteTimeouts.forEach(clearTimeout);
    synthNoteTimeouts = [];
  }

  function toggleMusic() {
    initAudio();
    if (birthdayThemeActive) {
      stopBirthdayMelody();
    } else {
      startBirthdayMelody();
    }
  }

  function updateMusicButtonState() {
    if (birthdayThemeActive) {
      musicToggleBtn.classList.remove("muted");
      musicIconMuted.classList.add("hidden");
      musicIconPlaying.classList.remove("hidden");
    } else {
      musicToggleBtn.classList.add("muted");
      musicIconMuted.classList.remove("hidden");
      musicIconPlaying.classList.add("hidden");
    }
  }

  musicToggleBtn.addEventListener("click", toggleMusic);

  // --- PASSCODE GATE LOCK SCREEN SYSTEM ---
  function attemptUnlock() {
    initAudio();
    const entered = passcodeInput.value.trim();
    const cleanCode = (config.lockCode || "1234").trim();

    if (entered === cleanCode) {
      triggerMainReveal();
    } else {
      lockErrorMsg.classList.remove("hidden");
      passcodeInput.value = "";
      passcodeInput.focus();
    }
  }

  function triggerMainReveal() {
    isUnlocked = true;
    startBirthdayMelody();
    
    // Add slide out animation to lock page
    lockScreen.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease";
    lockScreen.style.transform = "translateY(-100px) scale(0.95)";
    lockScreen.style.opacity = "0";

    setupParticles();

    setTimeout(() => {
      lockScreen.classList.add("hidden");
      mainDashboard.classList.remove("hidden");
      
      // Load first page elements
      startTypewriter();
    }, 600);
  }

  unlockBtn.addEventListener("click", attemptUnlock);
  skipLockBtn.addEventListener("click", () => {
    initAudio();
    triggerMainReveal();
  });
  
  passcodeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      attemptUnlock();
    }
  });


  // --- PARTICLES BACKGROUND SYSTEM ---
  function resizeCanvases() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", resizeCanvases);
  resizeCanvases();

  function setupParticles() {
    particles = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particlesCanvas.width,
        y: Math.random() * particlesCanvas.height * 1.5 + particlesCanvas.height,
        size: Math.random() * 6 + 2,
        speedY: Math.random() * -0.6 - 0.2,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        colorHue: Math.random() * 60 + 260 // Purplish to gold gradient hues
      });
    }

    if (particleAnimationId) cancelAnimationFrame(particleAnimationId);
    animateParticles();
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    particles.forEach(p => {
      // Draw glowing sphere
      pCtx.beginPath();
      // Apply theme custom color overrides
      let colorStyle = `hsla(${p.colorHue}, 70%, 75%, ${p.opacity})`;
      if (document.body.className.includes("rose-gold")) {
        colorStyle = `rgba(230, 176, 186, ${p.opacity})`;
      } else if (document.body.className.includes("neon-sunset")) {
        colorStyle = `hsla(${p.x % 2 === 0 ? 320 : 180}, 100%, 70%, ${p.opacity})`;
      } else if (document.body.className.includes("cozy-forest")) {
        colorStyle = `hsla(${p.x % 2 === 0 ? 150 : 25}, 80%, 70%, ${p.opacity})`;
      }

      pCtx.fillStyle = colorStyle;
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fill();

      // Motion physics
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y / 30) * 0.2; // sway

      // Recycling
      if (p.y < -10) {
        p.y = particlesCanvas.height + 20;
        p.x = Math.random() * particlesCanvas.width;
      }
    });

    particleAnimationId = requestAnimationFrame(animateParticles);
  }


  // --- TYPEWRITER LETTER WRITING ---
  function startTypewriter() {
    if (typewriterActive || typewriterFinished) return;
    
    typewriterActive = true;
    typewriterTextContainer.innerText = "";
    typewriterTextContainer.classList.remove("typing-finished");

    const content = config.letterContent || "";
    let index = 0;

    function typeChar() {
      if (!isUnlocked || !typewriterActive) return;

      if (index < content.length) {
        // Handle line break strings nicely
        typewriterTextContainer.innerText += content[index];
        index++;
        
         // Scroll down text panel wrapper during typewriter to show expansion
         const wrapper = document.getElementById("tabLetter");
         if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;

        setTimeout(typeChar, 35);
      } else {
        typewriterActive = false;
        typewriterFinished = true;
        typewriterTextContainer.classList.add("typing-finished");
      }
    }

    typeChar();
  }


  // --- 3D DECK MEMORIES LANES CAROUSEL ---
  function buildMemoryDeck() {
    memoryCardsContainer.innerHTML = "";
    deckIndicators.innerHTML = "";
    
    const memories = config.memories || [];
    if (memories.length === 0) {
      memoryCardsContainer.innerHTML = "<p class='pane-subtitle'>No photo memories added yet! Use the Creator Settings panel to customize.</p>";
      return;
    }

    memories.forEach((mem, idx) => {
      // Build Card
      const card = document.createElement("div");
      card.className = "memory-card-3d";
      // Initial positioning tags
      updateCardPositionClass(card, idx);

      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="card-img-holder">
            <img src="${mem.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600'}" alt="${mem.title || 'Memory Image'}">
          </div>
          <div class="card-content-holder">
            <h4>${mem.title || 'Untitled Memory'}</h4>
            <p>${mem.description || 'No description provided.'}</p>
          </div>
        </div>
      `;
      
      // Click card to bring in focus
      card.addEventListener("click", () => {
        if (idx !== memoryIndex) {
          goToMemoryIndex(idx);
        }
      });

      memoryCardsContainer.appendChild(card);

      // Build dot indicator
      const dot = document.createElement("div");
      dot.className = "deck-dot" + (idx === memoryIndex ? " active-dot" : "");
      dot.addEventListener("click", () => goToMemoryIndex(idx));
      deckIndicators.appendChild(dot);
    });
  }

  function updateCardPositionClass(card, idx) {
    const list = config.memories || [];
    const len = list.length;
    
    // Calculate shifting positions relative to the current focus
    let relativeIdx = (idx - memoryIndex + len) % len;
    
    card.className = "memory-card-3d";

    if (relativeIdx === 0) {
      card.classList.add("card-state-0");
    } else if (relativeIdx === 1) {
      card.classList.add("card-state-1");
    } else if (relativeIdx === 2) {
      card.classList.add("card-state-2");
    } else if (relativeIdx === len - 1 && len > 3) {
      // Transition class for the exit slide card
      card.classList.add("card-state-left");
    } else {
      card.classList.add("card-state-3");
    }
  }

  function goToMemoryIndex(newIdx) {
    const list = config.memories || [];
    if (list.length === 0) return;
    
    memoryIndex = (newIdx + list.length) % list.length;
    
    // Shifting cards class triggers CSS transformation rules
    const cards = memoryCardsContainer.querySelectorAll(".memory-card-3d");
    cards.forEach((card, idx) => {
      updateCardPositionClass(card, idx);
    });

    // Update Dots indicator active classes
    const dots = deckIndicators.querySelectorAll(".deck-dot");
    dots.forEach((dot, idx) => {
      if (idx === memoryIndex) {
        dot.classList.add("active-dot");
      } else {
        dot.classList.remove("active-dot");
      }
    });
  }

  prevMemoryBtn.addEventListener("click", () => {
    goToMemoryIndex(memoryIndex - 1);
  });

  nextMemoryBtn.addEventListener("click", () => {
    goToMemoryIndex(memoryIndex + 1);
  });


  // --- BALLOON POPPING MINI GAME SYSTEM ---
  function initBalloonGame() {
    gameScore = 0;
    gameScoreText.textContent = gameScore;
    balloonsArray = [];
    isGameRunning = true;
    
    // Clear overlay toast
    wishOverlayMessage.classList.add("hidden");
    
    gamePlayArea.innerHTML = "";

    // Spawn initial pool of balloons
    for (let i = 0; i < 6; i++) {
      spawnBalloon(true); // scatter them vertically initially
    }

    if (gameAnimationId) cancelAnimationFrame(gameAnimationId);
    runGameLoop();
  }

  const balloonColors = [
    "#ff4b5c", "#ff9f43", "#feca57", "#1dd1a1", "#00d2d3", 
    "#54a0ff", "#5f27cd", "#ff7ff3", "#ff6b6b", "#48dbfb"
  ];

  function spawnBalloon(scatter = false) {
    if (!isGameRunning) return;

    const balloon = document.createElement("div");
    balloon.className = "balloon-node";
    
    const sizeScale = Math.random() * 0.4 + 0.8; // scaling size
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const xPos = Math.random() * (gamePlayArea.clientWidth - 70) + 5;
    
    // If scatter is true, put them at different starting heights
    let yPos = -95;
    if (scatter) {
      yPos = Math.random() * (gamePlayArea.clientHeight - 80) + 50;
    }

    balloon.style.left = xPos + "px";
    balloon.style.transform = `scale(${sizeScale})`;
    balloon.style.backgroundColor = color;
    balloon.style.borderColor = color;
    
    // Append sheen bubble reflection element
    const shine = document.createElement("div");
    shine.className = "balloon-shine";
    balloon.appendChild(shine);

    gamePlayArea.appendChild(balloon);

    // State object
    const balloonObj = {
      element: balloon,
      x: xPos,
      y: yPos,
      scale: sizeScale,
      speed: Math.random() * 1.5 + 1.2, // floating speeds
      swayRange: Math.random() * 15 + 5,
      swaySpeed: Math.random() * 0.03 + 0.01,
      swayOffset: Math.random() * 100,
      isPopped: false
    };

    // Click handler for popping balloons
    balloon.addEventListener("click", (e) => {
      e.stopPropagation();
      popBalloon(balloonObj);
    });

    balloonsArray.push(balloonObj);
  }

  function popBalloon(balloonObj) {
    if (balloonObj.isPopped) return;
    balloonObj.isPopped = true;

    // Pop Sound
    playPopNoise();

    // Spawn popping explosion particle elements in DOM
    triggerBalloonPopCSSExplosion(balloonObj);

    // Increment points
    gameScore++;
    gameScoreText.textContent = gameScore;

    // Remove element from screen
    balloonObj.element.remove();
    
    // Reveal a cute wish toast
    revealPopWish();

    // Replace balloon
    setTimeout(() => {
      // Cleanup arrays and spawn new
      balloonsArray = balloonsArray.filter(b => b !== balloonObj);
      spawnBalloon(false);
    }, 300);

    // Goal milestone Check
    if (gameScore === 15) {
      triggerConfettiExplosion(30); // spray small celebration confetti
    }
  }

  function triggerBalloonPopCSSExplosion(bObj) {
    const areaRect = gamePlayArea.getBoundingClientRect();
    const cardEl = bObj.element.getBoundingClientRect();
    const localX = cardEl.left - areaRect.left + 30;
    const localY = cardEl.top - areaRect.top + 38;
    
    const count = 12;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "pop-particle";
      dot.style.position = "absolute";
      dot.style.left = localX + "px";
      dot.style.top = localY + "px";
      dot.style.width = "6px";
      dot.style.height = "6px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = bObj.element.style.backgroundColor;
      dot.style.zIndex = "10";
      
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 3 + 2;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      
      gamePlayArea.appendChild(dot);
      
      let lifespan = 0;
      const animateDot = () => {
        lifespan += 1.5;
        const x = parseFloat(dot.style.left) + dx;
        const y = parseFloat(dot.style.top) + dy;
        dot.style.left = x + "px";
        dot.style.top = y + "px";
        dot.style.opacity = (1 - (lifespan / 100)).toString();
        
        if (lifespan < 100 && isGameRunning) {
          requestAnimationFrame(animateDot);
        } else {
          dot.remove();
        }
      };
      
      animateDot();
    }
  }

  function revealPopWish() {
    const wishes = config.balloonWishes || ["Happy Birthday!"];
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    
    const emojis = ["🎂", "🥳", "🎁", "💖", "💫", "🌟", "✨", "🍿", "🍪"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    wishToastEmoji.textContent = randomEmoji;
    wishToastBody.textContent = randomWish;

    wishOverlayMessage.classList.remove("hidden");

    // Hide wish card after a timeout
    const hideTimeout = setTimeout(() => {
      wishOverlayMessage.classList.add("hidden");
    }, 2800);

    // Save timeout ID to clear if they pop another quickly
    if (window.overlayToastTimeout) clearTimeout(window.overlayToastTimeout);
    window.overlayToastTimeout = hideTimeout;
  }

  function runGameLoop() {
    if (!isGameRunning) return;

    balloonsArray.forEach(b => {
      // Update Y Position (Float up)
      b.y += b.speed;
      
      // Update X position with swaying movement
      const time = Date.now() * b.swaySpeed + b.swayOffset;
      const xSway = Math.sin(time) * b.swayRange;
      const currentX = b.x + xSway;

      // Render positions relative to box coordinates
      // y coordinates measured from bottom: translate bottom property
      b.element.style.bottom = b.y + "px";
      b.element.style.left = currentX + "px";

      // If balloon drifts out from the top view
      if (b.y > gamePlayArea.clientHeight + 10) {
        b.element.remove();
        balloonsArray = balloonsArray.filter(item => item !== b);
        spawnBalloon(false);
      }
    });

    gameAnimationId = requestAnimationFrame(runGameLoop);
  }

  restartGameBtn.addEventListener("click", () => {
    initBalloonGame();
  });


  // --- 3D GIFT BOX & CONFETTI CELEBRATION ---
  function triggerConfettiExplosion(customCount = 140) {
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    confettiPieces = [];

    const centerCol = confettiCanvas.width / 2;
    const centerRow = confettiCanvas.height * 0.45; // Explosion center

    const colors = [
      "#ffd700", "#ff007f", "#00f0ff", "#39ff14", "#ff5e7e", 
      "#ff8b94", "#faedd8", "#8e44ad", "#e67e22", "#2ecc71"
    ];

    for (let i = 0; i < customCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      
      confettiPieces.push({
        x: customCount < 50 ? Math.random() * confettiCanvas.width : centerCol, // Sprays target or screen
        y: customCount < 50 ? -20 : centerRow,
        radius: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: customCount < 50 ? Math.random() * 2 + 1 : Math.sin(angle) * speed - 4, // Initial upward velocity
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1
      });
    }

    animateConfetti();
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;

    confettiPieces.forEach(p => {
      if (p.opacity <= 0) return;
      activeParticles++;

      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rotation * Math.PI / 180);
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = p.opacity;

      // Draw rectangle confetti shapes
      cCtx.fillRect(-p.radius, -p.radius / 1.5, p.radius * 2, p.radius * 1.5);
      cCtx.restore();

      // Physics logic
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity pulls down
      p.vx *= 0.98; // wind resistance
      p.rotation += p.rotationSpeed;

      // Fade out slowly after passing middle screen
      if (p.y > confettiCanvas.height * 0.7) {
        p.opacity -= 0.015;
      }
    });

    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function unlockGiftSurprise() {
    if (isBoxOpened) return;
    isBoxOpened = true;

    // Plays fanfare sound
    playTadaFanfare();

    // Trigger open animation
    cssGiftBox3D.classList.add("opened-box-effect");
    giftClickHint.classList.add("hidden");

    // Confetti physics explosion
    setTimeout(() => {
      triggerConfettiExplosion(180);
    }, 150);

    // Reveal Coupon Card
    setTimeout(() => {
      giftRewardContainer.classList.remove("hidden");
      // Autoscrolling to show coupon
      const tabPane = document.getElementById("tabGift");
      if (tabPane) {
        tabPane.scrollTo({
          top: tabPane.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 550);
  }

  cssGiftBox3D.addEventListener("click", unlockGiftSurprise);
  // Keyboard access
  cssGiftBox3D.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      unlockGiftSurprise();
    }
  });


  // --- SETTINGS / CREATOR CUSTOMIZER DRAWER ---
  function populateSettingsForm() {
    document.getElementById("inputName").value = config.recipientName;
    document.getElementById("inputAge").value = config.recipientAge;
    document.getElementById("selectTheme").value = config.theme || "royal-magic";
    document.getElementById("inputHeaderWishes").value = config.headerWishes || "";
    document.getElementById("inputLockCode").value = config.lockCode || "1234";
    document.getElementById("inputLockHint").value = config.lockHint || "";
    document.getElementById("inputLetterTitle").value = config.letterTitle || "";
    document.getElementById("inputLetterContent").value = config.letterContent || "";

    // Fill memories
    const memories = config.memories || [];
    for (let i = 1; i <= 4; i++) {
      const index = i - 1;
      const mem = memories[index] || {};
      
      document.getElementById(`inputMem${i}Title`).value = mem.title || "";
      document.getElementById(`inputMem${i}Desc`).value = mem.description || "";
      document.getElementById(`inputMem${i}Img`).value = mem.image || "";
    }

    // Balloon Pop wishes
    const wishes = config.balloonWishes || [];
    document.getElementById("textareaBalloonWishes").value = wishes.join("\n");

    // Grand Surprise details
    document.getElementById("inputGiftMessage").value = config.giftSurprise.message || "";
    document.getElementById("inputCouponTitle").value = config.giftSurprise.couponTitle || "";
    document.getElementById("inputCouponCode").value = config.giftSurprise.couponCode || "";
    document.getElementById("inputCouponTerms").value = config.giftSurprise.couponTerms || "";
    document.getElementById("inputGiftImg").value = config.giftSurprise.giftImageUrl || "";
  }

  function handleSaveForm(e) {
    e.preventDefault();

    // Reconstruct config object
    const newConfig = {
      recipientName: document.getElementById("inputName").value.trim(),
      recipientAge: document.getElementById("inputAge").value.trim(),
      theme: document.getElementById("selectTheme").value,
      headerWishes: document.getElementById("inputHeaderWishes").value.trim(),
      lockCode: document.getElementById("inputLockCode").value.trim(),
      lockHint: document.getElementById("inputLockHint").value.trim(),
      letterTitle: document.getElementById("inputLetterTitle").value.trim(),
      letterContent: document.getElementById("inputLetterContent").value,
      
      memories: [],
      balloonWishes: [],

      giftSurprise: {
        message: document.getElementById("inputGiftMessage").value.trim(),
        couponTitle: document.getElementById("inputCouponTitle").value.trim(),
        couponCode: document.getElementById("inputCouponCode").value.trim(),
        couponTerms: document.getElementById("inputCouponTerms").value.trim(),
        giftImageUrl: document.getElementById("inputGiftImg").value.trim(),
      }
    };

    // Grab Memories
    for (let i = 1; i <= 4; i++) {
      newConfig.memories.push({
        title: document.getElementById(`inputMem${i}Title`).value.trim(),
        description: document.getElementById(`inputMem${i}Desc`).value.trim(),
        image: document.getElementById(`inputMem${i}Img`).value.trim()
      });
    }

    // Grab Balloon list
    const wishesText = document.getElementById("textareaBalloonWishes").value;
    newConfig.balloonWishes = wishesText.split("\n")
                                      .map(w => w.trim())
                                      .filter(w => w.length > 0);

    // Save changes
    saveBirthdayConfig(newConfig);

    // Reinitialize core app features based on new credentials
    initApp();

    // Close options panel slide
    closeSettingsPanel();

    alert("Surprise customization settings saved successfully! Page updated. 🔮");
  }

  function handleResetConfig() {
    if (confirm("Are you sure you want to restore default template settings? Your custom modifications will be cleared.")) {
      resetBirthdayConfig();
      initApp();
      closeSettingsPanel();
    }
  }

  function openSettingsPanel() {
    settingsDrawer.classList.add("open-settings");
  }

  function closeSettingsPanel() {
    settingsDrawer.classList.remove("open-settings");
  }

  // Bind forms and drawer btns
  settingsOpenBtn.addEventListener("click", openSettingsPanel);
  settingsCloseBtn.addEventListener("click", closeSettingsPanel);
  customizerForm.addEventListener("submit", handleSaveForm);
  resetConfigBtn.addEventListener("click", handleResetConfig);

  // --- CONFIG IMPORT/EXPORT (JSON) ---
  exportConfigBtn.addEventListener("click", () => {
    const rawData = JSON.stringify(config, null, 2);
    const blob = new Blob([rawData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create temporary downloder anchor link
    const a = document.createElement("a");
    const safeName = config.recipientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `bday_config_${safeName}.json`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  });

  importConfigInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Simple keys verification to avoid code injections or crashes
        if (importedData.recipientName && importedData.giftSurprise) {
          saveBirthdayConfig(importedData);
          initApp();
          closeSettingsPanel();
          alert("Birthday Configuration imported successfully! Enjoy the updated surprise. 💝");
        } else {
          alert("Invalid configuration file schema. Ensure it's exported right from this page.");
        }
      } catch (err) {
        alert("Error loading JSON config file: " + err.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input value
    e.target.value = "";
  });


  // --- TAB NAVIGATION DISPLAY EVENT LISTENERS ---
  const tabsMap = {
    "tabLetter": { btn: document.getElementById("tabBtnLetter"), pane: document.getElementById("tabLetter") },
    "tabMemories": { btn: document.getElementById("tabBtnMemories"), pane: document.getElementById("tabMemories") },
    "tabBalloons": { btn: document.getElementById("tabBtnBalloons"), pane: document.getElementById("tabBalloons") },
    "tabGift": { btn: document.getElementById("tabBtnGift"), pane: document.getElementById("tabGift") }
  };

  function switchTab(targetTabId) {
    if (!isUnlocked) return; // Keep locked if user hasn't gotten past the gateway
    
    // Deactivate all, activate target
    Object.keys(tabsMap).forEach(key => {
      const tab = tabsMap[key];
      if (key === targetTabId) {
        tab.btn.classList.add("active-tab");
        tab.pane.classList.remove("hidden");
      } else {
        tab.btn.classList.remove("active-tab");
        tab.pane.classList.add("hidden");
      }
    });

    // Custom actions upon tab transition load
    if (targetTabId === "tabLetter") {
      startTypewriter();
    } else {
      // Pause letter typewriter if user navigates away mid-typing
      typewriterActive = false;
    }

    if (targetTabId === "tabBalloons") {
      initBalloonGame();
    } else {
      isGameRunning = false;
      if (gameAnimationId) cancelAnimationFrame(gameAnimationId);
    }
  }

  // Bind tab listeners
  Object.keys(tabsMap).forEach(key => {
    tabsMap[key].btn.addEventListener("click", () => switchTab(key));
  });

});
