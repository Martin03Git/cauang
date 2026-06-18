// Cauang — DashboardView

class DashboardView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    const transactions = Storage.getTransactions();
    const budget = Storage.getBudget();

    if (transactions.length === 0) {
      this.renderEmpty();
      return;
    }

    const spending = this.calculateSpending(transactions, budget);
    this.renderDashboard(spending);
  }

  renderEmpty() {
    this.container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
        <p class="text-base font-medium text-gray-500">Belum ada transaksi</p>
        <p class="text-sm mt-1.5 text-gray-400">Mulai catat pengeluaran pertama kamu!</p>
      </div>
    `;
  }

  calculateSpending(transactions, budget) {
    const today = getTodayStr();
    const todayTotal = transactions
      .filter(t => t.date === today)
      .reduce((sum, t) => sum + t.amount, 0);

    const weekTotal = transactions
      .filter(t => isThisWeek(t.date))
      .reduce((sum, t) => sum + t.amount, 0);

    const monthTotal = transactions
      .filter(t => isThisMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0);

    // Top 3 categories this month
    const catTotals = {};
    transactions.filter(t => isThisMonth(t.date)).forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCategories = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, total]) => {
        const cat = CATEGORIES.find(c => c.id === id);
        return { id, label: cat ? cat.label : id, icon: cat ? cat.icon : 'ellipsis-horizontal', total };
      });

    const balance = budget.amount - monthTotal;

    return { todayTotal, weekTotal, monthTotal, balance, topCategories, budget };
  }

  renderDashboard(s) {
    this.container.innerHTML = `
      <!-- Saldo Card -->
      <div class="dashboard-card bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-2xl p-5 text-white mb-4 shadow-md">
        <div class="flex items-center gap-2 mb-1">
          <svg class="w-4 h-4 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
          <span class="text-xs font-medium text-indigo-200 uppercase tracking-wide">Saldo Bulan Ini</span>
        </div>
        <p class="text-3xl font-bold mt-1 tracking-tight">${formatCurrency(s.balance)}</p>
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-sm">
          <div>
            <span class="text-indigo-200">Budget</span>
            <p class="font-semibold text-white">${formatCurrency(s.budget.amount)}</p>
          </div>
          <div class="text-right">
            <span class="text-indigo-200">Terpakai</span>
            <p class="font-semibold text-white">${formatCurrency(s.monthTotal)}</p>
          </div>
        </div>
      </div>

      <!-- Ringkasan Cards -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="dashboard-card bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            <p class="text-sm text-gray-500 font-medium">Hari Ini</p>
          </div>
          <p class="text-xl font-bold text-gray-800">${formatCurrency(s.todayTotal)}</p>
        </div>
        <div class="dashboard-card bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>
            <p class="text-sm text-gray-500 font-medium">Minggu Ini</p>
          </div>
          <p class="text-xl font-bold text-gray-800">${formatCurrency(s.weekTotal)}</p>
        </div>
      </div>

      <!-- Top 3 Kategori -->
      ${s.topCategories.length > 0 ? `
      <div class="dashboard-card bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center gap-2 mb-4">
          <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
          <p class="text-sm font-medium text-gray-500">Top Kategori Bulan Ini</p>
        </div>
        ${s.topCategories.map((cat, i) => `
          <div class="flex items-center justify-between py-3 ${i < s.topCategories.length - 1 ? 'border-b border-gray-50' : ''}">
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">${CATEGORY_SVGS[cat.icon]}</span>
              <span class="text-sm font-medium text-gray-700">${cat.label}</span>
            </div>
            <span class="text-sm font-bold text-gray-800">${formatCurrency(cat.total)}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
    `;
  }
}
