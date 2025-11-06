export async function toggleStress(enabled: boolean, cores: number, io_stress: boolean) {
  try {
    const res = await fetch("http://10.0.7.68:3000/api/v1/stress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enabled,
        cores,
        io_stress,
      }),
    });

    if (!res.ok) throw new Error("Failed to toggle stress");

    const data = await res.json();
    console.log("✅ Stress API Response:", data);
    return data;
  } catch (err) {
    console.error("Error calling stress API:", err);
    return null;
  }
}
