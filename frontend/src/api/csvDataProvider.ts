import Papa from 'papaparse';

export interface StudentData {
  last_name: string;
  first_name: string;
  middle_name: string;
  bdate: string;
  gender: string;
  id_doc: string;
  guard_last_name: string;
  guard_first_name: string;
  guard_middle_name: string;
  guard_bdate: string;
  guard_gender: string;
  guard_id_doc: string;
  our_number: string;
  ogrn_naprav: string;
  name_naprav: string;
  ogrn_area: string;
  name_area: string;
  variant: string;
  class: string;
  test_date: string;
  result: string;
}

export interface SchoolInfo {
  ogrn: string;
  name: string;
}

class CSVDataProvider {
  private data: StudentData[] = [];
  private isLoaded = false;

  async loadData() {
    if (this.isLoaded) return;
    
    try {
      const response = await fetch('./hakaton.csv');
      if (!response.ok) throw new Error('CSV file not found in public folder');
      const csvText = await response.text();
      
      const results = Papa.parse<StudentData>(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
      });
      
      this.data = results.data;
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load CSV data:', error);
      throw error;
    }
  }

  getSchools(): SchoolInfo[] {
    const schoolsMap = new Map<string, string>();
    this.data.forEach(item => {
      if (item.ogrn_naprav && item.name_naprav) {
        schoolsMap.set(item.ogrn_naprav, item.name_naprav);
      }
    });
    
    return Array.from(schoolsMap.entries()).map(([ogrn, name]) => ({
      ogrn,
      name
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  getFilteredData(selectedOgrns: string[], periodDays: number): StudentData[] {
    // Базовая дата по требованию пользователя: 30 марта 2026
    const baseDate = new Date('2026-03-30');
    const endDate = new Date(baseDate);
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - (periodDays - 1)); // Включая саму дату
    
    return this.data.filter(item => {
      const matchesSchool = selectedOgrns.length === 0 || selectedOgrns.includes(item.ogrn_naprav);
      const itemDate = new Date(item.test_date);
      const matchesDate = itemDate >= startDate && itemDate <= endDate;
      return matchesSchool && matchesDate;
    });
  }
}

export const csvDataProvider = new CSVDataProvider();
