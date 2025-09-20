/**
 * Minimal Solvara Prime Star System - Rocket Navigation Only
 */

document.addEventListener('DOMContentLoaded', function() {
  // Audio player controls
  const playBtn = document.getElementById('play-btn');
  const audioPlayer = document.getElementById('audio-player');
  
  if (playBtn && audioPlayer) {
    let isPlaying = false;
    
    playBtn.addEventListener('click', function() {
      if (isPlaying) {
        audioPlayer.pause();
        playBtn.innerHTML = '▶ LISTEN';
        playBtn.classList.remove('playing');
        isPlaying = false;
      } else {
        audioPlayer.play();
        playBtn.innerHTML = '⏸ PAUSE';
        playBtn.classList.add('playing');
        isPlaying = true;
      }
    });
    
    // Reset button when audio ends
    audioPlayer.addEventListener('ended', function() {
      playBtn.innerHTML = '▶ LISTEN';
      playBtn.classList.remove('playing');
      isPlaying = false;
    });
  }
  
  // Simple word flickering animation
  const flickerText = document.querySelector('.flicker-text');
  if (flickerText) {
    let currentWord = 'MY';
    
    setInterval(() => {
      // Add glitch effect
      flickerText.classList.add('glitching');
      
      // Switch word after glitch starts
      setTimeout(() => {
        currentWord = currentWord === 'MY' ? 'OUR' : 'MY';
        flickerText.textContent = currentWord;
        
        // Remove glitch effect
        setTimeout(() => {
          flickerText.classList.remove('glitching');
        }, 300);
      }, 150);
    }, 4000); // Switch every 4 seconds
  }
  
  // Cache DOM elements
  const player = document.getElementById('player');
  const coordX = document.getElementById('coord-x');
  const coordY = document.getElementById('coord-y');
  
  // Game state variables
  let playerX = 50; // Screen percentage (X: 0)
  let playerY = 85.5; // Screen percentage (Y: 71)
  let keysPressed = {};
  let animationFrameId = null;
  let currentRocketRotation = 0;
  
  // Constants
  const MOVEMENT_SPEED = 1.25;
  const MOVEMENT_KEYS = ['w', 's', 'a', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  
  // Coordinate conversion utilities
  const coordUtils = {
    screenToGameX: (screenX) => Math.floor((screenX - 50) * 2),
    screenToGameY: (screenY) => Math.floor((50 - screenY) * 2)
  };
  
  // Movement handlers
  const setupMovementHandlers = () => {
    document.addEventListener('keydown', (e) => {
      // Prevent default scrolling behavior for arrow keys
      if (MOVEMENT_KEYS.includes(e.key)) {
        e.preventDefault();
      }
      
      keysPressed[e.key] = true;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(moveRocket);
      }
    });
    
    document.addEventListener('keyup', (e) => {
      delete keysPressed[e.key];
      const anyMovementKeyPressed = MOVEMENT_KEYS.some(key => keysPressed[key]);
      if (!anyMovementKeyPressed && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    });
  };
  
  // Main animation function
  function moveRocket() {
    let rotationDegree = null;
    let isMoving = false;
    
    // Process key inputs
    if (keysPressed['ArrowUp'] || keysPressed['w']) {
      playerY = playerY + MOVEMENT_SPEED;
      rotationDegree = 0;
      isMoving = true;
      
      // Check if rocket hits top of screen - trigger scroll up
      if (playerY > 98) {
        playerY = 98;
        // Scroll up by a small amount
        window.scrollBy({
          top: -5,
          behavior: 'instant'
        });
      } else {
        playerY = Math.min(98, playerY);
      }
    }
    
    if (keysPressed['ArrowDown'] || keysPressed['s']) {
      playerY = playerY - MOVEMENT_SPEED;
      rotationDegree = 180;
      isMoving = true;
      
      // Check if rocket hits bottom of screen - trigger scroll down
      if (playerY < 2) {
        playerY = 2;
        // Scroll down by a small amount
        window.scrollBy({
          top: 5,
          behavior: 'instant'
        });
      } else {
        playerY = Math.max(2, playerY);
      }
    }
    
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      playerX = Math.max(5, playerX - MOVEMENT_SPEED);
      rotationDegree = 270;
      isMoving = true;
    }
    
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
      playerX = Math.min(95, playerX + MOVEMENT_SPEED);
      rotationDegree = 90;
      isMoving = true;
    }
    
    // Update position if moving
    if (isMoving) {
      // Only update rotation if it changed
      if (rotationDegree !== null && rotationDegree !== currentRocketRotation) {
        currentRocketRotation = rotationDegree;
      }
      
      // Update rocket position and rotation
      player.style.cssText = `
        position: fixed;
        left: ${playerX}%;
        bottom: ${playerY}%;
        transform: translate(-50%, 50%) rotate(${currentRocketRotation}deg);
        z-index: 9999;
      `;
      
      // Update coordinate displays
      const gridX = coordUtils.screenToGameX(playerX);
      const gridY = coordUtils.screenToGameY(playerY);
      coordX.textContent = `X: ${gridX}`;
      coordY.textContent = `Y: ${gridY}`;
    }
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(moveRocket);
  }
  
  // Set initial player position
  function setInitialPlayerPosition() {
    playerX = 50; // Center horizontally (X: 0)
    playerY = 85.5; // Upper position (Y: 71)
    
    player.style.cssText = `
      position: fixed;
      left: ${playerX}%;
      bottom: ${playerY}%;
      transform: translate(-50%, 50%) rotate(0deg);
      z-index: 9999;
    `;
    
    const gridX = coordUtils.screenToGameX(playerX);
    const gridY = coordUtils.screenToGameY(playerY);
    if (coordX) coordX.textContent = `X: ${gridX}`;
    if (coordY) coordY.textContent = `Y: ${gridY}`;
    
    currentRocketRotation = 0;
  }
  
  // Initialize
  function init() {
    setupMovementHandlers();
    setInitialPlayerPosition();
  }
  
  // Start
  init();
  
  // Newsletter popup functionality
  const newsletterBtn = document.getElementById('newsletter-btn');
  const newsletterPopup = document.getElementById('newsletter-popup');
  const closePopupBtn = document.getElementById('close-popup');
  
  if (newsletterBtn && newsletterPopup) {
    newsletterBtn.addEventListener('click', () => {
      newsletterPopup.style.display = 'flex';
    });
    
    closePopupBtn.addEventListener('click', () => {
      newsletterPopup.style.display = 'none';
    });
    
    // Close popup when clicking outside
    newsletterPopup.addEventListener('click', (e) => {
      if (e.target === newsletterPopup) {
        newsletterPopup.style.display = 'none';
      }
    });
  }
  
  // Mission Control Timer
  const missionTimer = document.getElementById('mission-time');
  if (missionTimer) {
    let seconds = 0;
    setInterval(() => {
      seconds++;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      missionTimer.textContent = `T+ ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
  }
  
  // Visual Feed Gallery
  const feedImages = [
    'https://res.cloudinary.com/duynyjs6q/image/upload/v1758120403/IMG_5575_3_k4cbrk.jpg',
    'https://res.cloudinary.com/duynyjs6q/image/upload/v1758118683/IMG_5577_do1jla.jpg',
    'https://res.cloudinary.com/duynyjs6q/image/upload/v1758118228/IMG_5580_ozbxwx.jpg',
    'https://res.cloudinary.com/duynyjs6q/image/upload/v1758118693/IMG_5571_jkkhcb.jpg',
    'https://res.cloudinary.com/duynyjs6q/image/upload/v1758120441/IMG_5475_rfjlh1.jpg'
  ];
  
  const fallbackImage = './Downloads/seth-portrait.jpg';
  let currentFeedIndex = 0;
  
  const feedImage = document.getElementById('feed-image');
  const feedCounter = document.getElementById('feed-counter');
  const prevFeedBtn = document.getElementById('prev-feed');
  const nextFeedBtn = document.getElementById('next-feed');
  
  function updateFeedCounter() {
    if (feedCounter) {
      feedCounter.textContent = `${String(currentFeedIndex + 1).padStart(2, '0')} / ${String(feedImages.length).padStart(2, '0')}`;
    }
  }
  
  function changeFeedImage(newIndex) {
    if (feedImage) {
      currentFeedIndex = newIndex;
      feedImage.style.opacity = '0';
      setTimeout(() => {
        const newSrc = feedImages[currentFeedIndex];
        const testImg = new Image();
        testImg.onload = function() {
          feedImage.src = newSrc;
          feedImage.style.opacity = '1';
        };
        testImg.onerror = function() {
          feedImage.src = fallbackImage;
          feedImage.style.opacity = '1';
        };
        testImg.src = newSrc;
      }, 300);
      updateFeedCounter();
    }
  }
  
  // Feed navigation
  if (prevFeedBtn) {
    prevFeedBtn.addEventListener('click', () => {
      const newIndex = currentFeedIndex === 0 ? feedImages.length - 1 : currentFeedIndex - 1;
      changeFeedImage(newIndex);
      clearInterval(feedAutoAdvance);
      feedAutoAdvance = setInterval(() => {
        changeFeedImage((currentFeedIndex + 1) % feedImages.length);
      }, 6000);
    });
  }
  
  if (nextFeedBtn) {
    nextFeedBtn.addEventListener('click', () => {
      const newIndex = (currentFeedIndex + 1) % feedImages.length;
      changeFeedImage(newIndex);
      clearInterval(feedAutoAdvance);
      feedAutoAdvance = setInterval(() => {
        changeFeedImage((currentFeedIndex + 1) % feedImages.length);
      }, 6000);
    });
  }
  
  // Auto-advance feed
  let feedAutoAdvance = null;
  if (feedImage && feedImages.length > 1) {
    feedAutoAdvance = setInterval(() => {
      changeFeedImage((currentFeedIndex + 1) % feedImages.length);
    }, 6000);
  }
  
  // Initialize feed counter
  updateFeedCounter();
  
  // Radio Tuner Functionality
  const frequencyDial = document.getElementById('frequency-dial');
  const frequencyDisplay = document.getElementById('frequency-display');
  const stationName = document.getElementById('station-name');
  const tunerNeedle = document.getElementById('tuner-needle');
  const radioPlayBtn = document.getElementById('radio-play');
  const radioAudio = document.getElementById('radio-audio');
  const volumeControl = document.getElementById('volume');
  const stationItems = document.querySelectorAll('.station-item');
  const signalBars = document.querySelectorAll('.signal-bar');
  
  const stations = [
    { freq: '88.1', name: 'THE BED\'S TOO BIG', src: 'https://res.cloudinary.com/duynyjs6q/video/upload/v1757220300/01_The_Bed_s_Too_Big_Without_You_h8bssq.m4a', signal: 3 },
    { freq: '91.5', name: 'SIGNAL LOST', src: null, signal: 1 },
    { freq: '96.3', name: 'STATIC', src: null, signal: 0 },
    { freq: '101.7', name: 'INTERFERENCE', src: null, signal: 2 },
    { freq: '107.9', name: 'DEAD AIR', src: null, signal: 0 }
  ];
  
  // Update radio display when tuning
  if (frequencyDial) {
    frequencyDial.addEventListener('input', function() {
      const stationIndex = parseInt(this.value);
      const station = stations[stationIndex];
      
      // Update frequency display
      frequencyDisplay.textContent = station.freq;
      
      // Update station name
      stationName.textContent = station.name;
      
      // Move tuner needle
      const needlePosition = 10 + (stationIndex * 20);
      tunerNeedle.style.left = needlePosition + '%';
      
      // Update signal strength bars
      signalBars.forEach((bar, index) => {
        if (index < station.signal) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
      
      // Update station list active state
      stationItems.forEach((item, index) => {
        if (index === stationIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // Stop current audio and update source if playing
      if (radioAudio && !radioAudio.paused) {
        radioAudio.pause();
        radioPlayBtn.innerHTML = '▶ PLAY';
        radioPlayBtn.classList.remove('playing');
      }
      
      // Update audio source if available
      if (station.src && radioAudio) {
        radioAudio.src = station.src;
      }
    });
  }
  
  // Station list click handling
  stationItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      frequencyDial.value = index;
      frequencyDial.dispatchEvent(new Event('input'));
    });
  });
  
  // Radio play button
  if (radioPlayBtn && radioAudio) {
    radioPlayBtn.addEventListener('click', function() {
      const stationIndex = parseInt(frequencyDial.value);
      const station = stations[stationIndex];
      
      if (!station.src) {
        // Show static/no signal effect
        stationName.textContent = 'NO SIGNAL';
        setTimeout(() => {
          stationName.textContent = station.name;
        }, 1000);
        return;
      }
      
      if (radioAudio.paused) {
        radioAudio.play();
        this.innerHTML = '⏸ PAUSE';
        this.classList.add('playing');
      } else {
        radioAudio.pause();
        this.innerHTML = '▶ PLAY';
        this.classList.remove('playing');
      }
    });
    
    radioAudio.addEventListener('ended', function() {
      radioPlayBtn.innerHTML = '▶ PLAY';
      radioPlayBtn.classList.remove('playing');
    });
  }
  
  // Volume control
  if (volumeControl && radioAudio) {
    volumeControl.addEventListener('input', function() {
      radioAudio.volume = this.value / 100;
    });
    // Set initial volume
    radioAudio.volume = 0.7;
  }
  
  // CTA buttons (you can update these with actual links later)
  const listenEverywhereBtn = document.querySelector('.listen-everywhere-btn');
  const earlyAccessBtn = document.querySelector('.early-access-btn');
  
  if (listenEverywhereBtn) {
    listenEverywhereBtn.addEventListener('click', function() {
      // Add your streaming platform link here
      window.open('https://linktr.ee/sethpower', '_blank'); // Placeholder
    });
  }
  
  if (earlyAccessBtn) {
    earlyAccessBtn.addEventListener('click', function() {
      // Open newsletter signup
      const newsletterPopup = document.getElementById('newsletter-popup');
      if (newsletterPopup) {
        newsletterPopup.style.display = 'flex';
      }
    });
  }
});
