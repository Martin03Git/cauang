// Cauang — App bootstrap

(function () {
  let currentView = 'dashboard';
  let dashboardView;

  function init() {
    dashboardView = new DashboardView('app-content');
    navigate('dashboard');

    // Nav click handlers
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.view));
    });
  }

  function navigate(view) {
    currentView = view;

    // Update nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const isActive = btn.dataset.view === view;
      btn.classList.toggle('active', isActive);
      const label = btn.querySelector('span:last-child');
      if (label) {
        label.classList.toggle('text-indigo-600', isActive);
        label.classList.toggle('text-gray-400', !isActive);
      }
    });

    // Render view
    switch (view) {
      case 'dashboard':
        dashboardView.render();
        break;
      // ponytail: future views render empty placeholder until implemented
      default:
        document.getElementById('app-content').innerHTML = `
          <div class="flex flex-col items-center justify-center py-20 text-gray-400">
            <p class="text-lg">Segera hadir</p>
          </div>
        `;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
