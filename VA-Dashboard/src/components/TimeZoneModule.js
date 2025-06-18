let timezoneList = [];

export async function createWorldClock(initialZone = 'Asia/Manila') {
  if (!timezoneList.length) {
    timezoneList = await fetchTimezones();
  }

  const container = document.createElement('div');
  container.className = 'world-clock widget';

  const uniqueId = `timezone-options-${Math.random().toString(36).substr(2, 5)}`;

  container.innerHTML = `
    <div style="position: relative;">
      <input 
        type="text" 
        class="timezone-input" 
        list="${uniqueId}" 
        value="${initialZone}" 
        placeholder="Select time zone..." 
        style="width: 100%; padding: 6px;"
      />
      <datalist id="${uniqueId}">
        ${timezoneList.map(zone => `<option value="${zone}"></option>`).join('')}
      </datalist>
    </div>
    <div class="clock-time" style="font-size: 1.5rem; margin-top: 0.5em;">--:--</div>
  `;

  const inputEl = container.querySelector('.timezone-input');
  const timeEl = container.querySelector('.clock-time');

  let currentZone = initialZone;
  let intervalId;

  async function updateTime() {
    try {
      const res = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(currentZone)}`);
      if (!res.ok) throw new Error('Time API error');
      const data = await res.json();

      const dt = new Date(data.dateTime);
      timeEl.textContent = dt.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      });

      const seconds = dt.getSeconds();
      const delay = (60 - seconds) * 1000;
      clearTimeout(intervalId);
      intervalId = setTimeout(updateTime, delay);
    } catch (error) {
      console.error(`Time fetch error for ${currentZone}:`, error);
      timeEl.textContent = '⛔ Invalid zone';
    }
  }

  function startClock(zone) {
    currentZone = zone;
    clearTimeout(intervalId);
    updateTime();
  }

  startClock(initialZone);

  inputEl.addEventListener('change', () => {
    const newZone = inputEl.value.trim();
    if (timezoneList.includes(newZone)) {
      startClock(newZone);
    } else {
      timeEl.textContent = '❌ Unknown zone';
    }
  });

  return container;
}

async function fetchTimezones() {
  try {
    const res = await fetch('https://timeapi.io/api/TimeZone/AvailableTimeZones');
    if (!res.ok) throw new Error('Failed to fetch timezone list');
    return await res.json();
  } catch (err) {
    console.error('Could not load timezones:', err);
    return ['Asia/Manila', 'Europe/London', 'America/New_York'];
  }
}
