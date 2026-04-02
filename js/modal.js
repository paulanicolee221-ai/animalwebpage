document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.animal-modal');
  if (!modal) {
    return;
  }

  const overlay = modal.querySelector('.animal-modal-overlay');
  const panel = modal.querySelector('.animal-modal-panel');
  const titleEl = modal.querySelector('.modal-animal-name');
  const imageEl = modal.querySelector('.modal-animal-image');
  const summaryEl = modal.querySelector('.modal-animal-summary');
  const detailsEl = modal.querySelector('.modal-animal-details');
  const triviaEl = modal.querySelector('.modal-animal-trivia');
  const closeBtn = modal.querySelector('.modal-close');

  const openModal = (card) => {
    const name = card.querySelector('h3')?.textContent?.trim() || 'Animal Details';
    const summary = card.querySelector('.animal-summary')?.textContent?.trim() || '';
    const trivia = card.querySelector('.animal-trivia')?.textContent?.trim() || '';
    const image = card.querySelector('.animal-image');
    const imageSrc = image?.getAttribute('src') || '';
    const imageAlt = image?.getAttribute('alt') || name;

    titleEl.textContent = name;
    summaryEl.textContent = summary;
    triviaEl.textContent = trivia;
    imageEl.src = imageSrc;
    imageEl.alt = imageAlt;

    detailsEl.innerHTML = '';
    card.querySelectorAll('.animal-details li').forEach((item) => {
      detailsEl.appendChild(item.cloneNode(true));
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.animal-card').forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
});