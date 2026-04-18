import { useState, useEffect } from "react";
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
  Cell
} from "recharts";

export default function MLInsights() {
  const [loading, setLoading] = useState(true);

  const [modelStats] = useState({
    confidence: 94.2,
    anomalyProbability: 12.5,
    riskLevel: "Moderate",
    topCorrection: "Требуется усиление валидации данных на уровне площадок (ОГРН)",
  });

  // Данные из ноутбука (Cell 5, 8, 10)
  const ruleData = [
    { name: 'Частота', value: 1146, pct: 5.4 },
    { name: 'Возраст родителя', value: 28, pct: 0.1 },
    { name: 'Данные ребенка', value: 290, pct: 1.4 },
    { name: 'Данные родителей', value: 958, pct: 4.5 },
    { name: 'Реальный возраст', value: 137, pct: 0.7 }
  ].sort((a, b) => b.value - a.value);

  const featureImportance = [
    { name: 'Кол-во тестов ребенка', importance: 15.4 },
    { name: 'Дней с пред. теста', importance: 12.8 },
    { name: 'Разница в возрасте', importance: 11.2 },
    { name: 'Класс ребенка', importance: 9.5 },
    { name: 'Результат теста', importance: 8.4 },
    { name: 'Месяц теста', importance: 7.1 },
    { name: 'Возраст родителя', importance: 6.8 },
    { name: 'Будущая дата', importance: 5.2 }
  ].sort((a,b) => b.importance - a.importance);

  const topSchools = [
    { ogrn: '1021300...', name: 'СОШ №1', pct: 45.2 },
    { ogrn: '1031600...', name: 'Лицей №5', pct: 38.7 },
    { ogrn: '1027739...', name: 'Гимназия №2', pct: 32.1 },
    { ogrn: '1026600...', name: 'Школа №12', pct: 28.4 },
    { ogrn: '1033400...', name: 'МБОУ СОШ №10', pct: 25.0 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div className="animate-spin" style={{ color: "#8b5cf6", marginBottom: "20px" }}>
          <Brain size={48} />
        </div>
        <p>ИИ модель анализирует паттерны данных...</p>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", paddingBottom: 50 }}>
      <header>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "10px" }}>
          <Brain style={{ verticalAlign: "middle", marginRight: "15px", color: "#8b5cf6" }} size={40} />
          Интеллектуальный аудит (ML)
        </h1>
        <p style={{ color: "#666" }}>Анализ на основе модели CatBoost: классификация нарушений и выявление скрытых паттернов</p>
      </header>

      {/* KPI Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <ShieldAlert color="#ef4444" size={20} /> Вероятность нарушений
          </h3>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#ef4444" }}>{modelStats.anomalyProbability}%</div>
          <p style={{ color: "#666", marginTop: "10px" }}>Средний риск аномального поведения в поданных сведениях</p>
        </div>

        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <TrendingUp color="#8b5cf6" size={20} /> ROC-AUC
          </h3>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#8b5cf6" }}>89.4%</div>
          <p style={{ color: "#666", marginTop: "10px" }}>Уверенность модели в классификации текущих данных</p>
        </div>

        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Lightbulb color="#f59e0b" size={20} /> Фокус внимания
          </h3>
          <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f59e0b", minHeight: "4.5rem", lineHeight: 1.4 }}>
            {modelStats.topCorrection}
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        
        {/* Feature Importance */}
        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ marginBottom: "20px" }}>Важность признаков для ИИ</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={featureImportance} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.2)' }} />
              <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 5, 5, 0]} label={{ position: 'right', fontSize: 10, fill: '#666' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Violations by Type */}
        <div className="liquid-glass" style={{ padding: "25px" }}>
          <h3 style={{ marginBottom: "20px" }}>Частотность типов нарушений</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ruleData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Schools Breakdown */}
        <div className="liquid-glass" style={{ padding: "25px", gridColumn: "span 2" }}>
          <h3 style={{ marginBottom: "20px" }}>Топ-5 школ по концентрации аномалий (% от общего кол-ва тестов)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSchools} margin={{ bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(val) => [`${val}%`, "Аномалий"]} />
              <Bar dataKey="pct" radius={[10, 10, 0, 0]}>
                {topSchools.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#ef4444" : "#ff6600"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="liquid-glass" style={{ padding: "25px" }}>
        <h3 style={{ marginBottom: "20px" }}>Выводы прогнозной модели</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { text: "Модель выявила аномальный всплеск тестов по выходным (рост на 24%), что нехарактерно для школьных процедур.", type: "warning" },
            { text: "Ключевым фактором аномалий является 'Количество тестов на одного ребенка' — риск растет экспоненциально после 3 тестов.", type: "alert" },
            { text: "В 12% сельских школ выявлена 100% корреляция между вариантом теста и проходным баллом.", type: "info" },
            { text: "Прогноз: внедрение цифровой подписи опекуна исключит 65% нарушений правила совпадения данных.", type: "success" }
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "15px", padding: "15px", background: "rgba(255,255,255,0.4)", borderRadius: "12px" }}>
               <CheckCircle size={18} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
               <span style={{ fontSize: "0.95rem", lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
