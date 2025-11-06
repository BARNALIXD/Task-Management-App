import { useState, useEffect, useRef } from 'react';
import './SummaryInsights.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function SummaryInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Prevent double-fetch in React.StrictMode
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchInsights();
    // Refresh insights every 5 seconds
    intervalRef.current = setInterval(fetchInsights, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/summary/insights`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="insights-loading">Loading insights...</div>;
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="summary-insights">
      <h2>Summary Insights</h2>
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-label">Total Revenue</div>
          <div className="insight-value">${insights.totalRevenue.toFixed(2)}</div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Total Time</div>
          <div className="insight-value">{insights.totalTime.toFixed(1)}h</div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Efficiency</div>
          <div className="insight-value">
            ${isNaN(insights.efficiency) || !isFinite(insights.efficiency)
              ? '0.00'
              : insights.efficiency.toFixed(2)}/h
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Average ROI</div>
          <div className="insight-value">
            {isNaN(insights.avgROI) || !isFinite(insights.avgROI)
              ? '0.00'
              : insights.avgROI.toFixed(2)}
          </div>
        </div>

        <div className="insight-card grade-card">
          <div className="insight-label">Performance Grade</div>
          <div className={`insight-value grade-${insights.grade.replace('+', 'plus')}`}>
            {insights.grade}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">Total Tasks</div>
          <div className="insight-value">{insights.totalTasks}</div>
        </div>
      </div>
    </div>
  );
}

export default SummaryInsights;
