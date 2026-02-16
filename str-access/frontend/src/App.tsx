import { Route, Routes } from "react-router-dom";
import { ReservationPage } from "./pages/ReservationPage";

export default function App() {
  return (
    <Routes>
      {/* soporta enlaces tipo /123 */}
      <Route path="/:code" element={<ReservationPage />} />

      {/* opcional: mantiene compatibilidad con /r/123 */}
      <Route path="/r/:code" element={<ReservationPage />} />

      {/* landing */}
      <Route
        path="/"
        element={<div style={{ padding: 24 }}>Open the link you received (it ends with your access code).</div>}
      />

      {/* fallback */}
      <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
      <Route
  path="/"
  element={<div style={{ padding: 24 }}>DEPLOY TEST v1 - si ves esto, está actualizado</div>}
/>
    </Routes>
  );
}
