import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

const viz = new Viz({ Module, render });

// Fetch "Hello World" from the Flask backend
document.getElementById("btn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/helloworld");
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("output").textContent = "Error fetching data.";
    console.error(err);
  }
});

// Render a Graphviz graph
document.getElementById("graph-btn").addEventListener("click", async () => {
  const graphDefinition = `
    digraph "my_flow/3" {
  edge [arrowsize="1.5"]

  beginning -> middle
ending -> end
middle -> ending
start -> beginning

    "middle" [id=middle
  label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
    <TR><TD COLSPAN="1">middle</TD></TR>
    <TR><TD BGCOLOR="indianred">SELF</TD></TR>
    <TR><TD COLSPAN="1">no steps</TD></TR>
    </TABLE>> shape=none  ];


    "ending" [id=ending
  label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
    <TR><TD COLSPAN="1">ending</TD></TR>
    <TR><TD BGCOLOR="indianred">SELF</TD></TR>
    <TR><TD COLSPAN="1">no steps</TD></TR>
    </TABLE>> shape=none  ];


    "beginning" [id=beginning
  label=<
    <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
    <TR><TD COLSPAN="1">beginning</TD></TR>
    <TR><TD BGCOLOR="indianred">SELF</TD></TR>
    <TR><TD COLSPAN="1">no steps</TD></TR> <TR><TD COLSPAN="1">0.0s</TD></TR>
    </TABLE>> shape=none  ];


  start [shape=invtriangle label="my_flow
id: 3"];
  end [shape=triangle label = "END"];

  legend  [shape=record];
  flow_pending [label = "Pending" shape="rectangle" style="striped" fillcolor = "beige"];
  flow_running [label = "Running" shape="rectangle"  style="striped" fillcolor = "orange"];
  flow_finished [label = "Finished" shape="rectangle"  style="striped" fillcolor = "palegreen"];
  flow_failed [label = "Failed" shape="rectangle"  style="striped" fillcolor = "indianred"];

  legend->flow_pending [arrowhead=empty label="  run on fail"];
  flow_pending->flow_running [label="  fail on fail"];
  flow_running->flow_finished ;
  flow_running->flow_failed [label="steps may fail", dir=both, arrowtail = "invempty"];

}
  `;

  try {
    const graphSvg = await viz.renderString(graphDefinition);
    document.getElementById("graph-output").innerHTML = graphSvg;
  } catch (err) {
    console.error("Error rendering graph:", err);
    document.getElementById("graph-output").textContent = "Error rendering graph.";
  }
});

//FRONTEND
//npm run dev
//BACKEND
//python3 app.py