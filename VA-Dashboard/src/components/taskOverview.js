import { loadTasks } from './TaskManagerModule.js';

export function createTaskOverview() {
  const TaskOverviewModuleCard = document.createElement('div');
  TaskOverviewModuleCard.className = 'task-overview-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = 'Task Overview';

  const taskSummaryContainer = document.createElement('div');
  taskSummaryContainer.className = 'task-summary-container';

  const taskSummary = document.createElement('div');
  taskSummary.className = 'task-summary';
  taskSummary.innerHTML = `
    <p><strong style="color: var(--color-text);">Total Tasks:</strong> <span id="total-count">0</span></p>
    <p><strong style="color: #f44336;">To Do:</strong> <span id="todo-count">0</span></p>
    <p><strong style="color: #ff9800;">In Progress:</strong> <span id="in-progress-count">0</span></p>
    <p><strong style="color: #4caf50;">Done:</strong> <span id="done-count">0</span></p>
  `;

  taskSummaryContainer.appendChild(taskSummary);

  const chartColumn = document.createElement('div');
  chartColumn.className = 'chart-column';
  chartColumn.style.display = 'flex';
  chartColumn.style.flexDirection = 'column';
  chartColumn.style.alignItems = 'center';

  const taskChart = document.createElement('canvas');
  taskChart.id = 'task-chart';
  taskChart.width = 200;
  taskChart.height = 180;

  chartColumn.appendChild(taskChart);

  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  chartContainer.style.display = 'flex';
  chartContainer.style.gap = '1rem';
  chartContainer.style.justifyContent = 'space-between';

  chartContainer.appendChild(taskSummaryContainer);
  chartContainer.appendChild(chartColumn);

  TaskOverviewModuleCard.appendChild(titleEl);
  TaskOverviewModuleCard.appendChild(chartContainer);

  return TaskOverviewModuleCard;
}