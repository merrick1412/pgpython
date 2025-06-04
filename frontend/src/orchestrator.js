import './style.css';

function setupGrid(id, data) {
  if (!Array.isArray(data)) {
    console.warn(`Invalid or empty data for grid #${id}:`, data);
    document.getElementById(id).innerHTML = "<p class='error'>No data available.</p>";
    return;
  }

  const fieldLabels = {
    slot: "Slot",
    target: "Worker Target",
    task_id: "Task ID",
    running_since: "Running Since",
    query: "Query",
    priority: "Priority"
  };

  const columns = Object.keys(data[0] || {}).map(k => ({
    id: k,
    name: fieldLabels[k] || prettify(k),
    field: k,
    sortable: true
  }));

  const options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    autosizeColsMode: Slick.GridAutosizeColsMode.FitColumns
  };

  const dataView = new Slick.Data.DataView();
  const grid = new Slick.Grid(`#${id}`, dataView, columns, options);

  dataView.beginUpdate();
  dataView.setItems(data.map((d, i) => ({ ...d, id: i })), "id");
  dataView.endUpdate();

  dataView.onRowCountChanged.subscribe(() => {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe((e, args) => {
    grid.invalidateRows(args.rows);
    grid.render();
  });
}

function prettify(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function renderSummary(data) {
  const fieldLabels = {
    is_up: "Status",
    uptime: "Uptime",
    last_heavy_maintenance: "Last Maintenance",
    num_workers: "Workers",
    tasks_running: "Running Tasks",
    tasks_pending: "Pending Tasks"
  };

  const rows = Object.entries(data).map(([key, value], i) => ({
    id: i,
    field: fieldLabels[key] || prettify(key),
    value: value
  }));

  const columns = [
    { id: "field", name: "Metric", field: "field" },
    { id: "value", name: "Value", field: "value" }
  ];

  const options = {
    enableCellNavigation: false,
    enableColumnReorder: false,
    autosizeColsMode: Slick.GridAutosizeColsMode.FitColumns
  };

  const grid = new Slick.Grid("#summary-grid", rows, columns, options);
}

function fetchAndDisplay(endpoint, handler) {
  fetch(endpoint)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(handler)
    .catch(err => {
      console.error(`Error fetching ${endpoint}:`, err);
      const tabId = endpoint.includes("orchestrator") ? "tab-summary"
                  : endpoint.includes("worker") ? "tab-workers"
                  : endpoint.includes("pool") ? "tab-pools"
                  : "tab-logs";
      document.getElementById(tabId).innerHTML += `<p class="error">Error loading ${endpoint}</p>`;
    });
}

document.getElementById("back-btn").addEventListener("click", () => {
  window.history.back();
});

fetchAndDisplay("/orchestrator-info", renderSummary);
fetchAndDisplay("/worker-info", data => setupGrid("workers-grid", data?.data || data));
fetchAndDisplay("/pool-info", data => setupGrid("pools-grid", data));
fetchAndDisplay("/server-logs", data => {
  if (Array.isArray(data)) {
    document.getElementById("logs-output").textContent = data.join("\n");
  } else {
    document.getElementById("logs-output").textContent = "No logs available.";
  }
});

document.querySelectorAll(".tab").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  })
);
