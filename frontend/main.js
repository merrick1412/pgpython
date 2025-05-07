document.getElementById("btn").addEventListener("click", async () => {
    const res = await fetch("http://localhost:5000/api/button-clicked", {
      method: "POST"
    });
    const data = await res.json();
    document.getElementById("response").textContent = data.message;
  });
  