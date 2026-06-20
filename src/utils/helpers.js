// Cauang — helpers

function exportToCSV(transactions) {
  transactions = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const BOM = '\uFEFF';
  const sep = ';';
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;

  const header = ['Tanggal', 'Deskripsi', 'Kategori', 'Jumlah'].join(sep);
  const rows = transactions.map(t =>
    [formatDate(t.date), esc(t.description || ''), catLabel(t.category), t.amount].join(sep)
  ).join('\n');

  const blob = new Blob([BOM + header + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cauang-${getTodayStr()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function isThisWeek(dateStr) {
  const today = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return d >= startOfWeek && d <= endOfWeek;
}

function isThisMonth(dateStr) {
  const today = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateID(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
}

function showConfirmModal(title, message, onConfirm, confirmText = 'Hapus') {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40';

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl w-[300px] p-6 shadow-xl mx-4">
      <div class="flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">${title}</h3>
        ${typeof message === 'string'
          ? `<p class="text-sm text-gray-500 mb-6">${message}</p>`
          : `<p class="text-sm text-gray-500 mb-1">${message.desc}</p><p class="text-xl font-bold text-gray-800 mb-6">${message.amount}</p>`}
        <div class="flex gap-3 w-full">
          <button id="confirm-cancel" class="flex-1 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Batal</button>
          <button id="confirm-ok" class="flex-1 py-3 bg-red-500 text-white font-medium text-sm rounded-xl hover:bg-red-600 transition-colors cursor-pointer">${confirmText}</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#confirm-cancel').addEventListener('click', () => overlay.remove());
  overlay.querySelector('#confirm-ok').addEventListener('click', () => {
    overlay.remove();
    onConfirm();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

// Strip existing format, limit digits, return number string with thousand separators
function formatAmountInput(val) {
  const raw = String(val).replace(/\./g, '').replace(/[^0-9]/g, '').slice(0, 13);
  if (raw === '') return '';
  return parseInt(raw, 10).toLocaleString('id-ID');
}

// Compact format: 1.200.000 → Rp1,2 jt, 500.000 → Rp500 rb, 999 → Rp999
function formatCompactCurrency(amount) {
  if (amount >= 1_000_000_000) {
    return `Rp${(amount / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
  }
  if (amount >= 1_000_000) {
    return `Rp${(amount / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`;
  }
  if (amount >= 1_000) {
    return `Rp${(amount / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`;
  }
  return formatCurrency(amount);
}

function showAlertModal(title, message) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40';
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl w-[300px] p-6 shadow-xl mx-4">
      <div class="flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">${title}</h3>
        <p class="text-sm text-gray-500 mb-6">${message}</p>
        <button id="alert-ok" class="w-full py-3 bg-indigo-500 text-white font-medium text-sm rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#alert-ok').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}
