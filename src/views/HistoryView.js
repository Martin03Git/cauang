// Cauang — HistoryView

class HistoryView {
  constructor(containerId, onEdit) {
    this.container = document.getElementById(containerId);
    this.onEdit = onEdit;
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.selectedCategory = null;
    this.selectedMonth = '';
  }

  render() {
    this.container.innerHTML = `
      <h2 class="text-lg font-bold text-gray-800 mb-4">Riwayat Transaksi</h2>

      <!-- Filter Tabs -->
      <div class="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        ${['today', 'week', 'month', 'all'].map(f => `
          <button class="filter-btn flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${this.activeFilter === f ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}"
                  data-filter="${f}">
            ${f === 'today' ? 'Hari Ini' : f === 'week' ? 'Minggu Ini' : f === 'month' ? 'Bulan Ini' : 'Semua'}
          </button>
        `).join('')}
      </div>

      <!-- Bulan picker (overrides tab filter) -->
      <div class="mb-4">
        <input id="month-filter" type="month" value="${this.selectedMonth}"
          class="w-full px-4 py-2.5 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 outline-none focus:border-indigo-400 transition-colors" />
      </div>

      <!-- Search -->
      <div class="relative mb-4">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
        <input id="history-search" type="text" placeholder="Cari transaksi..." value="${this.searchQuery}"
          class="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 outline-none focus:border-indigo-400 transition-colors" />
      </div>

      <!-- Kategori Chips -->
      <div class="chip-scroll flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        <button class="chip-btn flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${!this.selectedCategory ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}"
                data-category="">Semua</button>
        ${CATEGORIES.map(cat => `
          <button class="chip-btn flex-none px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${this.selectedCategory === cat.id ? 'bg-indigo-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}"
                  data-category="${cat.id}">${cat.label}</button>
        `).join('')}
      </div>

      <!-- Transaction List -->
      <div id="history-list"></div>
    `;

    this.attachEvents();
    this.renderList();

    // Restore chip scroll position after chip click
    if (this._chipScrollLeft) {
      requestAnimationFrame(() => {
        const el = document.querySelector('.chip-scroll');
        if (el) el.scrollLeft = this._chipScrollLeft;
        this._chipScrollLeft = 0;
      });
    }
  }

  attachEvents() {
    // Filter clicks
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.dataset.filter;
        this.selectedMonth = '';
        this.render();
      });
    });

    // Month picker
    document.getElementById('month-filter').addEventListener('change', (e) => {
      this.selectedMonth = e.target.value;
      this.activeFilter = 'all';
      this.render();
    });

    // Chip clicks
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.category || null;
        const el = document.querySelector('.chip-scroll');
        this._chipScrollLeft = el ? el.scrollLeft : 0;
        this.render();
      });
    });

    // Search with debounce
    document.getElementById('history-search').addEventListener('input', (e) => {
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => {
        this.searchQuery = e.target.value;
        this.renderList();
      }, 200);
    });
  }

  renderList() {
    const list = document.getElementById('history-list');
    let transactions = this.getFilteredTransactions();

    if (transactions.length === 0) {
      list.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"/></svg>
          <p class="text-sm font-medium text-gray-500">Tidak ada transaksi</p>
        </div>
      `;
      return;
    }

    // Group by date
    const groups = {};
    transactions.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });

    // Total for filtered period
    const total = transactions.reduce((s, t) => s + t.amount, 0);

    let html = `
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs text-gray-400 font-medium">${transactions.length} transaksi</p>
        <p class="text-sm font-bold text-gray-800">${formatCurrency(total)}</p>
      </div>
    `;

    Object.keys(groups).sort().reverse().forEach(date => {
      const dayTotal = groups[date].reduce((s, t) => s + t.amount, 0);
      html += `
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-semibold text-gray-500">${formatDate(date)}</p>
            <p class="text-xs font-medium text-gray-400">${formatCurrency(dayTotal)}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            ${groups[date].map(t => this.renderTransactionItem(t)).join('')}
          </div>
        </div>
      `;
    });

    list.innerHTML = html;
    this.attachItemEvents();
  }

  renderTransactionItem(t) {
    const cat = CATEGORIES.find(c => c.id === t.category);
    const icon = cat ? CATEGORY_SVGS[cat.icon] : '';
    const label = cat ? cat.label : t.category;

    return `
      <div class="flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer hover:bg-gray-50 history-item" data-id="${t.id}">
        <span class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">${icon}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">${t.description || label}</p>
          <p class="text-xs text-gray-400">${label}</p>
        </div>
        <p class="text-sm font-bold text-gray-800 shrink-0">${formatCurrency(t.amount)}</p>
        <button class="delete-btn w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0" data-id="${t.id}">
          <svg class="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </button>
      </div>
    `;
  }

  attachItemEvents() {
    // Click item → edit
    document.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) return;
        const tx = Storage.getTransactionById(el.dataset.id);
        if (tx && this.onEdit) this.onEdit(tx);
      });
    });

    // Delete button
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const tx = Storage.getTransactionById(id);
        if (!tx) return;
        showConfirmModal(
          tx.description || CATEGORIES.find(c => c.id === tx.category)?.label || 'Transaksi',
          formatCurrency(tx.amount),
          () => {
            Storage.deleteTransaction(id);
            this.renderList();
          }
        );
      });
    });
  }

  getFilteredTransactions() {
    let txns = Storage.getTransactions();

    // Month filter overrides tab filter
    if (this.selectedMonth) {
      txns = txns.filter(t => t.date.startsWith(this.selectedMonth));
    } else {
      switch (this.activeFilter) {
        case 'today': txns = txns.filter(t => isToday(t.date)); break;
        case 'week':  txns = txns.filter(t => isThisWeek(t.date)); break;
        case 'month': txns = txns.filter(t => isThisMonth(t.date)); break;
      }
    }

    // Category filter
    if (this.selectedCategory) {
      txns = txns.filter(t => t.category === this.selectedCategory);
    }

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      txns = txns.filter(t =>
        (t.description && t.description.toLowerCase().includes(q)) ||
        (CATEGORIES.find(c => c.id === t.category)?.label.toLowerCase().includes(q))
      );
    }

    return txns.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }
}
