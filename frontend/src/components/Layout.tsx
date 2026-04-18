import { Outlet, Link } from "react-router-dom";
import { Flame, PieChart, Info, Code2 } from "lucide-react";

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <div className="liquid-bg-blob"></div>
      <header
        className="liquid-glass"
        style={{
          margin: "20px",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          className="nav-link"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <Flame size={28} color="#ff6600" />
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
            className="text-gradient"
          >
            БерИИделай
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            className="nav-link"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Info size={18} /> О проекте
          </Link>
          <Link
            to="/dashboard"
            className="nav-link"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <PieChart size={18} /> Дашборды
          </Link>
          <Link
            to="/ml"
            className="nav-link"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Flame size={18} /> ML Аудит
          </Link>
          <Link
            to="/api"
            className="nav-link"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Code2 size={18} />
            API
          </Link>
        </nav>
      </header>

      <main
        className="container animate-fade-in"
        style={{ padding: "20px 0", minHeight: "calc(100vh - 120px)" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
