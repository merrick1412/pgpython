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
  