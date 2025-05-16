import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/CreditScoreAnalysis.css";
import FooterNew from "../components2/FooterNew";
import Logo from "../components/images/logo.png";
import Header2 from "../components2/Header2";

const CreditScoreAnalysis = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    paymentHistory: 0.3, // 0-1 scale (1 = perfect)
    creditUtilization: 0.2, // ratio (0-1)
    creditAge: 2, // years
    creditMix: 1, // number of different types (credit cards, loans, etc.)
    recentInquiries: 2, // number of recent credit inquiries
  });

  // Calculate credit score based on factors (300-850 range)
  const calculateCreditScore = () => {
    const {
      paymentHistory,
      creditUtilization,
      creditAge,
      creditMix,
      recentInquiries,
    } = userData;

    // Payment History (35% of score) - max 297.5 points
    const paymentScore = paymentHistory * 297.5;

    // Credit Utilization (30% of score) - max 255 points
    // Lower utilization is better (under 30% ideal)
    const utilizationScore = (1 - Math.min(creditUtilization, 1)) * 255;

    // Credit Age (15% of score) - max 127.5 points
    // More years is better (capped at 10+ years)
    const ageScore = (Math.min(creditAge, 10) / 10) * 127.5;

    // Credit Mix (10% of score) - max 85 points
    // Having different types is good (capped at 4+ types)
    const mixScore = (Math.min(creditMix, 4) / 4) * 85;

    // Recent Inquiries (10% of score) - max 85 points
    // Fewer inquiries is better (0 is best, more than 5 is worst)
    const inquiryScore = (1 - Math.min(recentInquiries, 5) / 5) * 85;

    // Sum all components and ensure it's within 300-850 range
    const rawScore = Math.round(
      paymentScore + utilizationScore + ageScore + mixScore + inquiryScore
    );
    
    return Math.max(300, Math.min(850, rawScore));
  };

  const score = calculateCreditScore();

  const chartData = [
    { name: "Payment History", value: 35 },
    { name: "Credit Utilization", value: 30 },
    { name: "Length of Credit History", value: 15 },
    { name: "Credit Mix", value: 10 },
    { name: "New Credit", value: 10 },
  ];

  const COLORS = ["#83C760", "#FB607F", "#FADADD", "#FF91A4", "#4EA217"];

  const getScoreStatus = (score) => {
    if (score >= 800) return "Excellent";
    if (score >= 740) return "Very Good";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };

  const status = getScoreStatus(score);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Function to update user data
  const updateUserData = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`main-layout`}>
      <Header2 />
      <div className="main-content">
        <div className="analysis-container">
          <div className="analysis-header">
            <h2 className="page-title">📊 Credit Score Analysis</h2>
            <button
              className="dark-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          {/* Add input controls for credit factors */}
          <div className="credit-factors-input">
            <h4>🔧 Adjust Your Credit Factors</h4>
            <div className="input-group">
              <label>
                Payment History (0-1):
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={userData.paymentHistory}
                  onChange={(e) => updateUserData("paymentHistory", parseFloat(e.target.value))}
                />
                <span>{userData.paymentHistory.toFixed(2)}</span>
              </label>
            </div>
            <div className="input-group">
              <label>
                Credit Utilization (0-1):
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={userData.creditUtilization}
                  onChange={(e) => updateUserData("creditUtilization", parseFloat(e.target.value))}
                />
                <span>{(userData.creditUtilization * 100).toFixed(0)}%</span>
              </label>
            </div>
            <div className="input-group">
              <label>
                Credit Age (years):
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={userData.creditAge}
                  onChange={(e) => updateUserData("creditAge", parseInt(e.target.value))}
                />
                <span>{userData.creditAge} years</span>
              </label>
            </div>
            <div className="input-group">
              <label>
                Credit Mix (types):
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={userData.creditMix}
                  onChange={(e) => updateUserData("creditMix", parseInt(e.target.value))}
                />
                <span>{userData.creditMix} types</span>
              </label>
            </div>
            <div className="input-group">
              <label>
                Recent Inquiries:
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={userData.recentInquiries}
                  onChange={(e) => updateUserData("recentInquiries", parseInt(e.target.value))}
                />
                <span>{userData.recentInquiries} inquiries</span>
              </label>
            </div>
          </div>

          <div className="score-overview">
            <div className="score-box">
              <h3>Your Score:</h3>
              <div className="score-number">
                <span>{score}</span>
                <div className="status-label">{status}</div>
              </div>
              <progress max="850" value={score} className="score-bar" />
              <p className="score-tip">ℹ️ Based on multiple credit factors</p>
            </div>

            <div className="score-chart">
              <h5>Credit Score Breakdown</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="score-range-section">
            <h4>🔢 Score Categories Explained</h4>
            <ul>
              <li>
                <strong>300–579:</strong> Poor
              </li>
              <li>
                <strong>580–669:</strong> Fair
              </li>
              <li>
                <strong>670–739:</strong> Good
              </li>
              <li>
                <strong>740–799:</strong> Very Good
              </li>
              <li>
                <strong>800–850:</strong> Excellent
              </li>
            </ul>
          </div>

          <div className="factors-section">
            <h4>🧮 What Impacts Your Score?</h4>
            <ul>
              <li>🕒 Payment History (35%)</li>
              <li>💳 Credit Utilization (30%)</li>
              <li>📅 Length of Credit History (15%)</li>
              <li>📂 Credit Mix (10%)</li>
              <li>🆕 New Credit Applications (10%)</li>
            </ul>
          </div>

          <div className="tips-section">
            <h4>💡 Tips to Improve</h4>
            <ul>
              <li>✅ Pay your bills on time</li>
              <li>✅ Keep credit card balances low</li>
              <li>✅ Avoid too many loan applications</li>
              <li>✅ Keep old accounts open</li>
            </ul>
          </div>

          <div className="bonus-section">
            <h4>📚 Learn More</h4>
            <p>
              Visit <a href="#">Bokamoso Credit Bureau</a> to understand how
              scores work and how to manage credit wisely.
            </p>
            <button className="update-button">
              Manage your finances wisely
            </button>
          </div>
        </div>
      </div>
      <FooterNew />
    </div>
  );
};

export default CreditScoreAnalysis;