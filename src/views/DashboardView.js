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
      <div class="flex flex-col items-center justify-center py-20 text-gray-400">
        <span class="text-6xl mb-4">📊</span>
        <p class="text-lg font-medium text-gray-500">Belum ada transaksi</p>
        <p class="text-sm mt-1">Mulai catat pengeluaran pertama kamu!</p>
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
        return { id, label: cat ? cat.label : id, icon: cat ? cat.icon : '📌', total };
      });

    const balance = budget.amount - monthTotal;
    const dailyPercent = budget.amount > 0
      ? Math.min(100, Math.round((todayTotal / (budget.amount / 30)) * 100))
      : 0;

    return { todayTotal, weekTotal, monthTotal, balance, dailyPercent, topCategories, budget };
  }

  renderDashboard(s) {
    this.container.innerHTML = `
      <!-- Saldo -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white mb-4">
        <p class="text-sm opacity-80">Saldo Bulan Ini</p>
        <p class="text-3xl font-bold mt-1">${formatCurrency(s.balance)}</p>
        <div class="flex justify-between mt-3 text-sm opacity-90">
          <span>Budget: ${formatCurrency(s.budget.amount)}</span>
          <span>Terpakai: ${formatCurrency(s.monthTotal)}</span>
        </div>
      </div>

      <!-- Hari Ini -->
      <div class="bg-white rounded-2xl p-4 shadow-sm mb-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">Hari Ini</p>
            <p class="text-xl font-semibold text-gray-800">${formatCurrency(s.todayTotal)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Dari Budget Harian</p>
            <p class="text-lg font-semibold ${s.dailyPercent > 80 ? 'text-red-500' : 'text-green-500'}">${s.dailyPercent}%</p>
          </div>
        </div>
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div class="h-2 rounded-full ${s.dailyPercent > 80 ? 'bg-red-500' : 'bg-green-500'}" style="width: ${s.dailyPercent}%"></div>
        </div>
      </div>

      <!-- Ringkasan -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-sm text-gray-500">Minggu Ini</p>
          <p class="text-lg font-semibold text-gray-800">${formatCurrency(s.weekTotal)}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-sm text-gray-500">Bulan Ini</p>
          <p class="text-lg font-semibold text-gray-800">${formatCurrency(s.monthTotal)}</p>
        </div>
      </div>

      <!-- Top 3 Kategori -->
      ${s.topCategories.length > 0 ? `
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-sm font-medium text-gray-500 mb-3">Top Kategori Bulan Ini</p>
        ${s.topCategories.map((cat, i) => `
          <div class="flex items-center justify-between py-2 ${i < s.topCategories.length - 1 ? 'border-b border-gray-100' : ''}">
            <div class="flex items-center gap-3">
              <span class="text-xl">${cat.icon}</span>
              <span class="text-gray-700">${cat.label}</span>
            </div>
            <span class="font-semibold text-gray-800">${formatCurrency(cat.total)}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
    `;
  }
}
