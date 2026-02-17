const id = window.location.pathname.replace("/", "").trim();

const root = document.getElementById("app")!;
root.innerHTML = `<div>Loading…</div>`;

if (!id) {
  root.innerHTML = `<div>Missing reservation id</div>`;
} else {
  fetch(`/api/reservations/by-id/${encodeURIComponent(id)}`)
    .then(r => r.json())
    .then(data => {
      if (!data.ok) {
        root.innerHTML = `<div>Not found</div>`;
        return;
      }
      root.innerHTML = `
        <h1>Reservation ${data.reservation.reservationId}</h1>
        <p>${data.reservation.address}</p>
      `;
    })
    .catch(() => {
      root.innerHTML = `<div>Error loading reservation</div>`;
    });
}
