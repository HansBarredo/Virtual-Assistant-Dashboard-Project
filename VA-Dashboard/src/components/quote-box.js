export function QuoteBox() {
  const container = document.getElementById('quote-box');
  container.innerHTML = `
    <div class="quote-container">
      <blockquote id="quote-text">Loading quote...</blockquote>
      <p id="quote-author"></p>
      <button id="new-quote-btn">New Quote</button>
    </div>
  `;

  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote-btn');

  async function fetchQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    } catch (err) {
      quoteText.textContent = 'Failed to load quote.';
      quoteAuthor.textContent = '';
    }
  }

  newQuoteBtn.addEventListener('click', fetchQuote);

  fetchQuote(); 
}
