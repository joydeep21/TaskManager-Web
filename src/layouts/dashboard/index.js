/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import React, { useState ,useContext,useEffect} from 'react';
import { Tooltip, Typography, Box } from '@mui/material';
import ReactCalendar from 'react-calendar';
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css'; 
import { AuthContext } from 'context';
import { dashboardData } from 'assets/globalAPI';

function Dashboard() {
  const token = localStorage.getItem("token");
  const authContext = useContext(AuthContext);
  const { sales, tasks } = reportsLineChartData;
  const [value, setValue] = useState(new Date());
  const [sampleTasks,setSampleTasks]=useState([]);
  const [count,setCount]=useState({
    "totalCount": 0,
    "pendingTasks": 0,
    "completedTasks": 0
})
const handleFetchData = async () => {
  try {
    const response = await dashboardData();
    console.log("response", response);
    if (response.status === 200) {
      setSampleTasks(response.data.tasksData);
      setCount(response.data.counts); // Note: Ensure setCount is correctly spelled
    }
  } catch (err) {
    console.log("err", err);
  }
};

useEffect(() => {
  const fetchData = async () => {
    if (!token) {
      await authContext.checkAuth(); // Make sure checkAuth is an async function
    }
    await handleFetchData();
  };

  fetchData();
}, [token]);
 
  
  const handleDateChange = date => {
    setValue(date);
  };
  const isCurrentMonth = date => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const normalizeDate = (date) => date.toISOString().split('T')[0];

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const normalizedDate = normalizeDate(date);
      const tasksForDate = sampleTasks.filter(task => normalizeDate(new Date(task.dueDate)) === normalizedDate);
      if (tasksForDate.length > 0) {
        return 'highlight';
      }
    }
    return '';
  };
  
  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const normalizedDate = normalizeDate(date);
      const tasksForDate = sampleTasks.filter(task => normalizeDate(new Date(task.dueDate)) === normalizedDate);
      if (tasksForDate.length > 0) {
        return (
          <Tooltip title={`Tasks: ${tasksForDate.length}`} arrow>
            <span className="calendar-tile-content">{tasksForDate.length}</span>
          </Tooltip>
        );
      }
    }
    return null;
  };
  return (
    <DashboardLayout>
    <DashboardNavbar />
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MDBox mb={1.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Total Tasks"
                  count={count.totalCount}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Completed Tasks"
                  count={count.completedTasks}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Pending Tasks"
                  count={count.pendingTasks}
                />
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <MDBox mb={1.5}>
            <Typography variant="h6" gutterBottom>Tasks Calendar</Typography>
            <ReactCalendar
              onChange={handleDateChange}
              value={value}
              tileClassName={getTileClassName}
              tileContent={getTileContent}
              className="custom-calendar" // Apply custom styling
              style={{
                backgroundColor: '#f5f5f5', // Replace with your desired background color
                borderRadius: '8px',
                padding: '10px',
              }}
           />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  </DashboardLayout>
  );
}

export default Dashboard;
