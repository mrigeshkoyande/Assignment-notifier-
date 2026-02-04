import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { FaChartPie, FaUsers, FaCheckCircle } from "react-icons/fa";
import "./Analytics.css";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Analytics() {
    const [attendanceData, setAttendanceData] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);

    useEffect(() => {
        // Demo data - in production, fetch from Firestore
        setAttendanceData({
            labels: ["Present", "Absent", "Late"],
            datasets: [
                {
                    label: "Attendance Distribution",
                    data: [75, 15, 10],
                    backgroundColor: [
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(239, 68, 68, 0.8)",
                        "rgba(251, 191, 36, 0.8)"
                    ],
                    borderColor: [
                        "rgba(16, 185, 129, 1)",
                        "rgba(239, 68, 68, 1)",
                        "rgba(251, 191, 36, 1)"
                    ],
                    borderWidth: 2
                }
            ]
        });

        setPerformanceData({
            labels: ["A Grade", "B Grade", "C Grade", "D Grade", "F Grade"],
            datasets: [
                {
                    label: "Student Performance",
                    data: [25, 35, 20, 12, 8],
                    backgroundColor: "rgba(99, 102, 241, 0.8)",
                    borderColor: "rgba(99, 102, 241, 1)",
                    borderWidth: 2
                }
            ]
        });
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#f8fafc",
                    font: {
                        size: 12
                    },
                    padding: 15
                }
            },
            title: {
                display: false
            }
        }
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#94a3b8"
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.1)"
                }
            },
            x: {
                ticks: {
                    color: "#94a3b8"
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.1)"
                }
            }
        }
    };

    const stats = [
        { icon: FaUsers, label: "Total Students", value: "120", color: "#6366f1" },
        { icon: FaCheckCircle, label: "Avg Attendance", value: "85%", color: "#10b981" },
        { icon: FaChartPie, label: "Avg Performance", value: "B+", color: "#ec4899" }
    ];

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>Class Analytics</h1>
                <p>Track student performance and attendance trends</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="stat-card glass-panel">
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                                <Icon size={32} style={{ color: stat.color }} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">{stat.label}</p>
                                <h3 className="stat-value">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="charts-grid">
                <div className="chart-card glass-panel">
                    <h2>Attendance Distribution</h2>
                    <div className="chart-wrapper">
                        {attendanceData && <Pie data={attendanceData} options={chartOptions} />}
                    </div>
                </div>

                <div className="chart-card glass-panel">
                    <h2>Grade Distribution</h2>
                    <div className="chart-wrapper">
                        {performanceData && <Bar data={performanceData} options={barOptions} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
