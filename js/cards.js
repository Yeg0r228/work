fetch('js/info.json')
  .then(response => response.json())
  .then(data => {
    const cardsContainer = document.getElementById('cards-container');
    const departmentFilter = document.getElementById('department-filter-cards');
    const regionFilter = document.getElementById('region-filter-cards');
    const searchInput = document.getElementById('search-input-cards');

    // Додаємо контейнер для пагінації, якщо його немає
    let pagination = document.getElementById('pagination');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.id = 'pagination';
      pagination.style.display = 'flex';
      pagination.style.justifyContent = 'center';
      pagination.style.gap = '8px';
      pagination.style.margin = '18px 0';
      cardsContainer.parentNode.insertBefore(pagination, cardsContainer);
    }

    // Зібрати унікальні відділення та області
    const departments = Array.from(new Set(data.map(i => i.department).filter(Boolean))).sort();
    const regions = Array.from(new Set(data.map(i => i.region).filter(Boolean))).sort();

    departments.forEach(dep => {
      const option = document.createElement('option');
      option.value = dep;
      option.textContent = dep;
      departmentFilter.appendChild(option);
    });

    regions.forEach(reg => {
      const option = document.createElement('option');
      option.value = reg;
      option.textContent = reg;
      regionFilter.appendChild(option);
    });

    const PAGE_SIZE = 100;
    let currentPage = 1;

    function getFilteredSorted() {
      const depVal = departmentFilter.value;
      const regVal = regionFilter.value;
      const searchVal = searchInput.value.trim().toLowerCase();

      return [...data]
        .sort((a, b) => {
          const aId = Number(a.id || a.ID || a.number || 0);
          const bId = Number(b.id || b.ID || b.number || 0);
          return aId - bId;
        })
        .filter(item => {
          if (depVal && item.department !== depVal) return false;
          if (regVal && item.region !== regVal) return false;
          if (searchVal && !(
            (item.title && item.title.toLowerCase().includes(searchVal)) ||
            (item.department && item.department.toLowerCase().includes(searchVal)) ||
            (item.region && item.region.toLowerCase().includes(searchVal))
          )) return false;
          return true;
        });
    }

    function renderCards() {
      const filtered = getFilteredSorted();
      const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
      if (currentPage > totalPages) currentPage = totalPages || 1;
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const pageItems = filtered.slice(start, end);

      cardsContainer.innerHTML = '';
      pageItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-title">${item.title || 'Без назви'}</div>
          <div class="card-dep">Відділення: ${item.department || '-'}</div>
          <div class="card-region">Регіон: ${item.region || '-'}</div>
          <div class="card-links" style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;">
            ${item.detailsLink ? `<a href="${item.detailsLink}" target="_blank" class="card-btn" style="background:#f9ca24;color:#232526;padding:7px 16px;border-radius:7px;font-weight:600;text-decoration:none;">Детальна інформація</a>` : ''}
            ${item.posterLink ? `<a href="${item.posterLink}" target="_blank" class="card-btn" style="background:#6ab04c;color:#fff;padding:7px 16px;border-radius:7px;font-weight:600;text-decoration:none;">Віртуальний постер</a>` : ''}
          </div>
        `;
        cardsContainer.appendChild(card);
      });

      // Пагінація
      pagination.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          btn.style.padding = '6px 14px';
          btn.style.margin = '0 2px';
          btn.style.borderRadius = '7px';
          btn.style.border = '1.5px solid #f9ca24';
          btn.style.background = i === currentPage ? '#f9ca24' : '#232526';
          btn.style.color = i === currentPage ? '#232526' : '#f9ca24';
          btn.style.fontWeight = '600';
          btn.style.cursor = 'pointer';
          btn.onclick = () => {
            currentPage = i;
            renderCards();
            pagination.scrollIntoView({behavior: 'smooth', block: 'center'});
          };
          pagination.appendChild(btn);
        }
      }
    }

    departmentFilter.addEventListener('change', () => { currentPage = 1; renderCards(); });
    regionFilter.addEventListener('change', () => { currentPage = 1; renderCards(); });
    searchInput.addEventListener('input', () => { currentPage = 1; renderCards(); });

    renderCards();
  });