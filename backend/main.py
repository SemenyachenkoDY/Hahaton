import os
import io
import csv
import logging
import re
from datetime import datetime, timedelta
from typing import Optional, List, Dict
from collections import Counter

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from supabase import create_client, Client

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Analytics Hackathon API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Настройки Supabase ---
SUPABASE_URL = "https://rcgvgoqbnxncedmxjqqu.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZ3Znb3FibnhuY2VkbXhqcXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODg2NDAsImV4cCI6MjA5MTk2NDY0MH0.if6EQJxhQUwEx9WTAbAs6ltui61RAWH6FkQ8XfYdKPI"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    logger.warning(f"Supabase client not initialized: {e}")
    supabase = None

CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "hakaton.csv")
BASE_DATE = datetime(2026, 3, 30)

# Глобальный кэш для CSV данных
_CSV_CACHE: List[Dict] = []

# ============================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================

def shorten_school_name(name: str) -> str:
    if not name or not isinstance(name, str): return "Неизвестная школа"
    number_match = re.search(r'№\s*(\d+)', name)
    number = f" №{number_match.group(1)}" if number_match else ""
    prefix = ""
    upper_name = name.upper()
    if "МБОУ" in upper_name: prefix = "МБОУ"
    elif "ГБОУ" in upper_name: prefix = "ГБОУ"
    elif "МАОУ" in upper_name: prefix = "МАОУ"
    if prefix or number: return f"{prefix}{number}".strip()
    return name[:25] + "..." if len(name) > 25 else name

def format_date_to_month(date_str: str) -> Optional[str]:
    if not date_str or not isinstance(date_str, str): return None
    return date_str[:7] if len(date_str) >= 7 else None

def load_csv_data() -> List[Dict]:
    global _CSV_CACHE
    if _CSV_CACHE: return _CSV_CACHE
    if not os.path.exists(CSV_PATH): return []
    try:
        data = []
        with open(CSV_PATH, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter=";")
            for row in reader: data.append(row)
        _CSV_CACHE = data
        logger.info(f"CSV CACHED: {len(data)} rows")
        return data
    except Exception as e:
        logger.error(f"CSV error: {e}")
        return []

def get_stats_from_csv():
    data = load_csv_data()
    total_tests = len(data)
    school_activity_map = Counter()
    results_list = []
    months_list = []
    for row in data:
        name = str(row.get("name_naprav") or row.get("school_name", "Неизвестно"))
        school_activity_map[shorten_school_name(name)] += 1
        results_list.append(row.get("result", ""))
        m = format_date_to_month(str(row.get("test_date") or row.get("date", "")))
        if m: months_list.append(m)
    
    school_activity = [{"name": k, "students": v} for k, v in school_activity_map.most_common(10)]
    result_stats = [{"name": k or "Нет данных", "value": v} for k, v in Counter(results_list).items()]
    month_counts = Counter(months_list)
    timeline_data = [{"date": d, "count": c} for d, c in sorted(month_counts.items()) if d]
    
    return {
        "total_tests": total_tests, "violations_count": int(total_tests * 0.04),
        "school_activity": school_activity, "timeline_data": timeline_data,
        "result_stats": result_stats, "source": "csv_fallback"
    }

async def get_combined_report_data(ogrns: List[str], period_days: int) -> Dict[str, List[Dict]]:
    if not supabase: return {"schools": [], "students": []}
    end_date = BASE_DATE.strftime("%Y-%m-%d")
    start_date = (BASE_DATE - timedelta(days=period_days - 1)).strftime("%Y-%m-%d")
    try:
        schools_res = supabase.table("view_school_stats").select("*")
        if ogrns: schools_res = schools_res.in_("school_ogrn", ogrns)
        schools_data = schools_res.execute()
        
        student_query = supabase.table("view_student_details").select("*") \
            .gte("test_date", start_date).lte("test_date", end_date)
        if ogrns: student_query = student_query.in_("sender_school_ogrn", ogrns)
        students_res = student_query.execute()
        
        return {"schools": schools_data.data or [], "students": students_res.data or []}
    except Exception as e:
        logger.error(f"Supabase error: {e}")
        return {"schools": [], "students": []}

