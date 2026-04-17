import React, { useState, useEffect, useRef } from 'react';
import { Download, Filter, Calendar, Info, Users, TrendingUp, BarChart3, PieChart as PieIcon, X, ChevronDown, Check } from 'lucide-react';
import { SchoolFilter } from '../components/SchoolFilter';
import { 
  ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { fetchDashboardStats, fetchSchools, downloadXLSXReport } from '../api';

export default function Dashboard() {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [period, setPeriod] = useState(90);
  const [stats, setStats] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для модального окна и кастомного селекта
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchDashboardStats(),
      fetchSchools()
    ]).then(([statsData, schoolsData]) => {
      setStats(statsData);
      setSchools(schoolsData);
    })
    .catch(err => console.error("Data fetch error:", err))
    .finally(() => setLoading(false));

    // Закрытие выпадашки даты при клике вне
    const handleClickOutside = (e: MouseEvent) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadReport = async () => {
    setIsModalOpen(false); 
    await downloadXLSXReport(selectedSchools, period);
  };

  const COLORS = ['#ff6600', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
  
  const periodOptions = [
    { label: 'Последние 7 дней', value: 7 },
    { label: 'Последние 30 дней', value: 30 },
    { label: 'Последние 90 дней', value: 90 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px', position: 'relative' }}>
      
      {/* Модальное окно фильтров */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(255, 102, 0, 0.05)', backdropFilter: 'blur(12px)',
          zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="liquid-glass" style={{
            width: '90%', maxWidth: '600px', padding: '40px', 
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 1)',
            borderRadius: '32px', boxShadow: '0 50px 100px rgba(255, 102, 0, 0.15)',
            position: 'relative', display: 'flex', flexDirection: 'column', gap: '25px',
            backdropFilter: 'blur(30px)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{
              position: 'absolute', top: '25px', right: '25px', background: 'rgba(0,0,0,0.05)', 
              border: 'none', width: '36px', height: '36px', borderRadius: '50%',
              cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: '0.3s'
            }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,102,0,0.1)'} 
               onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
            ><X size={20} /></button>

            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Настройка отчета</h2>
              <p style={{ color: '#666' }}>Выберите необходимые фильтры для выгрузки XLSX файла</p>
            </div>

            {/* Фильтр школ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>Образовательные организации:</label>
              <SchoolFilter schools={schools} selectedOgrns={selectedSchools} onChange={setSelectedSchools} />
            </div>

            {/* Кастомный селект дат */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>Период данных:</label>
              <div ref={dateDropdownRef} style={{ position: 'relative' }}>
                <div 
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  style={{
                    padding: '12px 20px', background: 'rgba(255,255,255,0.6)', border: '1px solid #ddd',
                    borderRadius: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', fontWeight: 500
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={18} color="#ff6600" />
                    {periodOptions.find(o => o.value === period)?.label}
                  </div>
                  <ChevronDown size={18} style={{ transform: isDateDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </div>
                {isDateDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                    background: 'white', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #eee', zIndex: 10, overflow: 'hidden'
                  }}>
                    {periodOptions.map((opt) => (
                      <div 
                        key={opt.value}
                        onClick={() => { setPeriod(opt.value); setIsDateDropdownOpen(false); }}
                        style={{
                          padding: '12px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                          background: period === opt.value ? 'rgba(255,102,0,0.05)' : 'white'
                        }}
                        className="dropdown-item-hover"
                      >
                        {opt.label}
                        {period === opt.value && <Check size={16} color="#ff6600" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleDownloadReport} 
              className="btn-primary" 
              style={{ padding: '15px', marginTop: '10px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              <Download size={20} /> Сформировать и скачать
            </button>
          </div>
        </div>
      )}

      {/* Основной контент дашборда */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Аналитический Центр</h1>
          <p style={{ color: '#666' }}>Интерактивный мониторинг процедур независимого тестирования</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={18} /> Скачать XLSX
        </button>
      </header>

      {/* Верхние метрики */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="liquid-glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>Всего тестов</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#121212' }}>{stats?.total_tests || 0}</div>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Users color="#3b82f6" />
          </div>
        </div>
        
        <div className="liquid-glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>Критических нарушений</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444' }}>{stats?.violations_count || 0}</div>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <TrendingUp color="#ef4444" />
          </div>
        </div>
      </div>

      {/* Центральный блок графиков */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* График 1: Активность (Bar) */}
        <div className="liquid-glass" style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '25px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="#ff6600" /> Активность организаций (Топ-10)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.school_activity || []} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" fontSize={11} width={80} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="students" name="Тестов" fill="#ff6600" radius={[0, 5, 5, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* График 2: Динамика (Area) */}
        <div className="liquid-glass" style={{ padding: '25px' }}>
          <h3 style={{ marginBottom: '25px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="#8b5cf6" /> Динамика прохождения тестов
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.timeline_data || []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                fontSize={10} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => {
                  if (!val) return '';
                  const [y, m] = val.split('-');
                  return `${m}/${y}`;
                }} 
              />
              <YAxis fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="count" name="Тестов" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 350px', gap: '20px' }}>
        <div className="liquid-glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={20} color="#3b82f6" /> Сводка производительности
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: "Средняя сдача учеников", value: "84.2%", color: "#10b981" },
                  { label: "Нагрузка на систему", value: "Стабильно", color: "#3b82f6" },
                  { label: "Темп роста тестирований", value: "+12% в неделю", color: "#ff6600" }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px solid #eee' }}>
                    <span style={{ color: '#666' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
            </div>
        </div>

        <div className="liquid-glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', width: '100%', textAlign: 'left' }}>
            <PieIcon size={18} color="#10b981" style={{ marginRight: '8px' }} /> Результаты
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.result_stats || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats?.result_stats || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
