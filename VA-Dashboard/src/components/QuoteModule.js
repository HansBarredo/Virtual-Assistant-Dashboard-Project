// src/components/QuoteWidget.js

export async function createQuoteWidget() {
  const container = document.createElement('div');
  container.className = 'quote-widget widget';

  // Initial structure with empty placeholders
  container.innerHTML = `
    <div class="quote-row">
      <div class="quote-main">
        <div class="quote-text">Loading quote...</div>
        <div class="quote-author"></div>
      </div>
      <div class="quote-meta">
        <p><strong>Category:</strong> <span class="quote-category"></span></p>
        <p><strong>Tags:</strong> <span class="quote-tags"></span></p>
        <p><strong>Source:</strong> <span class="quote-source"></span></p>
        <p><strong>Year:</strong> <span class="quote-year"></span></p>
        <p><strong>Country:</strong> <span class="quote-country"></span></p>
        <p><strong>Language:</strong> <span class="quote-language"></span></p>
      </div>
    </div>
    <button class="new-quote-btn">🔁 New Quote</button>
  `;

  // DOM references
  const quoteText = container.querySelector('.quote-text');
  const quoteAuthor = container.querySelector('.quote-author');
  const quoteCategory = container.querySelector('.quote-category');
  const quoteTags = container.querySelector('.quote-tags');
  const quoteSource = container.querySelector('.quote-source');
  const quoteYear = container.querySelector('.quote-year');
  const quoteCountry = container.querySelector('.quote-country');
  const quoteLanguage = container.querySelector('.quote-language');
  const button = container.querySelector('.new-quote-btn');

  async function fetchQuotes() {
    try {
      const response = await fetch('/s/quotes.json'); 
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
      quoteCategory.textContent = quote.category || 'N/A';
      quoteTags.textContent = (quote.tags || []).join(', ');
      quoteSource.textContent = quote.source || 'N/A';
      quoteYear.textContent = quote.year || 'N/A';
      quoteCountry.textContent = quote.country || 'N/A';
      quoteLanguage.textContent = quote.language || 'N/A';
    } else {
      quoteText.textContent = "Couldn't load quotes.";
      quoteAuthor.textContent = '';
    }
  }

  button.addEventListener('click', showRandomQuote);

  showRandomQuote();

  return container;
}
