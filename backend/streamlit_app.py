import streamlit as st
import altair as alt
import pandas as pd
import requests

st.set_page_config(page_title="Analytics Hackathon Dashboard", layout="wide")

st.title("🔥 Интерактивный Дашборд (Streamlit + Altair)")

st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #fbf9f6 0%, #fbf9f6 40%, #ff6600 85%, #cc3300 100%);
    }
    .css-1d391kg {
        background-color: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px 0 rgba(204, 51, 0, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.6);
    }
</style>
""", unsafe_allow_html=True)

try:
    response = requests.get("http://api:8000/api/dashboard/summary")
    summary = response.json()
    st.write("Общие показатели:")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Всего", summary.get("total_requests", "N/A"))
    col2.metric("Пик", summary.get("peak_load", "N/A"))
    col3.metric("Отклик", summary.get("avg_response", "N/A"))
    col4.metric("Ошибки", summary.get("error_rate", "N/A"))
except Exception as e:
    st.warning("API Сервер недоступен, используем демо данные.")

# Демо график Altair
data = pd.DataFrame({
    'День': [1, 2, 3, 4, 5, 6, 7],
    'Отклик (мс)': [120, 115, 110, 125, 105, 95, 112]
})

chart = alt.Chart(data).mark_line(color='#ff6600', point=True).encode(
    x='День:O',
    y='Отклик (мс):Q',
    tooltip=['День', 'Отклик (мс)']
).properties(title="Средний отклик системы", height=400)

st.altair_chart(chart, use_container_width=True)
