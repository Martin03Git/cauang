// Cauang — helpers

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

function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
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

function showConfirmModal(desc, amount, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40';

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl w-[300px] p-6 shadow-xl mx-4">
      <div class="flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">Hapus Transaksi</h3>
        <p class="text-sm text-gray-500 mb-1">${desc}</p>
        <p class="text-xl font-bold text-gray-800 mb-6">${amount}</p>
        <div class="flex gap-3 w-full">
          <button id="confirm-cancel" class="flex-1 py-3 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Batal</button>
          <button id="confirm-ok" class="flex-1 py-3 bg-red-500 text-white font-medium text-sm rounded-xl hover:bg-red-600 transition-colors cursor-pointer">Hapus</button>
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
