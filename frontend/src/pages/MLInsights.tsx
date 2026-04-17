import React, { useState, useEffect } from "react";
import {
  Brain,
  ShieldAlert,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function MLInsights() {
  const [loading, setLoading] = useState(true);

  const [modelStats, setModelStats] = useState({
    confidence: 94.2,
    anomalyProbability: 12.5,
    riskLevel: "Moderate",
    topCorrection: "Внедрить валидацию дат на стороне площадок",
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const dataQuality = [
    { name: "Валидные", value: 87.5 },
    { name: "Аномалии", value: 12.5 },
  ];
  const COLORS = ["#10b981", "#ef4444"];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <div
          className="animate-spin"
          style={{ color: "#ff6600", marginBottom: "20px" }}
        >
          <Brain size={48} />
        </div>
        <p>ИИ модель анализирует паттерны данных...</p>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <header>
        <h1
          style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "10px" }}
        >
          <Brain
            style={{
              verticalAlign: "middle",
              marginRight: "15px",
              color: "#8b5cf6",
            }}
          />
          Интеллектуальный аудит
        </h1>
        <p style={{ color: "#666" }}>
          ML-анализ качества данных и прогноз аномального поведения
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <ShieldAlert color="#ef4444" size={20} /> Вероятность нарушений
          </h3>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#ef4444" }}>
            {modelStats.anomalyProbability}%
          </div>
          <p style={{ color: "#666", marginTop: "10px" }}>
            Риск системных ошибок в процедуре тестирования
          </p>
        </div>

        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <TrendingUp color="#8b5cf6" size={20} /> Уверенность модели
          </h3>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8b5cf6" }}>
            {modelStats.confidence}%
          </div>
          <p style={{ color: "#666", marginTop: "10px" }}>
            Точность классификации паттернов
          </p>
        </div>

        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Lightbulb color="#f59e0b" size={20} /> Рекомендация ИИ
          </h3>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#f59e0b",
              minHeight: "4.5rem",
            }}
          >
            {modelStats.topCorrection}
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: "10px", width: "100%", fontSize: "0.9rem" }}
          >
            Сгенерировать полный отчет
          </button>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}
      >
        <div
          className="liquid-glass"
          style={{ padding: "25px", minHeight: "400px" }}
        >
          <h3 style={{ marginBottom: "20px" }}>Общее качество данных</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataQuality}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataQuality.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#10b981",
                  borderRadius: "50%",
                }}
              ></div>{" "}
              Валидные
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#ef4444",
                  borderRadius: "50%",
                }}
              ></div>{" "}
              Аномалии
            </div>
          </div>
        </div>

        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ marginBottom: "20px" }}>Сценарные выводы модели</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {[
              "Выявлен паттерн «Повторный тест для улучшения результата» (34% нарушений частоты)",
              "Обнаружена аномалия «Технический дубль» в ОГРН 1021300... (одинаковые штампы времени)",
              "Корреляция между вариантом теста и % аномалий в сельских школах не превышает 2%",
              "Прогноз: ужесточение контроля дат снизит административную нагрузку на 12%",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-start",
                  padding: "15px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "12px",
                }}
              >
                <CheckCircle
                  size={20}
                  color="#10b981"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <span style={{ fontSize: "0.95rem" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
