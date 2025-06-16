export function createWorldClock(timeZone, label) {
  const container = document.createElement('div');
  container.className = 'world-clock widget';
  container.innerHTML = `
    <h3>${label}</h3>
    <div class="clock-time">--:--:--</div>
  `;

  const timeEl = container.querySelector('.clock-time');

  async function updateTime() {
    try {
      const res = await fetch(`https://worldtimeapi.org/api/timezone/${timeZone}`);
      const data = await res.json();
      const dt = new Date(data.datetime);
      timeEl.textContent = dt.toLocaleTimeString();
    } catch (error) {
      timeEl.textContent = '⛔ Error';
      console.error(`WorldTimeAPI error for ${timeZone}:`, error);
    }
  }

  updateTime();
  setInterval(updateTime, 60 * 1000);

  return container;
}
