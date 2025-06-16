export function createPomodoroTimer() {
  const container = document.createElement('div');
  container.className = 'pomodoro-widget';
  container.innerHTML = `
    <h3>Pomodoro Timer</h3>
    <div class="timer-display">25:00</div>
    <div class="timer-controls">
      <button class="start-btn">Start</button>
      <button class="pause-btn" disabled>Pause</button>
      <button class="reset-btn" disabled>Reset</button>
    </div>
  `;

  let timer = null;
  let remaining = 25 * 60;

  const displayEl = container.querySelector('.timer-display');
  const startBtn = container.querySelector('.start-btn');
  const pauseBtn = container.querySelector('.pause-btn');
  const resetBtn = container.querySelector('.reset-btn');

  function updateDisplay() {
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    displayEl.textContent = `${m}:${s}`;
  }

  function tick() {
    if (remaining > 0) {
      remaining--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      alert('🎉 Pomodoro complete!');
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = false;
    }
  }

  startBtn.addEventListener('click', () => {
    if (!timer) {
      timer = setInterval(tick, 1000);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
    }
  });

  pauseBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    remaining = 25 * 60;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
  });

  // initialize display
  updateDisplay();

  return container;
}
