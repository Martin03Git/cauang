// Cauang — InsightView

class InsightView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.selectedMonth = '';
    this.chart = null;
  }

  render() {
    if (!this.selectedMonth) {
      const now = new Date();
      this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    this.container.innerHTML = `
      <h2 class="text-lg font-bold text-gray-800 mb-4">Ringkasan & Insight</h2>

      <div class="mb-4">
        <div class="relative cursor-pointer">
          <input type="text" id="bulan-display" value="${this._formatMonthID(this.selectedMonth)}" readonly
            class="w-full px-4 py-2.5 pr-10 bg-white rounded-xl text-sm text-gray-700 border border-gray-200 outline-none" />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>
          <input id="insight-month" type="month" value="${this.selectedMonth}"
            class="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div id="insight-content"></div>
    `;

    // Month picker — sync display + render on change
    document.getElementById('insight-month').addEventListener('change', (e) => {
      this.selectedMonth = e.target.value;
      document.getElementById('bulan-display').value = this._formatMonthID(e.target.value);
      this.renderContent();
    });
    // Fallback: tap area mana aja → open picker
    document.getElementById('insight-month').parentElement.addEventListener('click', () => {
      document.getElementById('insight-month').showPicker();
    });

    this.renderContent();
  }

  _formatMonthID(val) {
    const [y, m] = val.split('-');
    return `${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
  }

  renderContent() {
    const content = document.getElementById('insight-content');
    let transactions = Storage.getTransactions();

    // Filter by selected month
    transactions = transactions.filter(t => t.date.startsWith(this.selectedMonth));

    if (transactions.length === 0) {
      if (this.chart) { this.chart.destroy(); this.chart = null; }
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
          <p class="text-sm font-medium text-gray-500">Belum ada transaksi</p>
          <p class="text-xs text-gray-400 mt-1">Catat pengeluaran dulu ya!</p>
        </div>
      `;
      return;
    }

    const total = transactions.reduce((s, t) => s + t.amount, 0);
    const avg = this.calcDailyAvg(transactions, total);

    // Category totals
    const catTotals = {};
    transactions.forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

    // Insight message
    const topEntry = sorted[0];
    const topCat = CATEGORIES.find(c => c.id === topEntry[0]);
    const topPct = Math.round((topEntry[1] / total) * 100);
    const topLabel = topCat ? topCat.label : topEntry[0];
    const topIcon = topCat ? CATEGORY_SVGS[topCat.icon] : '';

    content.innerHTML = `
      <!-- Total Card -->
      <div class="dashboard-card bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-2xl p-5 text-white mb-4 shadow-md">
        <p class="text-xs font-medium text-indigo-200 uppercase tracking-wide">Total Pengeluaran</p>
        <p class="text-3xl font-bold mt-1 tracking-tight">${formatCompactCurrency(total)}</p>
        <p class="text-sm text-indigo-200 mt-1">Rata-rata ${formatCurrency(avg)}/hari</p>
      </div>

      <!-- Donut Chart Card -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <p class="text-sm font-medium text-gray-500 mb-3">Distribusi Kategori</p>
        <div class="flex justify-center">
          <canvas id="insight-chart" height="220" width="220"></canvas>
        </div>
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
          ${sorted.map(([id]) => {
            const c = CATEGORIES.find(cat => cat.id === id);
            return `<span class="flex items-center gap-1.5 text-xs text-gray-500">
              <span class="w-2.5 h-2.5 rounded-full" style="background:${CATEGORY_COLORS[id] || '#6B7280'}"></span>
              ${c ? c.label : id}
            </span>`;
          }).join('')}
        </div>
      </div>

      <!-- Insight Message -->
      <div class="bg-indigo-50 rounded-2xl p-5 mb-4 border border-indigo-100">
        <div class="flex items-start gap-3">
          <span class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">${topIcon}</span>
          <div>
            <p class="text-sm font-medium text-indigo-800">
              Pengeluaran terbesar ada di <strong>${topLabel}</strong>,
              yaitu ${formatCurrency(topEntry[1])} (${topPct}% dari total)
            </p>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p class="text-sm font-medium text-gray-500 mb-1">Rincian Kategori</p>
        ${sorted.map(([id, amt]) => {
          const pct = Math.round((amt / total) * 100);
          const c = CATEGORIES.find(cat => cat.id === id);
          return `
            <div class="flex items-center gap-3 py-2.5">
              <span class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">${CATEGORY_SVGS[c?.icon || 'ellipsis-horizontal']}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">${c ? c.label : id}</span>
                  <span class="text-xs font-bold text-gray-800">${pct}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div class="h-2 rounded-full" style="width:${Math.max(pct, 3)}%;background-color:${CATEGORY_COLORS[id] || '#6B7280'}"></div>
                </div>
              </div>
              <span class="text-sm font-bold text-gray-800 shrink-0">${formatCompactCurrency(amt)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.initChart(sorted, total);
  }

  calcDailyAvg(transactions, total) {
    const [y, m] = this.selectedMonth.split('-').map(Number);
    const now = new Date();
    const isCurrent = now.getFullYear() === y && now.getMonth() + 1 === m;
    // ponytail: if current month, use days elapsed; if past month, use total days
    const days = isCurrent ? now.getDate() : new Date(y, m, 0).getDate();
    return Math.round(total / days);
  }

  initChart(data, total) {
    if (this.chart) { this.chart.destroy(); this.chart = null; }
    const ctx = document.getElementById('insight-chart');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(([id]) => CATEGORIES.find(c => c.id === id)?.label || id),
        datasets: [{
          data: data.map(([, amt]) => amt),
          backgroundColor: data.map(([id]) => CATEGORY_COLORS[id] || '#6B7280'),
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const pct = Math.round((val / total) * 100);
                return ` ${ctx.label}: ${formatCompactCurrency(val)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%',
      }
    });
  }
}
