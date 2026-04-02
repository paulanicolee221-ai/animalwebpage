document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.header-search input[type="search"]');
  if (!searchInput) {
    return;
  }

  const cards = Array.from(document.querySelectorAll('.animal-card'));
  const animalsGrid = document.querySelector('.animals-grid');
  const currentPath = window.location.pathname.split('/').pop();
  const currentPageLetter = /^[A-Z]\.html$/i.test(currentPath)
    ? currentPath.charAt(0).toUpperCase()
    : null;

  const normalizeValue = (value) => {
    return (value || '').toLowerCase();
  };

  const getQueryParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  };

  const setSearchValue = (query) => {
    searchInput.value = query;
  };

  const updateUrlSearch = (query) => {
    if (!currentPageLetter) {
      return;
    }
    const encoded = encodeURIComponent(query);
    const newUrl = `${currentPageLetter}.html${query ? `?search=${encoded}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  };

  const filterCards = () => {
    const query = normalizeValue(searchInput.value.trim());
    let visibleCount = 0;
    let firstVisibleCard = null;

    const exactMatches = [];
    const startsWithMatches = [];

    cards.forEach((card) => {
      const title = card.querySelector('h3')?.textContent || '';
      const name = normalizeValue(title);
      if (name === query) {
        exactMatches.push(card);
      } else if (name.startsWith(query)) {
        startsWithMatches.push(card);
      }
    });

    const matchedCards = query === '' ? cards : exactMatches.length > 0 ? exactMatches : startsWithMatches;

    cards.forEach((card) => {
      const matches = matchedCards.includes(card);
      card.classList.toggle('hidden', !matches);
      if (matches) {
        visibleCount += 1;
        if (!firstVisibleCard) {
          firstVisibleCard = card;
        }
      }
    });

    let noResults = document.querySelector('.search-empty');
    if (!noResults && animalsGrid) {
      noResults = document.createElement('p');
      noResults.className = 'search-empty hidden';
      noResults.textContent = 'No animals match your search.';
      animalsGrid.insertAdjacentElement('afterend', noResults);
    }

    if (noResults) {
      noResults.classList.toggle('hidden', !(visibleCount === 0 && query !== ''));
    }

    if (visibleCount === 1 && firstVisibleCard) {
      firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      firstVisibleCard.focus({ preventScroll: true });
    }

    if (currentPageLetter) {
      updateUrlSearch(searchInput.value.trim());
    }
  };

  const goToLetterPage = (query) => {
    if (!query) {
      return;
    }
    const letter = query.charAt(0).toUpperCase();
    if (letter < 'A' || letter > 'Z') {
      return;
    }
    const encoded = encodeURIComponent(query);
    if (currentPageLetter === letter && cards.length > 0) {
      setSearchValue(query);
      filterCards();
    } else {
      window.location.href = `${letter}.html?search=${encoded}`;
    }
  };

  if (animalsGrid && cards.length > 0) {
    const initialQuery = getQueryParam('search');
    if (initialQuery) {
      setSearchValue(decodeURIComponent(initialQuery));
      filterCards();
    }

    searchInput.addEventListener('input', filterCards);
    searchInput.addEventListener('search', filterCards);
  }

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        event.preventDefault();
        goToLetterPage(query);
      }
    }
  });
});
