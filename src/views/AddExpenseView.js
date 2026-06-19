// Cauang — AddExpenseView

class AddExpenseView {
  constructor(containerId, onSave) {
    this.container = document.getElementById(containerId);
    this.onSave = onSave;
    this.selectedCategory = null;
    this.manualOverride = false;
    this.debounceTimer = null;
  }

  render(editTx) {
    this.editTx = editTx || null;
    this.selectedCategory = editTx ? editTx.category : null;
    this.manualOverride = editTx ? true : false;

    this.container.innerHTML = `
      <div class="flex items-center gap-3 mb-5">
        <button id="add-back" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
        </button>
        <h2 class="text-lg font-bold text-gray-800">${editTx ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}</h2>
      </div>

      <!-- 1. Nominal -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <p class="text-sm font-medium text-gray-500 mb-2">Nominal</p>
        <div class="flex items-center border-b-2 border-indigo-500 pb-2">
          <span class="text-lg font-semibold text-gray-400 mr-1">Rp</span>
          <input id="add-amount" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="0" value="${editTx ? editTx.amount : ''}"
            class="flex-1 text-3xl font-bold text-gray-800 outline-none border-none bg-transparent" />
        </div>
      </div>

      <!-- 2. Deskripsi -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <p class="text-sm font-medium text-gray-500 mb-2">Deskripsi <span class="text-gray-300">(opsional)</span></p>
        <input id="add-desc" type="text" placeholder="Mis: Nasi padang, bensin, ..." value="${editTx ? editTx.description : ''}"
          class="w-full text-sm text-gray-700 outline-none border-b border-gray-200 pb-2 focus:border-indigo-400 transition-colors bg-transparent" />
      </div>

      <!-- 3. Kategori -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-medium text-gray-500">Kategori</p>
          <span id="auto-cat-label" class="text-[11px] text-gray-400 italic"></span>
        </div>
        <div class="grid grid-cols-4 gap-2">
          ${CATEGORIES.map(cat => `
            <button class="cat-btn flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 ${this.selectedCategory === cat.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'} hover:border-indigo-200 transition-all cursor-pointer"
                    data-category="${cat.id}">
              <span class="w-9 h-9 flex items-center justify-center">${CATEGORY_SVGS[cat.icon]}</span>
              <span class="text-[11px] font-medium text-gray-600 text-center leading-tight">${cat.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 4. Tanggal -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <p class="text-sm font-medium text-gray-500 mb-2">Tanggal</p>
        <input id="add-date" type="date" value="${editTx ? editTx.date : getTodayStr()}"
          class="w-full text-sm text-gray-700 outline-none border-b border-gray-200 pb-2 focus:border-indigo-400 transition-colors bg-transparent" />
      </div>

      <!-- 5. Simpan -->
      <button id="add-save" disabled
        class="w-full py-4 bg-indigo-500 text-white font-bold text-base rounded-2xl shadow-md transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-600 active:scale-[0.98]">
        <span class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          ${editTx ? 'Update' : 'Simpan'}
        </span>
      </button>
    `;

    this.attachEvents();
    this.validateForm();
  }

  attachEvents() {
    document.getElementById('add-back').addEventListener('click', () => {
      this.onSave && this.onSave(this.editTx ? 'history' : 'dashboard');
    });

    // Amount → validate on input
    document.getElementById('add-amount').addEventListener('input', () => this.validateForm());

    // Description → auto-kategori with debounce
    document.getElementById('add-desc').addEventListener('input', (e) => {
      this.validateForm();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.runAutoCategory(e.target.value), 300);
    });

    // Category selection (manual override)
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.manualOverride = true;
        this.selectedCategory = btn.dataset.category;
        this.highlightCategory(this.selectedCategory);
        document.getElementById('auto-cat-label').textContent = '';
        this.validateForm();
      });
    });

    document.getElementById('add-date').addEventListener('change', () => this.validateForm());
    document.getElementById('add-save').addEventListener('click', () => this.handleSave());
  }

  runAutoCategory(text) {
    if (this.manualOverride) return;
    if (!text || text.length < 3) {
      this.clearCategoryHighlight();
      document.getElementById('auto-cat-label').textContent = '';
      return;
    }

    const suggested = Storage.suggestCategory(text);
    if (suggested) {
      this.selectedCategory = suggested;
      this.highlightCategory(suggested);
      const cat = CATEGORIES.find(c => c.id === suggested);
      document.getElementById('auto-cat-label').textContent = cat ? `→ ${cat.label}` : '';
    } else {
      this.clearCategoryHighlight();
      document.getElementById('auto-cat-label').textContent = 'Tidak ditemukan kecocokan';
    }
    this.validateForm();
  }

  highlightCategory(id) {
    document.querySelectorAll('.cat-btn').forEach(b => {
      const active = b.dataset.category === id;
      b.classList.toggle('border-indigo-500', active);
      b.classList.toggle('bg-indigo-50', active);
      b.classList.toggle('border-gray-100', !active);
    });
  }

  clearCategoryHighlight() {
    this.selectedCategory = null;
    document.querySelectorAll('.cat-btn').forEach(b => {
      b.classList.remove('border-indigo-500', 'bg-indigo-50');
      b.classList.add('border-gray-100');
    });
  }

  validateForm() {
    const amount = parseInt(document.getElementById('add-amount').value, 10);
    document.getElementById('add-save').disabled = !(amount > 0 && this.selectedCategory);
  }

  handleSave() {
    const amount = parseInt(document.getElementById('add-amount').value, 10);
    if (!amount || !this.selectedCategory) return;

    const data = {
      amount,
      category: this.selectedCategory,
      date: document.getElementById('add-date').value,
      description: document.getElementById('add-desc').value.trim(),
    };

    if (this.editTx) {
      Storage.updateTransaction(this.editTx.id, data);
    } else {
      Storage.addTransaction(data);
    }

    this.onSave && this.onSave(this.editTx ? 'history' : 'dashboard');
  }
}
