const accessKey = '0b6dc1f449f87487ea5ec9e955bd8bd0'; 

export function ForexConverter() {
  const el = document.getElementById('forex-tab');
  el.innerHTML = `
    <h2>Forex Converter</h2>
    <div class="forex-converter">
      <input type="number" id="amount" placeholder="Enter amount" value="1" />
      <select id="from-currency" disabled>
        <option value="USD" selected>USD - United States Dollar</option>
      </select>
      <span>→</span>
      <select id="to-currency">
        <option>Loading...</option>
      </select>
      <button id="convert-btn" disabled>Convert</button>
    </div>
    <div id="conversion-result"></div>
  `;

  const amountInput = document.getElementById('amount');
  const fromCurrency = document.getElementById('from-currency');
  const toCurrency = document.getElementById('to-currency');
  const convertBtn = document.getElementById('convert-btn');
  const result = document.getElementById('conversion-result');

  // Load list of currencies
  fetch(`https://api.currencylayer.com/list?access_key=${accessKey}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        result.textContent = '❌ Failed to load currencies.';
        return;
      }

      // Clear placeholder
      toCurrency.innerHTML = '';

      const currencies = data.currencies;
      for (const code in currencies) {
        if (code === 'USD') continue; // Skip USD in to-currency list

        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${currencies[code]}`;
        toCurrency.appendChild(option);
      }

      toCurrency.value = 'PHP'; // Default
      convertBtn.disabled = false;
    })
    .catch(() => {
      result.textContent = '❌ Error loading currencies.';
    });

  convertBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    const from = 'USD'; // Always from USD
    const to = toCurrency.value;

    if (!amount || amount <= 0) {
      result.textContent = '⚠️ Please enter a valid amount.';
      return;
    }

    fetch(`https://api.currencylayer.com/live?access_key=${accessKey}&currencies=${to}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          result.textContent = '❌ Failed to fetch conversion rate.';
          return;
        }

        const rate = data.quotes[`USD${to}`];
        if (!rate) {
          result.textContent = '❌ Invalid currency pair.';
          return;
        }

        const converted = amount * rate;
        result.textContent = `${amount} USD = ${converted.toFixed(2)} ${to}`;
      })
      .catch(() => {
        result.textContent = '❌ Error fetching conversion rate.';
      });
  });
}
