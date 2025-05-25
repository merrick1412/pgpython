import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
import './style.css';

const viz = new Viz({ Module, render });


let searchQuery = "";

function createGrid(containerId, data, columns) {
  const options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    autosizeColsMode: Slick.GridAutosizeColsMode.FitColumns
  };

  const dataView = new window.Slick.Data.DataView();
  const grid = new Slick.Grid(containerId, dataView, columns, options);

  // Bind update events BEFORE setting items
  dataView.onRowCountChanged.subscribe(() => {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe((e, args) => {
    grid.invalidateRows(args.rows);
    grid.render();
  });

  // Filtering logic
  let searchQuery = "";

  dataView.setFilter(item => {
    if (!searchQuery) return true;
    return [item.flow, item.id, item.complete].some(val =>
      String(val).toLowerCase().includes(searchQuery)
    );
  });

  // Set items AFTER wiring up events and filter
  dataView.beginUpdate();
  dataView.setItems(data, "id");
  dataView.endUpdate();

  // Setup live filtering
  const searchBox = document.getElementById("search-box");
  if (searchBox) {
    searchBox.addEventListener("input", () => {
      searchQuery = searchBox.value.toLowerCase();
      dataView.refresh(); // triggers the setFilter logic
    });
  }

  return grid;
}

// Function to create a grid for displaying flow data
async function loadFlows() {
  const res = await fetch("/api/flows");
  const data = await res.json();

  //  Ensure each object has a unique `id` property for Slick.DataView
  data.forEach(item => {
    item.id = item.flow_id;
  });

  const columns = [
    { id: "flow_id", name: "ID", field: "flow_id", width: 60 },
    { id: "flow", name: "Name", field: "flow" },
    { id: "complete", name: "Status", field: "complete", width: 80 },
    { id: "run_time", name: "Run Time", field: "run_time" },
    { id: "count_finished_nodes", name: "Finished", field: "count_finished_nodes", width: 80 },
    { id: "count_failed_nodes", name: "Failed", field: "count_failed_nodes", width: 80 },
    {
      id: "actions",
      name: "Actions",
      field: "flow_id",
      formatter: (row, cell, value) => {
        return `<button class="details-btn slick-button" data-id="${value}">Details</button>`;
      },
      width: 100      
    }
  ];

  createGrid("#flow-grid", data, columns);

  setTimeout(() => {
    document.querySelectorAll(".details-btn").forEach(button =>
      button.addEventListener("click", e => {
        const flowId = e.target.dataset.id;
        window.location.href = `flowDetails.html?flow_id=${flowId}`;
      })
    );
  }, 100);
}

export async function showTasks(flowId) {
  const res = await fetch(`/api/flows/${flowId}/tasks`);
  const tasks = await res.json();

  const container = document.getElementById("tasks-output");
  container.innerHTML = `<h2>Tasks for Flow ${flowId}</h2>`;

  const table = document.createElement("table");
  table.border = 1;
  table.innerHTML = `
    <thead>
      <tr>
        <th>Task ID</th><th>Type</th><th>Status</th><th>Run Time</th><th>Error</th>
      </tr>
    </thead>
    <tbody>
      ${tasks.map(task => `
        <tr>
          <td>${task.task_id}</td>
          <td>${task.type}</td>
          <td>${task.status}</td>
          <td>${task.run_time}</td>
          <td>${task.processing_error || ''}</td>
        </tr>`).join("")}
    </tbody>
  `;

  container.appendChild(table);
}

export async function showGraph(flowId) {
  const res = await fetch(`/api/flows/${flowId}/graph`);
  const dot = await res.text();

  const svg = await viz.renderString(dot);

  const container = document.getElementById("graph-output");
  container.innerHTML = `<h2>Graph for Flow ${flowId}</h2>${svg}`;
}

async function loadRunningFlows() {
  const res = await fetch("/api/flows/running");
  const data = await res.json();

  // Ensure each row has a unique `id` for Slick.DataView
  data.forEach(item => {
    item.id = item.flow_id;
  });

  const columns = [
    { id: "flow_id", name: "ID", field: "flow_id", width: 60 },
    { id: "flow", name: "Name", field: "flow" },
    { id: "complete", name: "Status", field: "complete", width: 80 },
    { id: "run_time", name: "Run Time", field: "run_time" },
    { id: "count_finished_nodes", name: "Finished", field: "count_finished_nodes", width: 80 },
    { id: "count_failed_nodes", name: "Failed", field: "count_failed_nodes", width: 80 }
  ];

  createGrid("#running-flow-grid", data, columns);
}

if (document.getElementById("flow-grid")) {
  loadFlows().catch(err => console.error("Error loading flows:", err));
}

if (document.getElementById("running-flow-grid")) {
  loadRunningFlows().catch(err => console.error("Error loading running flows:", err));
}

const refreshBtn = document.getElementById("refresh-running-flows");
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    loadRunningFlows();
  });
}
