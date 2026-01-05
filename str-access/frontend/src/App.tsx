import { Route, Routes } from "react-router-dom";
import { ReservationPage } from "./pages/ReservationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/r/:code" element={<ReservationPage />} />

      {/* opcional: landing */}
      <Route path="/" element={<div style={{ padding: 24 }}>Open the link you received (it ends with your access code).</div>} />


      <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
    </Routes>
  );
}
