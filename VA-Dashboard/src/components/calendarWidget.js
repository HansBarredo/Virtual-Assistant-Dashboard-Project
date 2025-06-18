export async function createCalendarWidget(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  let currentMonth = new Date().getMonth(); // Start with current month

  const calendarContainer = document.createElement('div');
  calendarContainer.className = 'calendar-widget';

  const countrySelect = document.createElement('select');
  countrySelect.id = 'country-select';
  countrySelect.innerHTML = `<option>Loading countries...</option>`;

  const titleEl = document.createElement('h3');
  titleEl.id = 'calendar-title';
  titleEl.textContent = `Calendar - ${getMonthName(currentMonth)} 2025`;

  const daysGrid = document.createElement('div');
  daysGrid.className = 'days-grid';

  // 📦 Container for navigation buttons
  const navButtonsContainer = document.createElement('div');
  navButtonsContainer.className = 'nav-buttons-container';

  const prevButton = document.createElement('button');
  prevButton.textContent = '← Previous';
  prevButton.className = 'nav-button';
  prevButton.addEventListener('click', () => changeMonth(-1));

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next →';
  nextButton.className = 'nav-button';
  nextButton.addEventListener('click', () => changeMonth(1));

  // 📎 Append buttons to nav container
  navButtonsContainer.appendChild(prevButton);
  navButtonsContainer.appendChild(nextButton);

  // 📎 Append all to calendar
  calendarContainer.appendChild(titleEl);
  calendarContainer.appendChild(countrySelect);
  calendarContainer.appendChild(navButtonsContainer);
  calendarContainer.appendChild(daysGrid);
  container.appendChild(calendarContainer);

  generateMonth(daysGrid, currentMonth);

  try {
    const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
    const countries = await response.json();

    countrySelect.innerHTML = countries.map(
      country => `<option value="${country.countryCode}">${country.name}</option>`
    ).join('');

    fetchHolidays(countrySelect.value, currentMonth, daysGrid);
  } catch (error) {
    console.error("Error fetching country list:", error);
    countrySelect.innerHTML = `<option>Error loading countries</option>`;
  }

  countrySelect.addEventListener("change", () => {
    fetchHolidays(countrySelect.value, currentMonth, daysGrid);
  });

  function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) currentMonth = 11;
    if (currentMonth > 11) currentMonth = 0;

    titleEl.textContent = `Calendar - ${getMonthName(currentMonth)} 2025`;
    generateMonth(daysGrid, currentMonth);
    fetchHolidays(countrySelect.value, currentMonth, daysGrid);
  }
}

function generateMonth(daysGrid, month) {
  daysGrid.innerHTML = '';
  const daysInMonth = new Date(2025, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.textContent = day;
    daysGrid.appendChild(dayDiv);
  }
}

function getMonthName(monthIndex) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

async function fetchHolidays(countryCode, month, daysGrid) {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2025/${countryCode}`);
    const holidays = await response.json();

    document.querySelectorAll('.day.holiday').forEach(day => day.classList.remove('holiday'));

    holidays.forEach(holiday => {
      const date = new Date(holiday.date);
      if (date.getMonth() === month) {
        const dayDiv = daysGrid.querySelector(`.day:nth-child(${date.getDate()})`);
        if (dayDiv) {
          dayDiv.classList.add('holiday');
          dayDiv.title = holiday.localName;
        }
      }
    });
  } catch (error) {
    console.error("API Fetch Error:", error);
  }
}
