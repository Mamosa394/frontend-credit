import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Header from "../components2/Header2";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [avatar, setAvatar] = useState("/images/avatar.jpg");
  const [userName, setUserName] = useState("User");
  const [showCreditReport, setShowCreditReport] = useState(false);
  const [creditScore, setCreditScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState({
    paymentHistory: "",
    creditUtilization: "",
    creditAge: "",
    creditMix: "",
    newCredit: ""
  });

  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("profile"));
    if (profileData) {
      setAvatar(profileData.avatar || "/images/avatar.jpg");
      setUserName(profileData.name || "User");
      if (profileData.creditScore) {
        setCreditScore(profileData.creditScore);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCreditScore = () => {
    if (!formData.paymentHistory || !formData.creditUtilization) {
      alert("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);
    
    // Calculate each factor individually
    const paymentHistoryScore = calculatePaymentHistoryScore(formData.paymentHistory);
    const utilizationScore = calculateUtilizationScore(formData.creditUtilization);
    const creditAgeScore = calculateCreditAgeScore(formData.creditAge);
    const creditMixScore = calculateCreditMixScore(formData.creditMix);
    const newCreditScore = calculateNewCreditScore(formData.newCredit);
    
    // Weighted calculation (standard FICO weights)
    const weightedScore = Math.round(
      (paymentHistoryScore * 0.35) +
      (utilizationScore * 0.30) +
      (creditAgeScore * 0.15) +
      (creditMixScore * 0.10) +
      (newCreditScore * 0.10)
    );
    
    // Ensure score is within bounds (300-850)
    const finalScore = Math.max(300, Math.min(850, weightedScore));
    
    setTimeout(() => {
      setCreditScore(finalScore);
      setIsCalculating(false);
      setShowCalculator(false);
      
      // Save to local storage
      const existingProfile = JSON.parse(localStorage.getItem("profile")) || {};
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...existingProfile, creditScore: finalScore })
      );
    }, 1500);
  };

  // Detailed calculation functions
  const calculatePaymentHistoryScore = (value) => {
    switch(value) {
      case "excellent": return 850;
      case "good": return 750;
      case "fair": return 650;
      case "poor": return 500;
      default: return 600;
    }
  };

  const calculateUtilizationScore = (value) => {
    const utilization = parseInt(value) || 0;
    if (utilization <= 10) return 850;
    if (utilization <= 30) return 750;
    if (utilization <= 50) return 650;
    if (utilization <= 80) return 550;
    return 450;
  };

  const calculateCreditAgeScore = (value) => {
    const age = parseInt(value) || 0;
    if (age >= 10) return 850;
    if (age >= 7) return 750;
    if (age >= 5) return 650;
    if (age >= 3) return 550;
    if (age >= 1) return 450;
    return 350;
  };

  const calculateCreditMixScore = (value) => {
    switch(value) {
      case "diverse": return 800;
      case "some": return 650;
      case "single": return 500;
      default: return 550;
    }
  };

  const calculateNewCreditScore = (value) => {
    const inquiries = parseInt(value) || 0;
    if (inquiries === 0) return 850;
    if (inquiries <= 2) return 750;
    if (inquiries <= 4) return 650;
    return 500;
  };

  const getScoreRating = (score) => {
    if (score < 580) return "Poor";
    if (score < 670) return "Fair";
    if (score < 740) return "Good";
    if (score < 800) return "Very Good";
    return "Excellent";
  };

  const transactions = [
    { date: "01/15/2024", description: "Utility Bill", status: "Paid" },
    { date: "01/10/2024", description: "Credit Card Payment", status: "Pending" },
    { date: "01/10/2024", description: "Loan Payment", status: "Paid" },
    { date: "01/05/2024", description: "Mortgage Payment", status: "Overdue" },
  ];

  const upcomingPayments = [
    { description: "Mortgage Payment", dueDate: "02/01/2024" },
    { description: "Loan Payment", dueDate: "02/05/2024" },
  ];

  const userStats = [
    { name: "Paid", value: 3, color: "#4caf50" },
    { name: "Pending", value: 1, color: "#ff9800" },
    { name: "Overdue", value: 1, color: "#f44336" },
  ];

  const recentActivity = [
    "Login from new device",
    "Updated profile information",
    "Checked credit report",
  ];

  return (
    <div className="dashboard-wrapper">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="BB">Bokamoso Credit Bureau</h1>
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>

        {!showCreditReport ? (
          <div className="dashboard-grid">
            <div className="credit-score-card">
              <h2>CREDIT SCORE</h2>
              <div className="score-value">
                {isCalculating ? (
                  <div className="calculating-score">
                    <div>Calculating...</div>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <>
                    <div>{creditScore}</div>
                    <div className="score-rating">{getScoreRating(creditScore)}</div>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => setShowCalculator(true)}
                disabled={isCalculating}
                className="calculate-button"
              >
                Calculate My Score
              </button>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                  >
                    {userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {showCalculator && (
              <div className="modal-overlay">
                <div className="calculator-modal compact">
                  <h2>Credit Score Calculator</h2>
                  <p>Enter your financial information</p>
                  
                  <div className="form-group">
                    <label>Payment History:</label>
                    <select 
                      name="paymentHistory" 
                      value={formData.paymentHistory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="excellent">No late payments</option>
                      <option value="good">1-2 late payments</option>
                      <option value="fair">3-5 late payments</option>
                      <option value="poor">Many late payments</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Credit Utilization (%):</label>
                    <input
                      type="number"
                      name="creditUtilization"
                      value={formData.creditUtilization}
                      onChange={handleInputChange}
                      placeholder="0-100"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Credit Age (years):</label>
                    <input
                      type="number"
                      name="creditAge"
                      value={formData.creditAge}
                      onChange={handleInputChange}
                      placeholder="Average account age"
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Credit Mix:</label>
                    <select 
                      name="creditMix" 
                      value={formData.creditMix}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="diverse">Diverse (multiple types)</option>
                      <option value="some">Some variety</option>
                      <option value="single">Only one type</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>New Credit Inquiries:</label>
                    <input
                      type="number"
                      name="newCredit"
                      value={formData.newCredit}
                      onChange={handleInputChange}
                      placeholder="Inquiries in last year"
                      min="0"
                    />
                  </div>
                  
                  <div className="modal-buttons">
                    <button 
                      onClick={calculateCreditScore}
                      disabled={isCalculating}
                      className="calculate-button"
                    >
                      {isCalculating ? "Calculating..." : "Calculate Score"}
                    </button>
                    <button 
                      onClick={() => setShowCalculator(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="transactions-card">
              <h2>Recent Transactions</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={index}>
                      <td>{t.date}</td>
                      <td>{t.description}</td>
                      <td>
                        <span className={`status ${t.status.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="upcoming-card">
              <h2>Upcoming Payments</h2>
              {upcomingPayments.map((p, index) => (
                <div className="upcoming-item" key={index}>
                  <span>{p.description}</span>
                  <span>{p.dueDate}</span>
                </div>
              ))}
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <ul>
                {recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowCreditReport(false)}
              className="back-button"
            >
              ⬅ Back to Dashboard
            </button>
            <p style={{ fontSize: "1.2rem" }}>
              Credit Report content goes here...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;