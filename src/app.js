// Cauang — App bootstrap

(function () {
  let currentView = 'dashboard';
  let dashboardView;
  let addExpenseView;

  function init() {
    dashboardView = new DashboardView('app-content');
    addExpenseView = new AddExpenseView('app-content', () => navigate('dashboard'));

    navigate('dashboard');

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.view));
    });
  }

  function navigate(view) {
    currentView = view;

    document.querySelectorAll('.nav-btn').forEach(btn => {
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
        addExpenseView.render();
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
