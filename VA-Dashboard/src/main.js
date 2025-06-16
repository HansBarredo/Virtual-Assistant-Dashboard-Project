import { DailyTaskPlanner } from './components/DailyTaskPlanner.js';
import { ForexConverter } from './components/ForexConverter.js';

// ----------- Constants -------------
const dashboardGrid = document.getElementById('dashboard-grid');
const quoteBox = document.getElementById('quote-box');

// ----------- Tab Navigation -------------
document.querySelectorAll('.tab-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    const selectedTab = document.getElementById(`${btn.dataset.tab}-tab`);
    selectedTab.classList.remove('hidden');

    if (btn.dataset.tab === 'task-planner') {
      DailyTaskPlanner();
    }

    if (btn.dataset.tab === 'forex') {
      ForexConverter();
    }

    if (btn.dataset.tab === 'dashboard') {
      loadDashboardWidgets();
    }
  });
});

// ----------- Dashboard Setup -------------
function loadDashboardWidgets() {
  dashboardGrid.innerHTML = ''; // Clear old widgets

  addWidget(createCalendarWidget());
  addWidget(createPomodoroWidget());
  addWidget(createWorldClockWidget('Asia/Manila', 'Philippines'));
  addWidget(createWorldClockWidget('America/New_York', 'New York'));
  addWidget(createWorldClockWidget('Europe/London', 'London'));
  addWidget(createPieChartWidget());
}

// ----------- Widget Creation Helpers -------------

function addWidget(widget) {
  widget.classList.add('widget');
  makeDraggable(widget);
  dashboardGrid.appendChild(widget);
}

// Calendar widget using JS Date
function createCalendarWidget() {
  const calendar = document.createElement('div');
  calendar.innerHTML = `<h3>Calendar</h3><p>${new Date().toDateString()}</p>`;
  return calendar;
}

// Pomodoro Timer (basic implementation)
function createPomodoroWidget() {
  const pomodoro = document.createElement('div');
  pomodoro.innerHTML = `
    <h3>Pomodoro</h3>
    <p id="pomodoro-time">25:00</p>
    <button id="start-pomodoro">Start</button>
    <button id="reset-pomodoro">Reset</button>
  `;

  let timer;
  let remaining = 25 * 60;

  const display = () => {
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    pomodoro.querySelector('#pomodoro-time').textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  pomodoro.querySelector('#start-pomodoro').addEventListener('click', () => {
    if (timer) return;
    timer = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        display();
      } else {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  });

  pomodoro.querySelector('#reset-pomodoro').addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    remaining = 25 * 60;
    display();
  });

  display();
  return pomodoro;
}

// World Clock
function createWorldClockWidget(timezone, label) {
  const wrapper = document.createElement('div');
  const timeDisplay = document.createElement('p');
  wrapper.innerHTML = `<h3>${label}</h3>`;
  wrapper.appendChild(timeDisplay);

  const updateClock = () => {
    fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Manila")
  .then(res => res.json())
  .then(data => {
    console.log("Current time:", data.dateTime);
  })
      .catch(() => {
        timeDisplay.textContent = 'Failed to load time';
      });
  };

  updateClock();
  setInterval(updateClock, 60 * 1000); // update every minute
  return wrapper;
}

function createPieChartWidget() {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;

  const container = document.createElement('div');
  container.innerHTML = `<h3>Task Status</h3>`;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const taskState = JSON.parse(localStorage.getItem('kanbanTasks')) || {
    todo: [],
    'in-progress': [],
    done: []
  };

  const total = Object.values(taskState).reduce((sum, list) => sum + list.length, 0) || 1;
  const segments = [
    { count: taskState.todo.length, color: '#FF7043' },       // Red
    { count: taskState['in-progress'].length, color: '#FFD54F' }, // Yellow
    { count: taskState.done.length, color: '#66BB6A' }        // Green
  ];

  let start = 0;
  segments.forEach(s => {
    const angle = (s.count / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 80, start, start + angle);
    ctx.fillStyle = s.color;
    ctx.fill();
    start += angle;
  });

  return container;
}

// // Quote Box
// function loadQuote() {
//   fetch('https://api.quotable.io/random')
//     .then(res => res.json())
//     .then(data => {
//       const quoteBox = document.getElementById('quote-box');
//       quoteBox.innerHTML = `<blockquote>"${data.content}"</blockquote><p>- ${data.author}</p>`;
//     })
//     .catch(() => {
//       quoteBox.innerHTML = `<p>Could not load quote.</p>`;
//     });
// }

// ----------- Dragging Logic (Basic) -------------
function makeDraggable(el) {
  el.style.position = 'relative';
  el.style.cursor = 'move';

  let isDragging = false;
  let startX, startY, startLeft, startTop;

  el.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(el.style.left) || 0;
    startTop = parseInt(el.style.top) || 0;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  });

  function onDrag(e) {
    if (!isDragging) return;
    el.style.left = `${startLeft + e.clientX - startX}px`;
    el.style.top = `${startTop + e.clientY - startY}px`;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  }
}

// ----------- Load default tab on refresh -------------
window.addEventListener('DOMContentLoaded', () => {
  loadDashboardWidgets(); // default
});
