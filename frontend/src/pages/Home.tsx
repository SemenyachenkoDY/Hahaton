import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Database, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingTop: '40px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
          Превращаем данные в <br/>
          <span className="text-gradient">горящие инсайты</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#555', marginBottom: '40px', lineHeight: 1.6 }}>
          Каркас для хакатона по аналитике скорости и производительности. 
          Готовые контейнеры, красивые графики и подключение к API "из коробки".
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Посмотреть дашборды <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div className="liquid-glass" style={{ padding: '30px', animationDelay: '0.2s' }}>
          <div style={{ color: '#ff6600', marginBottom: '15px' }}><BarChart2 size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Готовые графики</h3>
          <p style={{ color: '#666', lineHeight: 1.5 }}>Интегрированные заглушки с Recharts. Просто передайте свои данные и получите премиум-результат.</p>
        </div>
        <div className="liquid-glass" style={{ padding: '30px', animationDelay: '0.2s' }}>
          <div style={{ color: '#ff6600', marginBottom: '15px' }}><Zap size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Скорость развертывания</h3>
          <p style={{ color: '#666', lineHeight: 1.5 }}>Vite обеспечивает мгновенную сборку, а структура гарантирует легкий деплой статики на GitHub Pages.</p>
        </div>
        <div className="liquid-glass" style={{ padding: '30px', animationDelay: '0.2s' }}>
          <div style={{ color: '#ff6600', marginBottom: '15px' }}><Database size={32} /></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Модуль API</h3>
          <p style={{ color: '#666', lineHeight: 1.5 }}>Подготовленная архитектура для подключения к бэкенду или любым внешним сервисам аналитики.</p>
        </div>
      </section>

    </div>
  );
}
