import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: '01', pv: 2400, amt: 2400 },
  { name: '02', pv: 1398, amt: 2210 },
  { name: '03', pv: 9800, amt: 2290 },
  { name: '04', pv: 3908, amt: 2000 },
  { name: '05', pv: 4800, amt: 2181 },
  { name: '06', pv: 3800, amt: 2500 },
  { name: '07', pv: 4300, amt: 2100 },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Аналитическая панель</h1>
          <p style={{ color: '#666' }}>Обзор ключевых показателей в реальном времени</p>
        </div>
        <select className="liquid-glass" style={{ padding: '8px 16px', outline: 'none', background: 'rgba(255,255,255,0.4)', color: '#333' }}>
          <option>Последние 7 дней</option>
          <option>Последние 30 дней</option>
        </select>
      </div>

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
