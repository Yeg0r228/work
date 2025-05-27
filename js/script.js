fetch('js/info.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#projects-table tbody');
    const departmentFilter = document.getElementById('department-filter');
    const regionFilter = document.getElementById('region-filter');
    const searchInput = document.getElementById('search-input');

    // Зібрати унікальні відділення та області
    const departments = Array.from(new Set(data.map(i => i.department).filter(Boolean))).sort();
    const regions = Array.from(new Set(data.map(i => i.region).filter(Boolean))).sort();

    departments.forEach(dep => {
      const opt = document.createElement('option');
      opt.value = dep;
      opt.textContent = dep;
      departmentFilter.appendChild(opt);
    });
    regions.forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg;
      opt.textContent = reg;
      regionFilter.appendChild(opt);
    });

    function renderTable() {
      const depVal = departmentFilter.value;
      const regVal = regionFilter.value;
      const searchVal = searchInput.value.trim().toLowerCase();

      tbody.innerHTML = '';
      data.forEach(item => {
        if (
          (depVal === '' || item.department === depVal) &&
          (regVal === '' || item.region === regVal) &&
          (
            !searchVal ||
            (item.title && item.title.toLowerCase().includes(searchVal)) ||
            (item.number && item.number.toLowerCase().includes(searchVal)) ||
            (item.department && item.department.toLowerCase().includes(searchVal)) ||
            (item.region && item.region.toLowerCase().includes(searchVal))
          )
        ) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.number || ''}</td>
            <td>${item.title || ''}</td>
            <td>${item.department || ''}</td>
            <td>${item.region || ''}</td>
            <td>${item.detailsLink ? `<a href="${item.detailsLink}" target="_blank">Натиснути</a>` : ''}</td>
            <td>${item.posterLink ? `<a href="${item.posterLink}" target="_blank">Натиснути</a>` : ''}</td>
          `;
          tbody.appendChild(row);
        }
      });
    }

    departmentFilter.addEventListener('change', renderTable);
    regionFilter.addEventListener('change', renderTable);
    searchInput.addEventListener('input', renderTable);

    renderTable();
  });