// Cauang — Storage (LocalStorage wrapper)

class Storage {
  static KEYS = {
    TRANSACTIONS: 'cauang_transactions',
    BUDGET: 'cauang_budget',
  };

  static getTransactions() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.TRANSACTIONS)) || [];
    } catch {
      return [];
    }
  }

  static saveTransactions(transactions) {
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static addTransaction(tx) {
    const all = this.getTransactions();
    tx.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    tx.createdAt = new Date().toISOString();
    all.push(tx);
    this.saveTransactions(all);
    return tx;
  }

  static getTransactionById(id) {
    return this.getTransactions().find(t => t.id === id) || null;
  }

  static updateTransaction(id, updates) {
    const all = this.getTransactions();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    this.saveTransactions(all);
    return all[idx];
  }

  static deleteTransaction(id) {
    const all = this.getTransactions().filter(t => t.id !== id);
    this.saveTransactions(all);
  }

  static getBudget() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.BUDGET)) || { amount: 0 };
    } catch {
      return { amount: 0 };
    }
  }

  static saveBudget(budget) {
    localStorage.setItem(this.KEYS.BUDGET, JSON.stringify(budget));
  }

  static getTransactionsByDateRange(filterFn) {
    return this.getTransactions().filter(filterFn);
  }

  // ponytail: O(n) scan over all transactions, fine for MVP dataset
  static suggestCategory(keyword) {
    if (!keyword || keyword.length < 3) return null;
    const kw = keyword.toLowerCase();
    const txns = this.getTransactions();
    const counts = {};

    txns.forEach(t => {
      if (t.description && t.description.toLowerCase().includes(kw)) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    });

    const entries = Object.entries(counts);
    if (entries.length === 0) return null;

    // return category with highest match count
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }

  // ponytail: seed for testing UI, remove before production
  static seedDemoData() {
    const today = new Date();
    const y = (d) => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const transactions = [
      { id: 's1', amount: 25000, category: 'makanan', date: y(today.getDate()), description: 'Nasi padang', createdAt: new Date().toISOString() },
      { id: 's2', amount: 18000, category: 'minuman', date: y(today.getDate()), description: 'Kopi kenangan', createdAt: new Date().toISOString() },
      { id: 's3', amount: 15000, category: 'transport', date: y(today.getDate() - 1), description: 'Gojek ke kampus', createdAt: new Date().toISOString() },
      { id: 's4', amount: 12000, category: 'makanan', date: y(today.getDate() - 1), description: 'Bakso', createdAt: new Date().toISOString() },
      { id: 's5', amount: 20000, category: 'jajan', date: y(today.getDate() - 1), description: 'Cilor', createdAt: new Date().toISOString() },
      { id: 's6', amount: 75000, category: 'belanja', date: y(today.getDate() - 3), description: 'Sabun + sampo', createdAt: new Date().toISOString() },
      { id: 's7', amount: 10000, category: 'minuman', date: y(today.getDate() - 3), description: 'Es teh', createdAt: new Date().toISOString() },
      { id: 's8', amount: 300000, category: 'kos', date: y(5), description: 'Bayar kos bulan ini', createdAt: new Date().toISOString() },
      { id: 's9', amount: 50000, category: 'pulsa', date: y(5), description: 'Paket data 30GB', createdAt: new Date().toISOString() },
      { id: 's10', amount: 30000, category: 'transport', date: y(7), description: 'Bensin motor', createdAt: new Date().toISOString() },
      { id: 's11', amount: 45000, category: 'makanan', date: y(8), description: 'Makan di warkop', createdAt: new Date().toISOString() },
      { id: 's12', amount: 35000, category: 'jajan', date: y(10), description: 'Nonton bioskop', createdAt: new Date().toISOString() },
    ];

    this.saveTransactions(transactions);
    this.saveBudget({ amount: 1200000 });
    return transactions;
  }
}
