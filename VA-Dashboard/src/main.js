import { createTaskOverview } from './components/taskOverview.js';
import {
  DailyTaskPlanner,
  loadTasks,
  updateDashboard,
  drawChart,
  loadTaskCounts
} from './components/TaskManagerModule.js';
import { createCalendarWidget } from './components/CalendarModule.js';
import { createWorldClock } from './components/WorldClock.js';
import { createPomodoroTimer } from './components/FocusTimeModule.js';
import { createQuoteWidget } from './components/QuoteModule.js'; // ✅ Ensure named export
import { ForexConverter } from './components/ForexModule.js';

const tabs = document.querySelectorAll('.tab-nav button');
const tabContents = document.querySelectorAll('.tab-content');

function initTabs() {
  tabs.forEach(btn => {
    btn.addEventListener('click', async () => {
      tabContents.forEach(tc => tc.classList.add('hidden'));
      document
        .getElementById(`${btn.dataset.tab}-tab`)
        .classList.remove('hidden');

      if (btn.dataset.tab === 'dashboard') {
        await loadDashboard();
      } else if (btn.dataset.tab === 'task-planner') {
        DailyTaskPlanner();
      } else if (btn.dataset.tab === 'forex') {
        ForexConverter();
      }
    });
  });

  document.querySelector('[data-tab="dashboard"]').click();
}

async function loadDashboard() {
  const dashboardGrid = document.getElementById('dashboard-grid');
  dashboardGrid.innerHTML = '';

  // Pomodoro
  const pomodoroTimer = await createPomodoroTimer();
  pomodoroTimer.classList.add('pomodoro-widget');
  dashboardGrid.appendChild(pomodoroTimer);

  // Calendar
  await createCalendarWidget('dashboard-grid');
  const calendar = dashboardGrid.lastElementChild;
  calendar.classList.add('calendar-widget');

  // Task Overview
  const taskOverview = createTaskOverview();
  taskOverview.classList.add('task-overview-card');
  dashboardGrid.appendChild(taskOverview);

  // Task Stats
  const taskState = loadTasks();
  updateDashboard(taskState);
  drawChart(loadTaskCounts());

  // World Clocks
  try {
    const manilaClock = await createWorldClock('Asia/Manila', 'Philippines');
    const londonClock = await createWorldClock('Europe/London', 'London');
    const newYorkClock = await createWorldClock('America/New_York', 'New York');

    [manilaClock, londonClock, newYorkClock].forEach(clock => {
      clock.classList.add('world-clock');
      dashboardGrid.appendChild(clock);
    });
  } catch (error) {
    console.error('Failed to load world clocks:', error);
  }

  // Quote Widget
  try {
    const quoteWidget = await createQuoteWidget();
    quoteWidget.classList.add('quote-widget');
    dashboardGrid.appendChild(quoteWidget);
  } catch (error) {
    console.error('Failed to load quote widget:', error);
  }
}

window.addEventListener('DOMContentLoaded', initTabs);
