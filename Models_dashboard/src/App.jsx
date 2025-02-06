import React, { useState, useEffect } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement);


const Dashboard = () => {
  
  const epochLabels = Array.from({ length: 100 }, (_, i) => i + 1);
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [data, setData] = useState({});
  const [categories, setCategories] = useState([]);
  const [GPUCounts, setGPUCounts] = useState({});
  const [activePage, setActivePage] = useState("page1");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("anytime");
  const [selectedCharts, setSelectedCharts] = useState({
    TrainingAccuracy: true,
    TrainingLoss: true,
    FinalAccuracy: true,
    FinalLoss: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredModels = models.filter(model => {
    const modelDate = new Date(model.training_date);
    const today = new Date();
  
    let dateCondition = true;
  
    if (selectedDateFilter === "today") {
      dateCondition = modelDate.toDateString() === today.toDateString();
    } else if (selectedDateFilter === "last_week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      dateCondition = modelDate >= oneWeekAgo && modelDate <= today;
    } else if (selectedDateFilter === "last_month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(today.getDate() - 30);
      dateCondition = modelDate >= oneMonthAgo && modelDate <= today;
    }
  
    return (
      (selectedCategory === "All" || model.category === selectedCategory) &&
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      dateCondition
    );
  });
  
  
  const getCategoryStats = (models) => {
    // Group models by category
    const categories = [...new Set(models.map(model => model.category))];
    const categoryStats = categories.map(category => {
      const modelsInCategory = models.filter(model => model.category === category);
      
      const avgAccuracy = modelsInCategory.reduce((sum, model) => sum + (model.accuracy?.slice(-1)[0] || 0), 0) / modelsInCategory.length;
      const avgLoss = modelsInCategory.reduce((sum, model) => sum + (model.loss?.slice(-1)[0] || 0), 0) / modelsInCategory.length;
  
      return { category, avgAccuracy, avgLoss };
    });
  
    return categoryStats;
  };
  const getCategoryCounts = (models) => {
    const categoryCounts = models.reduce((acc, model) => {
      const category = model.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return categoryCounts;
  };

  const getGPUCounts = (models) => {
    const GPUCounts = models.reduce((acc, model) => {
      const gpu = model.gpu_used || 'Uncategorized';
      acc[gpu] = (acc[gpu] || 0) + 1;
      return acc;
    }, {});
    return GPUCounts;
  };
  
  const getAggregatedStats = (models) => {
    // Aggregated stats for all categories together
    const avgAccuracy = models.reduce((sum, model) => sum + (model.accuracy?.slice(-1)[0] || 0), 0) / models.length;
    const avgLoss = models.reduce((sum, model) => sum + (model.loss?.slice(-1)[0] || 0), 0) / models.length;
  
    return { avgAccuracy, avgLoss };
  };
  
  

  useEffect(() => {
    axios.get("http://localhost:8000/models").then((response) => {
      setModels(response.data);
      setGPUCounts(getGPUCounts(response.data));
      const uniqueCategories = ["All", ...new Set(response.data.map(model => model.category))];
      setCategories(uniqueCategories);
    }).catch(error => console.error("Error fetching models:", error));
  }, []);

  useEffect(() => {
    if (selectedModels.length > 0) {
      axios.post("http://localhost:8000/compare", { models: selectedModels })
        .then((response) => {
          setData(response.data);
        })
        .catch(error => console.error("Error fetching model comparison:", error));
    }
  }, [selectedModels]);

  const handleCheckboxChange = (modelName) => {
    setSelectedModels((prev) =>
      prev.includes(modelName)
        ? prev.filter((m) => m !== modelName)
        : [...prev, modelName]
    );
  };


  return (
    <div style={{ display: "flex", justifyContent: "flex-start", width: "100vw" }}>
      {/* Left Sidebar */}
      <div style={{
        width: "70px",
        background: "#1E293B",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "15px 0",
        height: "165vh",
        boxShadow: "3px 0 10px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease-in-out"
      }}>

        {/* Company Icon */}
        <div 
          style={{
            marginBottom: "30px", 
            cursor: "pointer", 
            fontSize: "24px", 
            transition: "transform 0.3s ease"
          }} 
          onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"} 
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          title="Company"
        >
          🏢
        </div>

        {/* Navigation Icons */}
        {[
          { page: "page1", icon: "📊", label: "Dashboard" },
          { page: "page2", icon: "📈", label: "Analytics" }
        ].map(({ page, icon, label }) => (
          <div 
            key={page}
            onClick={() => setActivePage(page)}
            style={{
              marginBottom: "25px",
              cursor: "pointer",
              fontSize: "22px",
              padding: "10px",
              borderRadius: "8px",
              background: activePage === page ? "rgba(255, 255, 255, 0.2)" : "transparent",
              transition: "all 0.3s ease",
              boxShadow: activePage === page ? "0 0 10px rgba(255, 255, 255, 0.3)" : "none"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            title={label}
          >
            {icon}
          </div>
        ))}
        
      </div>

      
      {/* page1 */}
      {activePage === "page1" && (
  <div style={{ padding: "24px", background: "white", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100vh', width: "1100px" }}>

    {/* Left Section: Number of Models */}
<div style={{ 
  width: '30%', height: '65%', marginLeft: '20px', padding: '20px',
  borderRadius: '12px',   background: 'linear-gradient(135deg, #f9f9f9, #e8e8e8)', 
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',  textAlign: 'center', position: 'relative' 
}}>
  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#333", marginBottom: "10px" }}>
    {selectedCategory === 'All' ? "Total Models" : `Models in "${selectedCategory}"`}
  </h3>
  
  {/* Number of Models */}
  <div style={{ 
    fontSize: "32px", fontWeight: "800", color: "#8e44ad",
    textShadow: "0px 3px 6px rgba(0,0,0,0.2)"
  }}>
    {filteredModels.length}
  </div>

  {/* Pie Chart */}
  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ width: '280px', height: '280px', borderRadius: '12px', padding: '10px', background: '#fff' }}>
      <Pie
        data={{
          labels: Object.keys(getCategoryCounts(filteredModels)),
          datasets: [{
            data: Object.values(getCategoryCounts(filteredModels)),
            backgroundColor: [
              'rgba(155, 89, 182, 0.8)', 'rgba(52, 152, 219, 0.8)', 'rgba(243, 156, 18, 0.8)', 
              'rgba(46, 204, 113, 0.8)', 'rgba(231, 76, 60, 0.8)', 'rgba(149, 165, 166, 0.8)', 
              'rgba(26, 188, 156, 0.8)', 'rgba(52, 73, 94, 0.8)'
            ],
            hoverBackgroundColor: [
              'rgba(155, 89, 182, 1)', 'rgba(52, 152, 219, 1)', 'rgba(243, 156, 18, 1)', 
              'rgba(46, 204, 113, 1)', 'rgba(231, 76, 60, 1)', 'rgba(149, 165, 166, 1)', 
              'rgba(26, 188, 156, 1)', 'rgba(52, 73, 94, 1)'
            ],
            borderWidth: 2,
          }],
        }}
        options={{
          responsive: true,
          plugins: {
            title: { 
              display: true, 
              text: 'Models per Project', 
              font: { size: 16, weight: "bold" }, 
              color: "#333" 
            },
            tooltip: { 
              callbacks: { 
                label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} models` 
              } 
            },
            legend: {
              position: 'bottom',
              labels: { font: { size: 14, weight: "500" }, color: "#555" }
            }
          },
        }}
      />
    </div>
  </div>
</div>

    

    {/* Middle sections Parent */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '35%',
      height: 'auto',
      gap: '20px',

    }}>

      {/* Middle top section: Average Accuracy and Loss */}
      <div style={{
        height: '40%', 
        marginLeft: '20px', 
        padding: '20px', 
        borderRadius: '12px', 
        background: 'linear-gradient(135deg, #f9f9f9, #e8e8e8)', 
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', 
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#444", marginBottom: "16px" }}>
          📊 Average Accuracy & Loss
        </h2>

        {selectedCategory === 'All' ? (
          <div>
            <span style={{ fontSize: "22px", fontWeight: "600", color: "#333", display: 'block', marginBottom: '10px' }}>
              🌍 All Projects
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              {/* Accuracy */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #56CCF2, #2F80ED)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s'
                }}>
                  <span style={{ fontSize: '22px', color: 'white', fontWeight: '700' }}>
                    {getAggregatedStats(filteredModels).avgAccuracy.toFixed(2)}%
                  </span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginTop: '8px' }}>🎯 Accuracy</p>
              </div>

              {/* Loss */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #FF6B6B, #D72638)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s'
                }}>
                  <span style={{ fontSize: '22px', color: 'white', fontWeight: '700' }}>
                    {getAggregatedStats(filteredModels).avgLoss.toFixed(2)}
                  </span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginTop: '8px' }}>⚠️ Loss</p>
              </div>
            </div>
          </div>
        ) : (
          getCategoryStats(filteredModels).map((categoryStat) => (
            <div key={categoryStat.category} style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#444", textAlign: "center" }}>
                {categoryStat.category}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {/* Category Accuracy */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #66D9E8, #1797B5)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    <span style={{ fontSize: '22px', color: 'white', fontWeight: '700' }}>
                      {categoryStat.avgAccuracy.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginTop: '8px' }}>🎯 Accuracy</p>
                </div>

                {/* Category Loss */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #FF8C6B, #D72638)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    <span style={{ fontSize: '22px', color: 'white', fontWeight: '700' }}>
                      {categoryStat.avgLoss.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginTop: '8px' }}>⚠️ Loss</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


{/* middle bottom section: GPUs usage Donut Chart */}
<div style={{
  height: '45%',
  marginLeft: '20px',
  padding: '20px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #f9f9f9, #e8e8e8)', 
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', 
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}}>
  {/* middle section bottom: GPUs usage */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',   
  }}>
    

    

    {/* Doughnut Chart */}
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: '265px', 
    }}>
      
      <Doughnut
        data={{
          labels: Object.keys(getGPUCounts(filteredModels)),
              datasets: [{
                data: Object.values(getGPUCounts(filteredModels)),
            backgroundColor: [
              '#9b59b6', '#3498db', '#f39c12', '#2ecc71', '#e74c3c',
              '#95a5a6', '#1abc9c', '#34495e', '#8e44ad', '#f1c40f',
            ],
            borderWidth: 1,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          plugins: {
            title: { display: true, text: 'GPUs usage', font: { size: 18 } },
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} times` } },
            legend: { 
              display: true,
              labels:{
                usePointStyle: true,
                pointStyle: "circle",
                font: {
                  size: '12px',
                }
              }
            },
          },
        }}
      />
    </div>
  </div>

  
</div>

    
  </div>

    {/* right sections Parent */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '35%',
      height: 'auto',
      gap: '20px',

    }}>

    {/* top Right section: Top 3 Models by Accuracy */}
<div style={{ 
  height: '40%', 
  marginLeft: '20px', 
  padding: '20px', 
  borderRadius: '12px', 
  background: 'linear-gradient(135deg, #f9f9f9, #e8e8e8)', 
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',  
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  textAlign: 'center'
}}>
  <h2 style={{ 
    fontSize: "24px", 
    fontWeight: "700", 
    color: "#333", 
    marginBottom: "20px" 
  }}>
    🏆 Top 3 Models by Accuracy
  </h2>

  {/* Top 3 Models */}
  {filteredModels
    .sort((a, b) => (b.accuracy?.slice(-1)[0] || 0) - (a.accuracy?.slice(-1)[0] || 0))
    .slice(0, 3)
    .map((model, index) => {
      const accuracy = model.accuracy?.slice(-1)[0] || 0;
      const rankColors = [
        { bg: "linear-gradient(135deg, #FFD700, #FFC107)", icon: "🥇", glow: "0px 0px 12px rgba(255, 215, 0, 0.8)" }, // Gold
        { bg: "linear-gradient(135deg, #C0C0C0, #A0A0A0)", icon: "🥈", glow: "none" }, // Silver
        { bg: "linear-gradient(135deg, #CD7F32, #B87333)", icon: "🥉", glow: "none" }  // Bronze
      ];
      
      return (
        <div
          key={model.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '10px 0',
            padding: '15px 20px',
            borderRadius: '10px',
            background: rankColors[index].bg,
            color: 'white',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: rankColors[index].glow,
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: "12px", marginRight: "12px" }}>{rankColors[index].icon}</span>
          <span style={{ flex: 1, textAlign: "left" }}>{model.name}</span>
          <span>{accuracy.toFixed(2)}%</span>
        </div>
      );
    })}
</div>

    {/* bottom right section: Training Time Chart */}
    <div style={{ height: '40%', marginLeft: '20px', padding: '20px', borderRadius: '8px',   background: 'linear-gradient(135deg, #f9f9f9, #e8e8e8)', 
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',  textAlign: 'center' }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#555", marginBottom: "20px" }}>
        Training Time
      </h2>
      {/* Total and Average Training Time */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#f9f9f9", 
        padding: "20px", 
        borderRadius: "12px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
        textAlign: "center" 
      }}>
        
        {/* Total Training Time */}
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "600", 
          color: "#555", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          marginBottom: "12px" 
        }}>
          <span style={{ fontSize: "24px", color: "#9b59b6" }}>⏳</span>
          <span>Total Training Time:</span>
          <span style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            color: "#9b59b6" 
          }}>
            {filteredModels.reduce((total, model) => total + model.training_time, 0).toFixed(2)} hours
          </span>
        </div>

        {/* Average Training Time */}
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "600", 
          color: "#555", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px" 
        }}>
          <span style={{ fontSize: "24px", color: "#3498db" }}>📊</span>
          <span>Average Training Time:</span>
          <span style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            color: "#3498db" 
          }}>
            {(filteredModels.reduce((total, model) => total + model.training_time, 0) / filteredModels.length).toFixed(2)} hours
          </span>
        </div>

      </div>

      
    </div>


    </div>
  </div>
)}






        {/* page2 */}
        {activePage === "page2" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-start", width: "80vw" }}></div>
            <div style={{ flex: 1, padding: "24px", background: "white", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px", textAlign: "center", color: "#333" }}>
          Model Comparison Dashboard
        </h1>

        {/* KPI Checkboxes */}
        <div style={{ marginBottom: "24px", textAlign: "center", display: "flex", justifyContent: "center", gap: "16px" }}>
          {Object.keys(selectedCharts).map((chart) => (
            <div key={chart} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => setSelectedCharts(prev => ({ ...prev, [chart]: !prev[chart] }))}>
              <input
                type="checkbox"
                checked={selectedCharts[chart]}
                onChange={() => {}}
                style={{ cursor: "pointer" }}
              />
              
              <span
              style={{
                fontSize: "16px", 
                fontWeight: "520", 
                color: "#555", 
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => e.target.style.color = "#3498db"}
              onMouseLeave={(e) => e.target.style.color = "#555"}
              >{chart.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>

        {Object.keys(data).length > 0 && selectedModels.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "16px", textAlign: "center", color: "#555" }}>
              Comparison Charts
            </h2>
            <div style={{ display: "flex", gap: "16px" }}>
              {selectedCharts.TrainingAccuracy && (
                <div style={{ flex: 1, height: "400px", width: "540px" }}>
                  <Line data={{
                    labels: epochLabels,
                    datasets: selectedModels.map((model, index) => ({
                      label: `${model}`,
                      data: data[model]?.accuracy || [],
                      borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
                      pointRadius: 0,
                    }))
                  }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } },
                      plugins: { 
                        title: { display: true, text: 'Training Accuracy', font: { size: 15 } },
                        legend: { labels: { usePointStyle: true, pointStyle: 'circle' } } }
                    }}
                  />
                </div>
              )}
              {selectedCharts.TrainingLoss && (
                <div style={{ flex: 1, height: "400px", width: "540px" }}>
                  <Line data={{
                    labels: epochLabels,
                    datasets: selectedModels.map((model, index) => ({
                      label: `${model}`,
                      data: data[model]?.loss || [],
                      borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
                      pointRadius: 0,
                    }))
                  }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true } },
                      plugins: { 
                        title: { display: true, text: 'Training Loss', font: { size: 15 } },
                        legend: { labels: { usePointStyle: true, pointStyle: 'circle' } } }
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "60px" }}>
              {selectedCharts.FinalAccuracy && (
                <div style={{ flex: 1, height: "400px", width: "540px" }}>
                  <Bar data={{
                    labels: selectedModels,
                    datasets: [{
                      label: "Final Accuracy",
                      data: selectedModels.map(model => data[model]?.accuracy?.slice(-1)[0] || 0),
                      backgroundColor: "lightgreen"
                    }]
                  }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle' } } }
                    }}
                  />
                </div>
              )}
              {selectedCharts.FinalLoss && (
                <div style={{ flex: 1, height: "400px", width: "540px" }}>
                  <Bar data={{
                    labels: selectedModels,
                    datasets: [{
                      label: "Final Loss",
                      data: selectedModels.map(model => data[model]?.loss?.slice(-1)[0] || 0),
                      backgroundColor: "lightblue"
                    }]
                  }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { labels: { usePointStyle: true, pointStyle: 'circle' } } }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
        
          </div>
        )}

      
      

      {/* Sidebar filter */}
      <div style={{ width: "190px", padding: "16px", background: "#f8f8f8", minHeight: "100vh", marginLeft: "auto", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h3>Select Project</h3>
        <select
          style={{ width: "90%", padding: "8px", marginBottom: "16px", borderRadius: "6px", background: "#fff" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <h3>Select Creation Date</h3>
  <select
    style={{ width: "90%", padding: "8px", marginBottom: "16px", borderRadius: "6px", background: "#fff" }}
    value={selectedDateFilter}
    onChange={(e) => setSelectedDateFilter(e.target.value)}
  >
    <option value="anytime">All</option>
    <option value="today">last 24 hours</option>
    <option value="last_week">Last 7 days</option>
    <option value="last_month">Last 30 days</option>
  </select>

        

        {/*render model selection only when activePage is not 1 */}
        {activePage !== "page1" && (
          <div style={{ marginBottom: "16px" }}>
            <h3>Select Models</h3>
            {/* Search Bar for Models */}
            <div style={{ position: "relative", width: "75%", marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 30px 8px 8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#fff"
                }}
              />
              {searchTerm && (
                <span
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#666"
                  }}
                >
                  ✖
                </span>
              )}
            </div>

            {/* Select All Checkbox */}
            <div style={{ padding: "12px", borderRadius: "6px", width: "80%", background: "lightgrey", marginBottom: "8px", fontWeight: "bold" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedModels.length > 0 && filteredModels.length === selectedModels.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedModels(filteredModels.map(m => m.name));
                    } else {
                      setSelectedModels([]);
                    }
                  }}
                  style={{ marginRight: "8px" }}
                />
                <span>Select All</span>
              </label>
            </div>

            {/* Filtered Model List */}
            {filteredModels.map((model) => (
              <div key={model.name} style={{ padding: "12px", borderRadius: "6px", background: "#f9f9f9", marginBottom: "8px" }}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.name)}
                    onChange={() => handleCheckboxChange(model.name)}
                    style={{ marginRight: "8px" }}
                  />
                  <span>{model.name}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
