import { DailyTaskPlanner } from './components/DailyTaskPlanner.js';
import { ForexConverter } from './components/ForexConverter.js';
import { createPomodoroTimer } from './components/Pomodoro.js';

// DOM Selectors
const tabs = document.querySelectorAll('.tab-nav button');
const tabContents = document.querySelectorAll('.tab-content');
const dashboardGrid = document.getElementById('dashboard-grid');

function initTabs() {
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {

      tabContents.forEach(tc => tc.classList.add('hidden'));
      
      const key = btn.dataset.tab;
      const target = document.getElementById(`${key}-tab`);
      if (target) target.classList.remove('hidden');

      if (key === 'task-planner') DailyTaskPlanner();
      else if (key === 'forex') ForexConverter();
      else if (key === 'dashboard') loadDashboard();
    });
  });


  document.querySelector('[data-tab="dashboard"]').click();
}


function loadDashboard() {
  dashboardGrid.innerHTML = '';
  dashboardGrid.appendChild(createPomodoroTimer());
}


window.addEventListener('DOMContentLoaded', () => {
  initTabs();
});
