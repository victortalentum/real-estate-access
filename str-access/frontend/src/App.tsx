import { Navigate, Route, Routes } from "react-router-dom";
import { ReservationPage } from "./pages/ReservationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/r/:code" element={<ReservationPage />} />

      {/* opcional: landing */}
      <Route path="/" element={<Navigate to="/r/123" replace />} />

      <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
    </Routes>
  );
}
