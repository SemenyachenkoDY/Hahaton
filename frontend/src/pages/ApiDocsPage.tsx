import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Key,
  Users,
  BarChart3,
  TrendingUp,
  Brain,
  ImageIcon,
  Webhook,
  AlertCircle,
  Search,
  CheckCircle,
  Zap,
  BookOpen,
  Database,
} from "lucide-react";

type TabKey =
  | "overview"
  | "auth"
  | "students"
  | "results"
  | "analytics"
  | "ml"
  | "images"
  | "webhooks"
  | "errors";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Обзор", icon: Home },
  { key: "auth", label: "Авторизация", icon: Key },
  { key: "students", label: "Пользователи", icon: Users },
  { key: "results", label: "Результаты", icon: BarChart3 },
  { key: "analytics", label: "Аналитика", icon: TrendingUp },
  { key: "ml", label: "ML API", icon: Brain },
  { key: "images", label: "AI Images", icon: ImageIcon },
  { key: "webhooks", label: "Webhooks", icon: Webhook },
  { key: "errors", label: "Ошибки", icon: AlertCircle },
];

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    style={{
      background: "#1e1e2f",
      color: "#f8f8f2",
      padding: "16px",
      borderRadius: "20px",
      overflow: "auto",
      fontSize: "0.85rem",
      fontFamily: "monospace",
      marginTop: "12px",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <code>{children}</code>
  </pre>
);

export default function ApiDocsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("overview");

  const filteredTabs = useMemo(
    () =>
      tabs.filter((t) => t.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const renderContent = () => {
    switch (tab) {
      case "overview":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div className="liquid-glass" style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <Zap size={24} color="#ff6600" />
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                  REST API платформы БерИИделай
                </h3>
              </div>
              <p style={{ color: "#444", lineHeight: 1.5, margin: 0 }}>
                Промышленный API для интеграции тестирования, аналитики, ETL и
                AI-модулей в школьные сервисы, LMS и внутренние системы.
              </p>
            </div>

            <div className="liquid-glass" style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <BookOpen size={24} color="#ff6600" />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Base URL
                </h3>
              </div>
              <CodeBlock>https://api.beriideal.ru/v1/</CodeBlock>
              <p
                style={{ fontSize: "0.8rem", color: "#666", marginTop: "12px" }}
              >
                Все запросы должны начинаться с этого URL
              </p>
            </div>

            <div className="liquid-glass" style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <Database size={24} color="#ff6600" />
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Возможности
                </h3>
              </div>
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "12px",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {[
                  "JSON REST endpoints",
                  "JWT авторизация",
                  "Realtime события",
                  "pandas аналитика",
                  "Stable Diffusion генерация",
                  "Supabase backend",
                ].map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircle size={16} color="#10b981" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "auth":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Получение токена
              </h3>
              <CodeBlock>{`POST /auth/login\n{\n  "email": "admin@school.ru",\n  "password": "123456"\n}`}</CodeBlock>
              <p style={{ marginTop: "16px", fontWeight: 600 }}>Ответ:</p>
              <CodeBlock>{`{\n  "access_token": "eyJhbGciOiJIUzI1NiIs...",\n  "expires_in": 86400\n}`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Использование в запросах
              </h3>
              <CodeBlock>Authorization: Bearer YOUR_TOKEN</CodeBlock>
            </div>
          </div>
        );

      case "students":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Работа с пользователями
              </h3>
              <CodeBlock>{`GET    /users/me\nGET    /users/students\nPOST   /users/students\nPUT    /users/students/:id\nDELETE /users/students/:id`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Создание ученика
              </h3>
              <CodeBlock>{`{\n  "fullName": "Иван Иванов",\n  "class": "9A",\n  "school": "Школа №15"\n}`}</CodeBlock>
            </div>
          </div>
        );

      case "results":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Результаты тестов
              </h3>
              <CodeBlock>{`POST   /results\nGET    /results?class=9A&subject=math\nGET    /results/student/:id\nPOST   /results/import`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Пример тела запроса
              </h3>
              <CodeBlock>{`{\n  "studentId": 12,\n  "subject": "История",\n  "score": 82,\n  "completedAt": "2025-03-20T10:00:00Z"\n}`}</CodeBlock>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Аналитические эндпоинты
              </h3>
              <CodeBlock>{`GET /analytics/summary\nGET /analytics/classes/:id\nGET /analytics/student/:id/progress\nGET /analytics/trends?days=90`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Описание
              </h3>
              <p style={{ color: "#444", lineHeight: 1.5 }}>
                Движок на <strong>pandas</strong> рассчитывает средние значения,
                динамику, корреляции и зоны риска. Данные обновляются в реальном
                времени через Supabase Realtime.
              </p>
            </div>
          </div>
        );

      case "ml":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                ML методы
              </h3>
              <CodeBlock>{`POST /ml/predict-score\nGET  /ml/recommendations/class/9A\nGET  /ml/risk-zone?schoolId=5`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Пример ответа (предсказание)
              </h3>
              <CodeBlock>{`{\n  "predictedScore": 78.5,\n  "confidence": 0.89,\n  "recommendations": ["повторить тему 3", "доп. задачи"]\n}`}</CodeBlock>
            </div>
          </div>
        );

      case "images":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Генерация изображений (Stable Diffusion)
              </h3>
              <CodeBlock>{`POST /ai/image\n{\n  "prompt": "Москва 1812 год, пожар, историческая живопись",\n  "negative_prompt": "искажения, мультяшный",\n  "steps": 30\n}`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Назначение
              </h3>
              <p style={{ color: "#444", lineHeight: 1.5 }}>
                Исторические сцены, иллюстрации к урокам, карточки для викторин,
                визуальные материалы для презентаций. Результат возвращается в
                формате <strong>base64</strong> или <strong>url</strong> (по
                запросу).
              </p>
            </div>
          </div>
        );

      case "webhooks":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Регистрация и события
              </h3>
              <CodeBlock>{`POST /webhooks/register\n{\n  "url": "https://your-school.ru/webhook",\n  "events": ["student.created", "test.completed", "report.ready"]\n}`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Пример входящего payload
              </h3>
              <CodeBlock>{`{\n  "event": "test.completed",\n  "timestamp": "2025-03-20T12:00:00Z",\n  "data": { "resultId": 55, "score": 92 }\n}`}</CodeBlock>
            </div>
          </div>
        );

      case "errors":
        return (
          <div
            className="liquid-glass"
            style={{
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Коды ошибок HTTP
              </h3>
              <CodeBlock>{`200 OK\n201 Created\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n429 Too Many Requests\n500 Internal Server Error`}</CodeBlock>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Формат ответа с ошибкой
              </h3>
              <CodeBlock>{`{\n  "error": true,\n  "code": "UNAUTHORIZED",\n  "message": "Missing or invalid token",\n  "timestamp": "2025-03-20T12:00:00Z"\n}`}</CodeBlock>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        paddingBottom: "60px",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "10px",
            }}
          >
            API Документация
          </h1>
          <p style={{ color: "#666", margin: 0 }}>
            Подключайте результаты тестирования, аналитику и AI-сервисы через
            единый enterprise API.
          </p>
        </div>
        <div
          className="btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.9rem" }}
        >
          v1.0
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "24px",
        }}
      >
        <div
          className="liquid-glass"
          style={{
            padding: "20px",
            height: "fit-content",
            position: "sticky",
            top: "20px",
          }}
        >
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="Поиск по документации..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "40px",
                border: "1px solid #ddd",
                background: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <Search
              size={18}
              style={{
                position: "absolute",
                right: "16px",
                top: "14px",
                color: "#aaa",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {filteredTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "40px",
                  background: tab === t.key ? "#ff6600" : "transparent",
                  color: tab === t.key ? "white" : "#333",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "0.2s",
                  width: "100%",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (tab !== t.key)
                    e.currentTarget.style.background = "rgba(255,102,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (tab !== t.key)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <t.icon size={18} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
