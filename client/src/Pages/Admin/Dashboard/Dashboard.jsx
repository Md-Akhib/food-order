import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useAppContext } from '../../../Context/AppContext';
import { CiFilter } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { MdOutlineClear } from "react-icons/md";
import toast from 'react-hot-toast';
import Loader from '../../../Components/Loader/Loader'; // Adjust path if needed

const Dashboard = () => {
  const { axios } = useAppContext();

  const [dashboard, setDashboard] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [filterType, setFilterType] = useState("yearly");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();

  const fetchDashboardData = async (showToast = false) => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashboard(data.dashboard);
        setIsFiltered(false);
      } else {
        if (showToast) toast.error(data.message);
      }
    } catch (error) {
      if (showToast) toast.error(error.message);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
  }, []);

  useEffect(() => {
    if (isFiltered) return;

    const intervalId = setInterval(() => {
      fetchDashboardData(false);
    }, 5000);

    return () => clearInterval(intervalId);

  }, [isFiltered]);

  const years = [];
  for (let y = 2026; y <= currentYear; y++) {
    years.push(y);
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleClearFilters = async () => {
    setInitialLoad(true);
    setFilterType("yearly");
    setSelectedYear("");
    setSelectedMonth("");
    setSelectedDate("");
    await fetchDashboardData();
  };

  const handleSubmit = async () => {
    try {
      if (!filterType) return toast.error("Please select a filter type");
      if (filterType === "yearly" && !selectedYear) return toast.error("Please select a year");
      if (filterType === "monthly" && (!selectedYear || !selectedMonth)) return toast.error("Please select both year and month");
      if (filterType === "daily" && !selectedDate) return toast.error("Please select a date");

      setFilterLoading(true);

      let payload = { filterType };
      if (filterType === "yearly") {
        payload.year = selectedYear;
      } else if (filterType === "monthly") {
        payload.year = selectedYear;
        payload.month = selectedMonth;
      } else if (filterType === "daily") {
        const dateObj = new Date(selectedDate);
        payload.year = dateObj.getFullYear();
        payload.month = dateObj.getMonth() + 1;
        payload.day = dateObj.getDate();
      }

      const { data } = await axios.post('/api/admin/dashboard-filter', payload);

      if (data.success) {
        setDashboard(data.dashboard);
        setIsFiltered(true);
        setShowFilter(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setFilterLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (initialLoad) return <Loader />;

  return (
    <>
      <div className="modern-dashboard">
        {/* --- Header Section --- */}
        <div className="dashboard-header">
          <div>
            <h2>Overview</h2>
            <p className="dashboard-subtitle">Track your store's performance</p>
          </div>
          <div className="header-actions">
            {isFiltered && (
              <button className="btn-clear" onClick={handleClearFilters}>
                <MdOutlineClear size={18} />
                <span>Clear Filters</span>
              </button>
            )}
            <button className="btn-filter" onClick={() => setShowFilter(true)}>
              <CiFilter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* --- Stats Grid Section --- */}
        <div className="dashboard-grid">
          {dashboard.map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <h3 className="stat-title">{item.title}</h3>
                <p className={`stat-value ${item.title === "Total Revenue" ? "text-success" : ""}`}>
                  {item.title === "Total Revenue" ? formatCurrency(item.value) : item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Filter Modal --- */}
      {showFilter && (
        <div className="modal-overlay" onClick={() => !filterLoading && setShowFilter(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {filterLoading ? (
              <div className="modal-loader">
                <div className="spinner"></div>
                <p>Fetching data...</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>Filter Dashboard</h3>
                  <button className="btn-close" onClick={() => setShowFilter(false)}>
                    <IoClose size={24} />
                  </button>
                </div>

                <div className="filter-type-group">
                  {['yearly', 'monthly', 'daily'].map((type) => (
                    <label key={type} className={`filter-radio ${filterType === type ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="filterType"
                        value={type}
                        checked={filterType === type}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                          setSelectedYear("");
                          setSelectedMonth("");
                          setSelectedDate("");
                        }}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>

                <div className="filter-inputs">
                  {(filterType === "yearly" || filterType === "monthly") && (
                    <div className="input-group">
                      <label>Select Year</label>
                      <select value={selectedYear} onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setSelectedMonth("");
                      }}>
                        <option value="" disabled>Choose Year...</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  )}

                  {filterType === "monthly" && selectedYear && (
                    <div className="input-group">
                      <label>Select Month</label>
                      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="" disabled>Choose Month...</option>
                        {months.map((m, i) => {
                          const yearInt = parseInt(selectedYear);
                          if (yearInt === currentYear && i > currentMonthIndex) return null;
                          if (yearInt === 2026 && i < 2) return null;
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>
                  )}

                  {filterType === "daily" && (
                    <div className="input-group">
                      <label>Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min="2026-03-07"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowFilter(false)}>Cancel</button>
                  <button className="btn-submit" onClick={handleSubmit}>Apply Filters</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;