import './style.css';

const cachedData = {};

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
    autosizeColsMode: Slick.GridAutosizeColsMode.FitColumns,
  };

  const dataView = new Slick.Data.DataView();
  const grid = new Slick.Grid(`#${id}`, dataView, columns, options);
  dataView.beginUpdate();
  dataView.setItems(data.map((d, i) => ({ ...d, id: i })), "id");
  grid.resizeCanvas();
  grid.autosizeColumns();
  dataView.endUpdate();

  grid.resizeCanvas();
  grid.autosizeColumns();
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
  const labels = {
    is_up: "Status",
    uptime: "Uptime",
    last_heavy_maintenance: "Last Maintenance",
    num_workers: "Workers",
    tasks_running: "Running Tasks",
    tasks_pending: "Pending Tasks"
  };

  const rows = Object.entries(data).map(([key, value], i) => ({
    id: i,
    field: labels[key] || prettify(key),
    value
  }));

  const columns = [
    { id: "field", name: "Metric", field: "field" },
    { id: "value", name: "Value", field: "value" }
  ];

  const options = {
    enableCellNavigation: false,
    enableColumnReorder: false,
    autosizeColsMode: Slick.GridAutosizeColsMode.FitColumns,
  };

  const grid = new Slick.Grid("#orchestrator-grid", rows, columns, options);
  grid.resizeCanvas();
  grid.autosizeColumns();
}

function fetchOnce(key, endpoint, renderFn) {
  if (cachedData[key]) {
    renderFn(cachedData[key]);
    return;
  }

  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      cachedData[key] = data;
      renderFn(data);
    })
    .catch(err => {
      console.error(`Error fetching ${endpoint}:`, err);
      document.getElementById(`${key}-grid`)?.insertAdjacentHTML('beforeend', `<p class="error">Error loading data</p>`);
    });
}

function renderLogs() {
  if (cachedData.logs) {
    renderLogOutput(cachedData.logs);
    return;
  }

  fetch("/server-logs")
    .then(res => res.json())
    .then(data => {
      cachedData.logs = Array.isArray(data) ? data : data?.data || [];
      renderLogOutput(cachedData.logs);
    })
    .catch(err => {
      document.getElementById("server-log-output").textContent = "Error loading logs";
      console.error("Log fetch error:", err);
    });
}

function renderLogOutput(lines) {
  const logEl = document.getElementById("server-log-output");
  logEl.textContent = lines.join("\n");
  logEl.scrollTop = logEl.scrollHeight; // Auto-scroll to bottom
}

// Navigation
document.getElementById("back-btn").addEventListener("click", () => {
  window.history.back();
});

// Tabs
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.tab;

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(selected).classList.add("active");

    switch (selected) {
      case "summary":
        fetchOnce("summary", "/orchestrator-info", renderSummary);
        break;
      case "workers":
        fetchOnce("workers", "/worker-info", data => setupGrid("worker-grid", data?.data || data));
        break;
      case "pools":
        fetchOnce("pools", "/pool-info", data => setupGrid("pool-grid", data));
        break;
      case "logs":
        renderLogs();
        break;
    }
  });
});

// Initial tab load
fetchOnce("summary", "/orchestrator-info", renderSummary);

document.getElementById("refresh-btn").addEventListener("click", () => {
  const activeTab = document.querySelector(".tab.active").dataset.tab;
  if (activeTab === "summary") {
    fetchAndDisplay("/orchestrator-info", renderSummary);
  } else if (activeTab === "workers") {
    fetchAndDisplay("/worker-info", data => setupGrid("worker-grid", data?.data || data));
  } else if (activeTab === "pools") {
    fetchAndDisplay("/pool-info", data => setupGrid("pool-grid", data));
  } else if (activeTab === "logs") {
    fetch("/server-logs")
      .then(res => res.json())
      .then(data => {
        const out = Array.isArray(data) ? data : (data?.data || []);
        const logBox = document.getElementById("server-log-output");
        logBox.textContent = out.join("\n");
        logBox.scrollTop = logBox.scrollHeight;
      })
      .catch(err => {
        document.getElementById("server-log-output").textContent = "Error loading logs";
        console.error("Fetch logs error:", err);
      });
  }
});
