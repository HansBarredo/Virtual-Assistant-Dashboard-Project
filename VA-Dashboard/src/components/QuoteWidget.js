// src/components/QuoteWidget.js

export async function createQuoteWidget() {
  const container = document.createElement('div');
  container.className = 'quote-widget widget';

  container.innerHTML = `
    <div class="quote-text" style="font-style: italic;">Loading quote...</div>
    <div class="quote-author" style="margin-top: 0.5em; text-align: right;"></div>
    <button class="new-quote-btn" style="margin-top: 1em;">🔁 New Quote</button>
  `;

  const quoteText = container.querySelector('.quote-text');
  const quoteAuthor = container.querySelector('.quote-author');
  const button = container.querySelector('.new-quote-btn');

  async function fetchQuotes() {
    try {
      const response = await fetch('src/js/quotes.json'); // Update with the correct path
      const quotes = await response.json();
      return quotes;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }
  }

  async function showRandomQuote() {
    const quotes = await fetchQuotes();
    if (quotes.length > 0) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteText.textContent = `"${quote.content}"`;
      quoteAuthor.textContent = `— ${quote.author}`;
    } else {
      quoteText.textContent = "Couldn't load quotes.";
      quoteAuthor.textContent = '';
    }
  }

  button.addEventListener('click', showRandomQuote);

  showRandomQuote();

  return container;
}