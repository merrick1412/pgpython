import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

const viz = new Viz({ Module, render });

async function loadFlows() {
  const res = await fetch("/api/flows");
  const data = await res.json();

  const tbody = document.getElementById("flow-table-body");
  tbody.innerHTML = "";

  data.forEach(flow => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${flow.flow_id}</td>
      <td>${flow.flow}</td>
      <td>${flow.complete}</td>
      <td>${flow.run_time}</td>
      <td>${flow.count_finished_nodes}</td>
      <td>${flow.count_failed_nodes}</td>
      <td>
        <button data-id="${flow.flow_id}" class="task-btn">Tasks</button>
        <button data-id="${flow.flow_id}" class="graph-btn">Graph</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Add event listeners
  document.querySelectorAll(".task-btn").forEach(button =>
    button.addEventListener("click", e => showTasks(e.target.dataset.id))
  );

  document.querySelectorAll(".graph-btn").forEach(button =>
    button.addEventListener("click", e => showGraph(e.target.dataset.id))
  );
}

async function showTasks(flowId) {
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

async function showGraph(flowId) {
  const res = await fetch(`/api/flows/${flowId}/graph`);
  const dot = await res.text();

  const svg = await render(dot, { format: "svg" });

  const container = document.getElementById("graph-output");
  container.innerHTML = `<h2>Graph for Flow ${flowId}</h2>${svg}`;
}

loadFlows().catch(err => console.error("Error loading flows:", err));
