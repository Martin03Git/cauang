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
}
