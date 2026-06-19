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

  static resetAll() {
    localStorage.removeItem(this.KEYS.TRANSACTIONS);
    localStorage.removeItem(this.KEYS.BUDGET);
  }

}
