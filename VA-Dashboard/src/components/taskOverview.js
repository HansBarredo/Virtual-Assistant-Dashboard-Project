import { loadTasks } from './DailyTaskPlanner.js';

export function createTaskOverview() {
  const taskOverviewCard = document.createElement('div');
  taskOverviewCard.className = 'task-overview-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = 'Task Overview';

  const taskSummary = document.createElement('div');
  taskSummary.className = 'task-summary';
  taskSummary.innerHTML = `
    <p><strong>Total Tasks:</strong> <span id="total-count">0</span></p>
    <p><strong>To Do:</strong> <span id="todo-count">0</span></p>
    <p><strong>In Progress:</strong> <span id="in-progress-count">0</span></p>
    <p><strong>Done:</strong> <span id="done-count">0</span></p>
  `;

  const taskChart = document.createElement('canvas');
  taskChart.id = 'task-chart';
  taskChart.width = 200;
  taskChart.height = 200;

  const chartLegend = document.createElement('div');
  chartLegend.id = 'chart-legend';
  chartLegend.innerHTML = `
    <span class="legend-item" style="color: #f44336;">■ To Do</span>
    <span class="legend-item" style="color: #ff9800;">■ In Progress</span>
    <span class="legend-item" style="color: #4caf50;">■ Done</span>
  `;

  taskOverviewCard.appendChild(titleEl);
  taskOverviewCard.appendChild(taskSummary);
  taskOverviewCard.appendChild(taskChart);
  taskOverviewCard.appendChild(chartLegend);

  return taskOverviewCard;
}
