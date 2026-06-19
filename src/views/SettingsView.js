// Cauang — SettingsView

class SettingsView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    const now = new Date();
    this.dateStart = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
    this.dateEnd = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }

  render() {
    const budget = Storage.getBudget();

    this.container.innerHTML = `
      <h2 class="text-lg font-bold text-gray-800 mb-4">Pengaturan</h2>

      <!-- Budget -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
          <p class="text-sm font-medium text-gray-500">Budget Bulanan</p>
        </div>
        <div class="flex items-center border-b-2 border-indigo-500 pb-2 mb-4">
          <span class="text-sm font-semibold text-gray-400 mr-1">Rp</span>
          <input id="settings-budget" type="text" inputmode="numeric" pattern="[0-9]*" value="${budget.amount || ''}" placeholder="0"
            class="flex-1 text-xl font-bold text-gray-800 outline-none border-none bg-transparent" />
        </div>
        <button id="settings-save-budget"
          class="w-full py-3 bg-indigo-500 text-white font-semibold text-sm rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer active:scale-[0.98]">
          Simpan Budget
        </button>
        <p id="settings-budget-msg" class="text-xs text-center mt-2 hidden"></p>
      </div>

      <!-- Donasi -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex gap-3 items-start">
          <span class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>
          </span>
          <div>
            <p class="text-sm font-medium text-gray-700">Dukung Developer</p>
            <p class="text-xs text-gray-500 mt-0.5 mb-3">Biar semangat bikin app gratis lainnya!</p>
            <a href="https://trakteer.id/martin.dev" target="_blank" rel="noopener"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>
              Trakteer
            </a>
          </div>
        </div>
      </div>

      <!-- Export -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
          <p class="text-sm font-medium text-gray-500">Ekspor Data</p>
        </div>
        <p class="text-xs text-gray-400 mb-4">Pilih periode transaksi untuk diekspor ke CSV.</p>
        <button id="export-trigger" type="button" class="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
          <span id="export-range-display">${this._formatDateShort(this.dateStart)} – ${this._formatDateShort(this.dateEnd)} ${this.dateEnd.split('-')[0]}</span>
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7"/></svg>
        </button>
      </div>

      <!-- Reset -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-red-100 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          <p class="text-sm font-medium text-gray-500">Reset Data</p>
        </div>
        <p class="text-xs text-gray-400 mb-4">Hapus semua transaksi dan budget. Data tidak bisa dikembalikan.</p>
        <button id="settings-reset"
          class="w-full py-3 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-colors cursor-pointer active:scale-[0.98]">
          Hapus Semua Data
        </button>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    document.getElementById('settings-save-budget').addEventListener('click', () => {
      const amount = parseInt(document.getElementById('settings-budget').value.replace(/[^0-9]/g, ''), 10);
      const msg = document.getElementById('settings-budget-msg');
      if (!amount || amount < 1) {
        msg.className = 'text-xs text-center mt-2 text-red-500';
        msg.textContent = 'Masukkan nominal budget yang valid';
        msg.classList.remove('hidden');
        return;
      }
      Storage.saveBudget({ amount });
      msg.className = 'text-xs text-center mt-2 text-emerald-500';
      msg.textContent = 'Budget berhasil disimpan!';
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('hidden'), 2500);
    });

    document.getElementById('export-trigger').addEventListener('click', () => this._openExportModal());

    document.getElementById('settings-reset').addEventListener('click', () => {
      showConfirmModal(
        'Hapus Semua Data',
        'Semua transaksi dan budget akan dihapus permanen.',
        () => {
          Storage.resetAll();
          window.location.reload();
        },
        'Hapus Semua'
      );
    });
  }

  // ── export modal ────────────────────────────────

  _openExportModal() {
    const txns = Storage.getTransactions();
    if (txns.length === 0) {
      const btn = document.getElementById('export-trigger');
      const span = btn.querySelector('span');
      const orig = span.textContent;
      span.textContent = 'Tidak ada data';
      setTimeout(() => { span.textContent = orig; }, 2000);
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl w-[320px] p-6 shadow-xl mx-4">
        <h3 class="text-lg font-bold text-gray-800 mb-5 text-center">Ekspor CSV</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Dari</label>
            <div class="relative cursor-pointer">
              <input type="text" id="export-dari-display" value="${this._formatDateID(this.dateStart)}" readonly
                class="w-full px-4 py-2.5 pr-10 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 outline-none" />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>
              <input type="date" id="export-date-start" value="${this.dateStart}"
                class="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Sampai</label>
            <div class="relative cursor-pointer">
              <input type="text" id="export-sampai-display" value="${this._formatDateID(this.dateEnd)}" readonly
                class="w-full px-4 py-2.5 pr-10 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 outline-none" />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>
              <input type="date" id="export-date-end" value="${this.dateEnd}"
                class="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button id="export-modal-cancel" class="flex-1 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Batal</button>
          <button id="export-modal-exec" class="flex-1 py-3 bg-indigo-500 text-white font-medium text-sm rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer">Ekspor</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('export-date-start').addEventListener('change', (e) => {
      document.getElementById('export-dari-display').value = this._formatDateID(e.target.value);
    });
    document.getElementById('export-date-end').addEventListener('change', (e) => {
      document.getElementById('export-sampai-display').value = this._formatDateID(e.target.value);
    });
    document.querySelectorAll('#export-date-start, #export-date-end').forEach(el => {
      el.addEventListener('click', () => el.showPicker());
    });

    modal.querySelector('#export-modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('#export-modal-exec').addEventListener('click', () => {
      const start = document.getElementById('export-date-start').value;
      const end = document.getElementById('export-date-end').value;
      if (!start || !end) return;
      if (end < start) return;
      this.dateStart = start;
      this.dateEnd = end;
      const filtered = Storage.getTransactions().filter(t => t.date >= start && t.date <= end);
      if (filtered.length === 0) return;
      exportToCSV(filtered);
      modal.remove();
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  // ── helpers ──────────────────────────────────────

  _formatDateID(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  _formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
  }
}
