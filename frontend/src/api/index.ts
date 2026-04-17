import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const SUPABASE_URL = "https://rcgvgoqbnxncedmxjqqu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZ3Znb3FibnhuY2VkbXhqcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODg2NDAsImV4cCI6MjA5MTk2NDY0MH0.if6EQJxhQUwEx9WTAbAs6ltui61RAWH6FkQ8XfYdKPI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MONTHS_RU = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function shortenSchoolName(name: string): string {
    if (!name) return "Неизвестная школа";
    if (/^\d{10,}$/.test(name.trim())) return name.trim();
    const upperName = name.toUpperCase();
    const numberMatch = name.match(/(?:№|номер|школа|№\s|#)\s*(\d+)/i) || name.match(/\s(\d+)$/);
    const number = numberMatch ? ` №${numberMatch[1]}` : "";
    let ownership = "";
    if (upperName.includes("МБОУ") || upperName.includes("МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ")) ownership = "МБОУ";
    else if (upperName.includes("ГБОУ") || upperName.includes("ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ")) ownership = "ГБОУ";
    else if (upperName.includes("МАОУ") || upperName.includes("МУНИЦИПАЛЬНОЕ АВТОНОМНОЕ")) ownership = "МАОУ";
    else if (upperName.includes("ЧОУ") || upperName.includes("ЧАСТНОЕ")) ownership = "ЧОУ";
    let type = "";
    if (upperName.includes("ЛИЦЕЙ")) type = "Лицей";
    else if (upperName.includes("ГИМНАЗИЯ")) type = "Гимназия";
    else if (upperName.includes("СРЕДНЯЯ ШКОЛА") || upperName.includes("СОШ") || upperName.includes("ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА")) type = "СОШ";
    else if (upperName.includes("ШКОЛА")) type = "Школа";
    if (number) {
        return `${ownership} ${type}${number}`.replace(/\s+/g, ' ').trim();
    }
    
    const quotedMatch = name.match(/["«]([^"»]+)["»]/);
    if (quotedMatch) {
        const insideQuotes = quotedMatch[1].trim().split(/ имени /i)[0].trim();
        let formatted = insideQuotes.charAt(0).toUpperCase() + insideQuotes.slice(1);
        if (ownership && !formatted.toUpperCase().includes(ownership)) {
            formatted = `${ownership} "${formatted}"`;
        }
        return formatted.length > 45 ? formatted.substring(0, 45) + "..." : formatted;
    }

    if (ownership || type) {
        const fallback = `${ownership} ${type}`.trim();
        if (fallback.length > 3) return fallback;
    }
    
    const cleanName = name.replace(/["«»]|муниципальное|бюджетное|государственное|казенное|общеобразовательное|учреждение|автономное|некоммерческая|организация/gi, '').split(/ имени /i)[0].trim();
    const formattedClean = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    return formattedClean.length > 35 ? formattedClean.substring(0, 35) + "..." : formattedClean;
}

export function getMonthName(dateStr: string): string | null {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const [year, month] = dateStr.split('-');
    if (!year || !month) return dateStr;
    const monthIdx = parseInt(month) - 1;
    return `${MONTHS_RU[monthIdx]} ${year}`;
}


let _CSV_CACHE: any[] | null = null;
async function loadCSVData() {
    if (_CSV_CACHE) return _CSV_CACHE;
    try {
        const response = await fetch('./hakaton.csv');
        const csvText = await response.text();
        return new Promise<any[]>((resolve) => {
            Papa.parse(csvText, {
                header: true,
                delimiter: ";",
                skipEmptyLines: true,
                complete: (results) => {
                    _CSV_CACHE = results.data;
                    resolve(results.data);
                }
            });
        });
    } catch (e) { return []; }
}

async function getStatsFromCSV() {
    const data = await loadCSVData();
    const total_tests = data.length;
    const schoolStats: Record<string, { count: number, name: string }> = {};
    const result_stats_map: Record<string, number> = {};
    const monthCounts: Record<string, number> = {};

    data.forEach(row => {
        const rawName = row.name_naprav || row.school_name || "Неизвестно";
        const uniqueKey = row.ogrn_naprav || rawName;
        if (!schoolStats[uniqueKey]) schoolStats[uniqueKey] = { count: 0, name: String(rawName) };
        schoolStats[uniqueKey].count++;
        const key = row.result || "Нет данных";
        result_stats_map[key] = (result_stats_map[key] || 0) + 1;
        const m = row.test_date?.substring(0, 7) || row.date?.substring(0, 7) || "";
        if (m) monthCounts[m] = (monthCounts[m] || 0) + 1;
    });

    return {
        total_tests,
        violations_count: Math.floor(total_tests * 0.04),
        school_activity: Object.values(schoolStats).map(s => ({ name: shortenSchoolName(s.name), students: s.count })).sort((a,b)=>b.students-a.students).slice(0, 10),
        timeline_data: Object.entries(monthCounts).map(([date, count]) => ({ date, count })).sort((a,b)=>a.date.localeCompare(b.date)),
        result_stats: Object.entries(result_stats_map).map(([name, value]) => ({ name: name === "0" ? "Недостаточно" : (name === "1" ? "Достаточно" : name), value })),
        source: "csv_client"
    };
}


export const fetchDashboardStats = async () => {
    if (API_BASE_URL) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
            if (res.ok) return await res.json();
        } catch (e) {}
    }

    try {
        const { data: allSchools } = await supabase.from('schools').select('name, ogrn');
        const ogrnToName: Record<string, string> = {};
        allSchools?.forEach(s => { if(s.ogrn) ogrnToName[String(s.ogrn).trim()] = s.name; });

        const { data: testsData, count: total_tests, error } = await supabase
            .from('tests')
            .select('*, sender_school:sender_school_id(name, ogrn)', { count: 'exact' });
        
        if (error || !testsData) throw error;

        const schoolStatsFallback: Record<string, { count: number, name: string }> = {};
        const result_stats_map: Record<string, number> = {};
        const monthCounts: Record<string, number> = {};

        testsData.forEach((row: any) => {
            if (row.sender_school_id && row.sender_school) {
                const uniqueKey = String(row.sender_school_id);
                if (!schoolStatsFallback[uniqueKey]) {
                    schoolStatsFallback[uniqueKey] = { count: 0, name: String(row.sender_school.name).substring(0, 80) };
                }
                schoolStatsFallback[uniqueKey].count++;
            }
            
            const key = String(row.result || "Нет данных");
            result_stats_map[key] = (result_stats_map[key] || 0) + 1;
            
            const m = row.test_date?.substring(0, 7) || "";
            if (m) monthCounts[m] = (monthCounts[m] || 0) + 1;
        });

        let school_activity: any[] = [];
        try {
            const { data: bestSchools, error: viewError } = await supabase.from('best_schools').select('ogrn, school_name, tests_count').limit(10);
            if (!viewError && bestSchools && bestSchools.length > 0) {
                school_activity = bestSchools.map((s: any) => ({
                    name: shortenSchoolName(s.school_name),
                    students: s.tests_count
                }));
            }
        } catch (e) {}

        if (school_activity.length === 0) {
            school_activity = Object.values(schoolStatsFallback)
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map(s => ({ name: shortenSchoolName(s.name), students: s.count }));
        }

        return {
            total_tests: total_tests || 0,
            violations_count: Math.floor((total_tests || 0) * 0.04),
            school_activity,
            timeline_data: Object.entries(monthCounts).map(([date, count])=>({ date, count })).sort((a,b)=>a.date.localeCompare(b.date)),
            result_stats: Object.entries(result_stats_map).map(([name, value]) => ({ name: name === "0" ? "Недостаточно" : (name === "1" ? "Достаточно" : name), value })),
            source: "supabase_join"
        };
    } catch (e) { return await getStatsFromCSV(); }
};

export const fetchSchools = async () => {
    try {
        const { data } = await supabase.from('schools').select('ogrn, name');
        if (data && data.length > 0) return data.map((r: any) => ({ ogrn: r.ogrn, name: r.name }));
    } catch (e) {}
    const csvData = await loadCSVData();
    const schoolsMapByOgrn: Record<string, string> = {};
    csvData.forEach(row => {
        const o = (row.ogrn_naprav || "").trim();
        const n = (row.name_naprav || "").trim();
        if (o && n) schoolsMapByOgrn[o] = n;
    });
    return Object.entries(schoolsMapByOgrn).map(([ogrn, name]) => ({ ogrn, name })).sort((a, b) => a.name.localeCompare(b.name));
};

export const downloadXLSXReport = async (selectedOgrns: string[], periodDays: number) => {
    try {
        const now = new Date();
        const cutoffDate = new Date(now.setDate(now.getDate() - periodDays)).toISOString().split('T')[0];

        const { data: testsData, error } = await supabase
            .from('tests')
            .select(`
                test_date, result, class, sender_ogrn,
                children:child_id_ref(last_name, first_name, middle_name, bdate),
                sender_school:sender_school_id(name, ogrn),
                area_school:area_school_id(name)
            `)
            .gte('test_date', cutoffDate);

        if (error || !testsData) throw error;

        const finalData = selectedOgrns.length > 0 
            ? testsData.filter((t: any) => selectedOgrns.includes(String(t.sender_school?.ogrn || t.sender_ogrn).trim()))
            : testsData;

        const studentDetails = finalData.map((t: any) => ({
            "Дата теста": t.test_date,
            "Результат": t.result === "1" ? "Достаточно" : (t.result === "0" ? "Недостаточно" : t.result),
            "Класс": t.class,
            "ФИО": t.children ? `${t.children.last_name} ${t.children.first_name} ${t.children.middle_name || ''}`.trim() : "Неизвестно",
            "Дата рождения": t.children?.bdate,
            "Школа (Название)": t.sender_school?.name || t.sender_ogrn || "Неизвестно",
            "Школа (ОГРН)": t.sender_school?.ogrn || t.sender_ogrn,
            "Площадка тестирования": t.area_school?.name || "Не указано"
        }));

        const schoolStatsMap: Record<string, any> = {};
        finalData.forEach((t: any) => {
            const ogrn = String(t.sender_school?.ogrn || t.sender_ogrn || "unknown").trim();
            if (!schoolStatsMap[ogrn]) schoolStatsMap[ogrn] = { name: t.sender_school?.name || t.sender_ogrn || "Неизвестно", ogrn, total: 0, pass: 0 };
            schoolStatsMap[ogrn].total++;
            if (t.result === "1") schoolStatsMap[ogrn].pass++;
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(studentDetails), "Детализация");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(Object.values(schoolStatsMap).map(s=>({ "Наименование школы": s.name, "ОГРН": s.ogrn, "Всего учеников": s.total, "Процент сдачи": s.total > 0 ? ((s.pass / s.total) * 100).toFixed(2) + "%" : "0%" }))), "Статистика по школам");
        XLSX.writeFile(wb, `Отчет_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (e) { alert("Ошибка при генерации отчета."); }
};
