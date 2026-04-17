import * as XLSX from 'xlsx';
import { StudentData } from '../api/csvDataProvider';

export const generateXLSXReport = (data: StudentData[]) => {
  // Лист 1: Школы
  const schoolStats = new Map<string, { name: string, total: number, passed: number }>();
  
  data.forEach(student => {
    const ogrn = student.ogrn_naprav;
    const name = student.name_naprav;
    
    if (!schoolStats.has(ogrn)) {
      schoolStats.set(ogrn, { name, total: 0, passed: 0 });
    }
    
    const stats = schoolStats.get(ogrn)!;
    stats.total += 1;
    // Приводим результат к нижнему регистру для надежности
    const res = student.result?.toLowerCase();
    if (res === 'достаточный' || res === 'высокий') { // Учитываем возможные варианты успеха
      stats.passed += 1;
    }
  });

  const schoolsSheetData = Array.from(schoolStats.entries()).map(([ogrn, stats]) => ({
    'Название Школы': stats.name,
    'ОГРН': ogrn,
    'Кол-во отправленных учеников': stats.total,
    '% сдачи по школе': stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) + '%' : '0%'
  }));

  // Лист 2: Ученики
  const studentsSheetData = data.map(student => ({
    'ФИО': `${student.last_name} ${student.first_name} ${student.middle_name || ''}`.trim(),
    'Дата рождения': student.bdate,
    'Класс': student.class,
    'Дата прохождения теста': student.test_date,
    'Результат': student.result,
    'Где проходил тестирование': student.name_area
  }));

  // Создаем рабочую книгу
  const wb = XLSX.utils.book_new();
  
  // Создаем листы
  const wsSchools = XLSX.utils.json_to_sheet(schoolsSheetData);
  const wsStudents = XLSX.utils.json_to_sheet(studentsSheetData);
  
  // Добавляем листы в книгу
  XLSX.utils.book_append_sheet(wb, wsSchools, 'Школы');
  XLSX.utils.book_append_sheet(wb, wsStudents, 'Ученики');
  
  // Генерируем файл и скачиваем
  XLSX.writeFile(wb, `Report_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
};