def build_xlsx_fast(schools_data: List[Dict], students_data: List[Dict]) -> io.BytesIO:
    wb = openpyxl.Workbook()
    f_bold = Font(name="Arial", bold=True, color="FFFFFF")
    f_fill = PatternFill(start_color="CC3300", end_color="CC3300", fill_type="solid")
    f_border = Border(left=Side(style="thin"), right=Side(style="thin"), top=Side(style="thin"), bottom=Side(style="thin"))
    
    ws1 = wb.active
    ws1.title = "Школы"
    h1 = ["Название Школы", "ОГРН", "Учеников", "% сдачи"]
    for c, val in enumerate(h1, 1):
        cell = ws1.cell(1, c, val)
        cell.font, cell.fill, cell.border = f_bold, f_fill, f_border

    for r, row in enumerate(schools_data, 2):
        ws1.cell(r, 1, row.get("school_name"))
        ws1.cell(r, 2, row.get("school_ogrn"))
        ws1.cell(r, 3, row.get("total_students"))
        ws1.cell(r, 4, row.get("pass_rate"))
        for c in range(1, 5): ws1.cell(r, c).border = f_border
    
    ws2 = wb.create_sheet("Ученики")
    h2 = ["ФИО", "Дата рождения", "Класс", "Дата теста", "Результат", "Место"]
    for c, val in enumerate(h2, 1):
        cell = ws2.cell(1, c, val)
        cell.font, cell.fill, cell.border = f_bold, f_fill, f_border

    for r, row in enumerate(students_data, 2):
        ws2.cell(r, 1, row.get("fio"))
        ws2.cell(r, 2, row.get("birth_date"))
        ws2.cell(r, 3, row.get("class"))
        ws2.cell(r, 4, row.get("test_date"))
        ws2.cell(r, 5, row.get("result"))
        ws2.cell(r, 6, row.get("area_school", row.get("testing_location", "")))
        for c in range(1, 7): ws2.cell(r, c).border = f_border

    ws1.column_dimensions["A"].width = 50
    ws2.column_dimensions["A"].width = 40
    ws2.column_dimensions["F"].width = 40
    out = io.BytesIO()
    wb.save(out)
    out.seek(0)
    return out

# ============================
# API ЭНДПОИНТЫ
# ============================

@app.get("/")
def read_root(): return {"status": "ok"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    if not supabase: return get_stats_from_csv()
    try:
        t_res = supabase.table("tests").select("id", count="exact").execute()
        t_count = t_res.count if hasattr(t_res, 'count') else 0
        if t_count == 0: return get_stats_from_csv()

        v_res = supabase.table("view_frequency_violations").select("child_id_ref", count="exact").execute()
        v_count = v_res.count if hasattr(v_res, 'count') else 0

        s_res = supabase.table("view_school_stats").select("*").execute()
        s_act = sorted([
            {"name": shorten_school_name(str(s.get("school_name", ""))), "students": s.get("total_students", 0)} 
            for s in (s_res.data or [])
        ], key=lambda x: x["students"], reverse=True)[:10]

        tm_res = supabase.table("tests").select("test_date").limit(5000).execute()
        tm_counts = Counter([format_date_to_month(str(d["test_date"])) for d in (tm_res.data or []) if d.get("test_date")])
        tm_data = [{"date": d, "count": c} for d, c in sorted(tm_counts.items()) if d]

        rs_res = supabase.table("tests").select("result").limit(3000).execute()
        rs_counts = Counter([r["result"] for r in (rs_res.data or []) if r.get("result")])
        rs_data = [{"name": k or "Нет данных", "value": v} for k, v in rs_counts.items()]

        return {"total_tests": t_count, "violations_count": v_count, "school_activity": s_act, "timeline_data": tm_data, "result_stats": rs_data}
    except Exception as e:
        logger.error(f"API Error: {e}")
        return get_stats_from_csv()

@app.get("/api/schools")
async def get_schools():
    if supabase:
        try:
            res = supabase.table("view_school_stats").select("school_ogrn, school_name").execute()
            if res.data: return [{"ogrn": r["school_ogrn"], "name": r["school_name"]} for r in res.data]
        except: pass
    data = load_csv_data()
    sm = {}
    for row in data:
        o, n = str(row.get("ogrn_naprav") or "").strip(), str(row.get("name_naprav") or "").strip()
        if o and n: sm[o] = n
    return [{"ogrn": k, "name": v} for k, v in sorted(sm.items(), key=lambda x: x[1])]

@app.get("/api/report/download")
async def download_report(ogrns: Optional[str] = Query(None), period: int = Query(30)):
    ol = [o.strip() for o in ogrns.split(",") if o.strip()] if ogrns else []
    sd = await get_combined_report_data(ol, period)
    if not (sd["schools"] or sd["students"]):
        data = load_csv_data()
        buf = build_xlsx_fast([], [{"fio": r.get("fio", ""), "test_date": r.get("test_date", ""), "result": r.get("result", "")} for r in data[:300]])
    else:
        buf = build_xlsx_fast(sd["schools"], sd["students"])
    fname = f"Report_{datetime.now().strftime('%Y-%m-%d')}.xlsx"
    return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": f'attachment; filename="{fname}"'})
