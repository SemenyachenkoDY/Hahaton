import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Check, X, ChevronDown } from 'lucide-react';
import { SchoolInfo } from '../api/csvDataProvider';

interface SchoolFilterProps {
  schools: SchoolInfo[];
  selectedOgrns: string[];
  onChange: (ogrns: string[]) => void;
}

export const SchoolFilter: React.FC<SchoolFilterProps> = ({ schools, selectedOgrns, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSchools = useMemo(() => {
    if (!searchTerm) return schools;
    const lowerSearch = searchTerm.toLowerCase();
    return schools.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) || 
      s.ogrn.includes(lowerSearch)
    );
  }, [schools, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSchool = (ogrn: string) => {
    if (selectedOgrns.includes(ogrn)) {
      onChange(selectedOgrns.filter(id => id !== ogrn));
    } else {
      onChange([...selectedOgrns, ogrn]);
    }
  };

  const removeSchool = (ogrn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedOgrns.filter(id => id !== ogrn));
  };

  return (
    <div className="school-filter-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="liquid-glass filter-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 15px', 
          cursor: 'pointer', 
          minHeight: '52px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
          {selectedOgrns.length === 0 ? (
            <span style={{ color: '#666' }}>Выберите школы (ОГРН или Название)</span>
          ) : (
            selectedOgrns.map(ogrn => {
              const school = schools.find(s => s.ogrn === ogrn);
              return (
                <div 
                  key={ogrn}
                  style={{ 
                    background: 'rgba(255, 102, 0, 0.15)', 
                    color: '#cc3300', 
                    padding: '4px 10px', 
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {school?.name || ogrn}
                  </span>
                  <X 
                    size={14} 
                    onClick={(e) => removeSchool(ogrn, e)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              );
            })
          )}
        </div>
        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', color: '#cc3300' }} />
      </div>

      {isOpen && (
        <div 
          className="liquid-glass filter-dropdown"
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 12px)', 
            left: 0, 
            width: '100%', 
            zIndex: 1000002,
            padding: '15px',
            background: '#ffffff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'dropdownEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Поиск по названию или ОГРН..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '100%', 
                padding: '10px 10px 10px 38px', 
                borderRadius: '12px', 
                border: '1px solid #eee',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredSchools.length > 0 ? (
              filteredSchools.map(school => (
                <div 
                  key={school.ogrn}
                  onClick={() => toggleSchool(school.ogrn)}
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: selectedOgrns.includes(school.ogrn) ? 'rgba(255, 102, 0, 0.05)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '90%' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#121212', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>ОГРН: {school.ogrn}</span>
                  </div>
                  {selectedOgrns.includes(school.ogrn) && <Check size={16} color="#cc3300" />}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>Школы не найдены</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
