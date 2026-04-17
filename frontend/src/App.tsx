import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MLInsights from "./pages/MLInsights";
import ApiDocsPage from "./pages/ApiDocsPage";
import AnomaliesDashboard from "./pages/Anomaly";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ml" element={<MLInsights />} />
          <Route path="api" element={<ApiDocsPage />} />
          <Route path="anomalies" element={<AnomaliesDashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
