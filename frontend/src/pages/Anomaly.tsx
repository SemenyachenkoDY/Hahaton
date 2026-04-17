// AnomaliesDashboard.tsx — REAL ANALYTICS VERSION

import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface Row {
  [key: string]: any;
}

const COLORS = ["#3b82f6", "#ff6600", "#ef4444", "#ffaa00"];

const safe = (v: any) =>
  v === null || v === undefined ? "" : String(v).trim();
const norm = (v: any) => safe(v).toLowerCase();
const num = (v: any) => {
  const n = parseFloat(safe(v).replace(",", "."));
  return isNaN(n) ? null : n;
};

export default function AnomaliesDashboard() {
  const [data, setData] = useState<Row[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch("/hakaton.csv")
      .then((r) => r.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          transform: (v) => safe(v),
          complete: (res) => {
            const rows = res.data as Row[];
            setData(rows);
            setReport(analyze(rows));
          },
        });
      });
  }, []);

  const analyze = (rows: Row[]) => {
    let childOlder = 0;
    let tooYoung = 0;
    let tooOld = 0;
    let multiTests = 0;
    let duplicates = 0;

    const dupSet = new Set<string>();
    const testMap: Record<string, number> = {};

    rows.forEach((r) => {
      const age = num(r.age);
      const g = num(r.guard_age);

      // возраст
      if (age !== null) {
        if (age < 6) tooYoung++;
        if (age > 20) tooOld++;
      }

      // родитель младше/почти равен
      if (age !== null && g !== null) {
        if (g - age < 16) childOlder++;
      }

      // дубликаты
      const key = `${norm(r.last_name)}|${norm(r.first_name)}|${norm(r.bdate)}`;
      if (dupSet.has(key)) duplicates++;
      else dupSet.add(key);

      // тесты в один день
      const testKey = `${key}|${r.test_date}`;
      testMap[testKey] = (testMap[testKey] || 0) + 1;
    });

    Object.values(testMap).forEach((c) => {
      if (c > 1) multiTests++;
    });

    return {
      childOlder,
      tooYoung,
      tooOld,
      multiTests,
      duplicates,
    };
  };

  const mainChart = useMemo(() => {
    if (!report) return [];
    return [
      { name: "Ребенок ≈ родитель", value: report.childOlder },
      { name: "Возраст <6", value: report.tooYoung },
      { name: "Возраст >20", value: report.tooOld },
      { name: "Тесты в один день", value: report.multiTests },
    ];
  }, [report]);

  const dupChart = useMemo(() => {
    if (!report) return [];
    return [
      { name: "Уникальные", value: data.length - report.duplicates },
      { name: "Дубликаты", value: report.duplicates },
    ];
  }, [data, report]);

  const renderDonut = (data: any[]) => (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-gradient">Аномалии данных</h1>

      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 16,
          marginTop: 20,
        }}
      >
        <Card title="Всего" value={data.length} />
        <Card title="Ребенок≈родитель" value={report?.childOlder} />
        <Card title="<6 лет" value={report?.tooYoung} />
        <Card title=">20 лет" value={report?.tooOld} />
        <Card title="Дубликаты" value={report?.duplicates} />
      </div>

      {/* charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginTop: 24,
        }}
      >
        <div className="liquid-glass" style={{ padding: 20 }}>
          <h3>Критические аномалии</h3>
          {renderDonut(mainChart)}
        </div>

        <div className="liquid-glass" style={{ padding: 20 }}>
          <h3>Дубликаты</h3>
          {renderDonut(dupChart)}
        </div>

        <div
          className="liquid-glass"
          style={{ padding: 20, gridColumn: "1 / -1" }}
        >
          <h3>Распределение аномалий</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mainChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ff6600" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }: any) => (
  <div className="liquid-glass" style={{ padding: 16 }}>
    <div style={{ fontSize: 26, fontWeight: 700 }}>{value || 0}</div>
    <div>{title}</div>
  </div>
);
