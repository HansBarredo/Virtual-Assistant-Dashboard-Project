import { createTaskOverview } from './components/taskOverview.js';
import { DailyTaskPlanner, loadTasks, updateDashboard, drawChart, loadTaskCounts } from './components/DailyTaskPlanner.js';
import { createCalendarWidget } from './components/calendarWidget.js';
import { createWorldClock } from './components/WorldClock.js';
import { createPomodoroTimer } from './components/Pomodoro.js';
import { createQuoteWidget } from './components/QuoteWidget.js';
import { ForexConverter } from './components/ForexConverter.js';


const tabs = document.querySelectorAll('.tab-nav button');
const tabContents = document.querySelectorAll('.tab-content');

function initTabs() {
  tabs.forEach(btn => {
    btn.addEventListener('click', async () => {
      tabContents.forEach(tc => tc.classList.add('hidden'));
      document.getElementById(`${btn.dataset.tab}-tab`).classList.remove('hidden');

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

  const pomodoroTimer = await createPomodoroTimer();
  dashboardGrid.appendChild(pomodoroTimer);

  const taskOverview = createTaskOverview();
  dashboardGrid.appendChild(taskOverview);

  const taskState = loadTasks();
  updateDashboard(taskState);

  // ✅ Add this line to draw chart using current task data
  drawChart(loadTaskCounts());

  await createCalendarWidget('dashboard-grid');

  try {
    const manilaClock = await createWorldClock('Asia/Manila', 'Philippines');
    const londonClock = await createWorldClock('Europe/London', 'London');
    const newYorkClock = await createWorldClock('America/New_York', 'New York');

    dashboardGrid.appendChild(manilaClock);
    dashboardGrid.appendChild(londonClock);
    dashboardGrid.appendChild(newYorkClock);
  } catch (error) {
    console.error('Failed to load world clocks:', error);
  }

  const quoteWidget = await createQuoteWidget();
  dashboardGrid.appendChild(quoteWidget);
}


window.addEventListener('DOMContentLoaded', initTabs);
