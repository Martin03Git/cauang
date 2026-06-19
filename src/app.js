// Cauang — App bootstrap

(function () {
  let currentView = 'dashboard';
  let dashboardView;
  let addExpenseView;
  let historyView;
  let insightView;
  let settingsView;

  function init() {
    dashboardView = new DashboardView('app-content');
    addExpenseView = new AddExpenseView('app-content', (view) => navigate(view));
    historyView = new HistoryView('app-content', (tx) => navigate('add', tx));
    insightView = new InsightView('app-content');
    settingsView = new SettingsView('app-content');

    navigate('dashboard');

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.view));
    });
  }

  function navigate(view, data) {
    currentView = view;

    // Skip catat button — always indigo, no active state toggle
    document.querySelectorAll('.nav-btn:not([data-view="add"])').forEach(btn => {
      const isActive = btn.dataset.view === view;
      const svg = btn.querySelector('svg');
      const label = btn.querySelector('span:last-child');
      if (svg) {
        svg.classList.toggle('text-indigo-600', isActive);
        svg.classList.toggle('text-gray-400', !isActive);
      }
      if (label) {
        label.classList.toggle('text-indigo-600', isActive);
        label.classList.toggle('text-gray-400', !isActive);
      }
    });

    switch (view) {
      case 'dashboard':
        dashboardView.render();
        break;
      case 'add':
        addExpenseView.render(data);
        break;
      case 'history':
        historyView.render();
        break;
      case 'insight':
        insightView.render();
        break;
      case 'settings':
        settingsView.render();
        break;
      // ponytail: future views render placeholder until implemented
      default:
        document.getElementById('app-content').innerHTML = `
          <div class="flex flex-col items-center justify-center py-24 text-gray-400">
            <p class="font-medium">Segera hadir</p>
          </div>
        `;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
