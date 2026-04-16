const USE_MOCK = true;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DashboardSummary {
  total_requests: string;
  peak_load: string;
  avg_response: string;
  error_rate: string;
}

const MOCK_SUMMARY: DashboardSummary = {
  total_requests: "124,563",
  peak_load: "840 RPS",
  avg_response: "112 ms",
  error_rate: "0.04%"
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUMMARY), 400));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
    if (!response.ok) throw new Error('Ошибка сети');
    return await response.json();
  } catch (error) {
    console.error("API Ошибка:", error);
    return MOCK_SUMMARY;
  }
};
