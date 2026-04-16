import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CustomSelect } from '../components/CustomSelect';
import { X } from 'lucide-react';

const data = [
  { name: '01', pv: 2400, amt: 2400 },
  { name: '02', pv: 1398, amt: 2210 },
  { name: '03', pv: 9800, amt: 2290 },
  { name: '04', pv: 3908, amt: 2000 },
  { name: '05', pv: 4800, amt: 2181 },
  { name: '06', pv: 3800, amt: 2500 },
  { name: '07', pv: 4300, amt: 2100 },
];

const periodOptions = [
  { value: '7d', label: 'Последние 7 дней' },
  { value: '30d', label: 'Последние 30 дней' },
  { value: '90d', label: 'Последние 90 дней' },
];

const categoryOptions = [
  { value: 'traffic', label: 'Аудит трафика и RPS' },
  { value: 'errors', label: 'Безопасность и ошибки' },
  { value: 'latency', label: 'Задержки и производительность' },
];

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [period, setPeriod] = useState('7d');
  const [category, setCategory] = useState('traffic');
  const [modalPeriod, setModalPeriod] = useState('30d');

  const handleGenerate = () => {
    // Имитация генерации PDF для хакатона
    const dummyContent = `Analytics Report\nCategory: ${category}\nPeriod: ${modalPeriod}\nGenerated at: ${new Date().toLocaleString()}`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Analytics_Report_${category}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем память
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    setShowModal(false);
    
    // Показываем наш кастомный UI
    setShowSuccess(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
      {/* Success Notification - Плотный, центрированный, без затемнения */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card-solid">
            <div className="match-container-bg">
              <div className="match-stick">
                <div className="match-head"></div>
                <div className="flame-vfx"></div>
              </div>
            </div>
            
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
              <h2 className="text-gradient" style={{ fontSize: '4.5rem', marginBottom: '30px', fontWeight: 900 }}>Великолепно!</h2>
              <p style={{ color: '#000', fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '50px', maxWidth: '600px' }}>
                Ваш аналитический отчет был успешно <br/> сформирован и загружен на устройство.
              </p>
              <button 
                onClick={() => setShowSuccess(false)} 
                className="btn-primary" 
                style={{ padding: '24px 100px', fontSize: '1.6rem', borderRadius: '35px', boxShadow: '0 20px 50px rgba(255, 102, 0, 0.4)' }}
              >
                Хорошо
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '8px' }}>Аналитическая панель</h1>
          <p style={{ color: '#666' }}>Обзор ключевых показателей в реальном времени</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Создать отчет
          </button>
          <CustomSelect 
            options={periodOptions} 
            value={period} 
            onChange={setPeriod} 
          />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="liquid-glass modal-content" style={{ padding: '70px', maxWidth: '850px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-gradient" style={{ marginBottom: '25px', fontSize: '2.5rem', fontWeight: 700 }}>Параметры отчета</h2>
            <p style={{ marginBottom: '45px', color: '#555', lineHeight: '1.6', fontSize: '1.2rem' }}>Выберите необходимые типы данных и временной диапазон для формирования глубокой аналитики в формате PDF.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Категория данных</label>
                <CustomSelect 
                  options={categoryOptions} 
                  value={category} 
                  onChange={setCategory}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>Временной диапазон</label>
                <CustomSelect 
                  options={periodOptions} 
                  value={modalPeriod} 
                  onChange={setModalPeriod}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-end', marginTop: '50px' }}>
              <button onClick={() => setShowModal(false)} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Отмена</button>
              <button onClick={handleGenerate} className="btn-primary" style={{ padding: '16px 35px', fontSize: '1rem' }}>Сгенерировать и скачать PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { label: 'Всего запросов', value: '124,563', trend: '+14%' },
          { label: 'Пиковая нагрузка', value: '840 RPS', trend: '+5%' },
          { label: 'Средний отклик', value: '112 мс', trend: '-2%' },
          { label: 'Ошибок', value: '0.04%', trend: '-0.1%' }
        ].map((stat, i) => (
          <div key={i} className="liquid-glass" style={{ padding: '20px', animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', color: stat.trend.includes('+') ? '#cc3300' : '#4caf50', marginTop: '8px', fontWeight: 600 }}>
              {stat.trend} к прошлой неделе
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="liquid-glass" style={{ padding: '20px', minHeight: '400px', animationDelay: '0.4s' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Динамика использования (PV)</h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6600" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6600" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="pv" stroke="#ff6600" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="liquid-glass" style={{ padding: '20px', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Распределение (AMT)</h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255, 102, 0, 0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="amt" fill="#ffaa00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
