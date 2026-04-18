// AnomaliesDashboard.tsx — API-DRIVEN VERSION (Fixed syntax)

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";

const Card = ({ title, value, color }: { title: string; value: any; color: string }) => (
  <div className="liquid-glass" style={{ padding: "20px", borderLeft: `5px solid ${color}` }}>
    <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "5px", fontWeight: 600 }}>{title}</div>
    <div style={{ fontSize: "2rem", fontWeight: 800, color: color }}>{value ?? 0}</div>
  </div>
);

import { fetchAnomalies } from "../api";

export default function AnomaliesDashboard() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetchAnomalies()
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error", err);
        setLoading(false);
      });
  }, []);

  const ruleStats = useMemo(() => {
    if (!report || report.error) return [];
    return [
      { name: "Частота", value: report.rule1, desc: ">1 раза в 3 мес" },
      { name: "Био-возраст", value: report.rule2, desc: "Опекун-Ребенок <16 лет" },
      { name: "Данные ребенка", value: report.rule3, desc: "Конфликт Пол/Дата ID" },
      { name: "Пол опекунов", value: report.rule4, desc: "Конфликт пола по ID опекуна" },
      { name: "Ошибка расчета", value: report.rule5, desc: "Возраст != (Тест - Рождение)" },
    ];
  }, [report]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div className="animate-spin" style={{ fontSize: "2rem" }}>⚙️</div>
      <p style={{ marginLeft: "15px" }}>Синхронизация с базой данных и расчет аномалий...</p>
    </div>
  );

  if (!report || report.error) return <div style={{ padding: 40 }}>Ошибка загрузки данных аномалий. Проверьте подключение к API.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", paddingBottom: 50 }}>
      <header>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Аудит аномалий (Live DB)</h1>
        <p style={{ color: "#666" }}>Анализ биологических и логических нарушений на основе данных Supabase</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <Card title="Нарушения частоты" value={report.rule1} color="#ef4444" />
        <Card title="Био-противоречия" value={report.rule2} color="#ff6600" />
        <Card title="Данные опекунов" value={report.rule4} color="#8b5cf6" />
        <Card title="Ошибки возраста" value={report.rule5} color="#10b981" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        
        {/* Violation Ranking */}
        <div className="liquid-glass" style={{ padding: 30 }}>
          <h3 style={{ marginBottom: 25 }}>Распределение типов аномалий</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ruleStats} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 13, fontWeight: 600 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                {ruleStats.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={i === 0 ? "#ef4444" : (i === 1 ? "#ff6600" : "#8b5cf6")} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bio-Audit Scatter */}
        <div className="liquid-glass" style={{ padding: 30 }}>
          <h3 style={{ marginBottom: 25 }}>Биологический аудит (Возраст)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" dataKey="x" name="Ребенок" unit="л" />
              <YAxis type="number" dataKey="y" name="Опекун" unit="л" />
              <ZAxis type="number" range={[60, 60]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Норма" data={report.bioAnomalies?.filter((a: any) => !a.isAnomaly) || []} fill="#3b82f6" opacity={0.4} />
              <Scatter name="Аномалия" data={report.bioAnomalies?.filter((a: any) => a.isAnomaly) || []} fill="#ef4444" />
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution */}
        <div className="liquid-glass" style={{ padding: 30, gridColumn: "span 2" }}>
           <h3 style={{ marginBottom: 25 }}>Концентрация нарушений по школьным классам (%)</h3>
           <ResponsiveContainer width="100%" height={300}>
             <BarChart data={report.classData || []}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
               <XAxis dataKey="name" />
               <YAxis unit="%" />
               <Tooltip />
               <Bar dataKey="value" fill="#ef4444" radius={[5, 5, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology and Details */}
      <div className="liquid-glass" style={{ padding: 30 }}>
        <h3 style={{ marginBottom: 25 }}>Расшифровка нарушений</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
           {ruleStats.map((rule, i) => (
             <div key={i} style={{ display: "flex", gap: "15px", padding: "15px", background: "rgba(255,255,255,0.4)", borderRadius: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: rule.value > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                   <span style={{ fontWeight: 800, color: rule.value > 0 ? "#ef4444" : "#10b981" }}>{i+1}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{rule.name}</div>
                  <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "8px" }}>{rule.desc}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{rule.value} <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: 400 }}>кейсов</span></div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
