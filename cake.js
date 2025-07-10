
   const flame = document.getElementById('flame');
    const message = document.getElementById('message');
    const blowButton = document.getElementById('blowButton');
    const meter = document.getElementById('meter');

    let audioContext, analyser, mic, dataArray;

    async function startMicBlowDetection() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        mic.connect(analyser);
        detectBlow();
      } catch (err) {
        alert('Microphone access denied or not supported.');
        console.error(err);
      }
    }

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Update meter
      const volumePercent = Math.min(volume * 2, 100); // Scale and cap at 100%
      meter.style.width = volumePercent + '%';

      if (volume > 50) {  // Adjust this threshold as needed
        flame.style.display = 'none';
        message.style.display = 'block';
      } else {
        requestAnimationFrame(detectBlow);
      }
    }

    blowButton.addEventListener('click', () => {
      blowButton.disabled = true;
      blowButton.textContent = "Listening... Blow 🎤";
      startMicBlowDetection();
    });