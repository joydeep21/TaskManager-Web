import React, { useState, useContext, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ModalForm from '../dashboard/modal';
import { AuthContext } from 'context';
import { fetchData, update } from 'assets/globalAPI';
import Swal from 'sweetalert2';


const TaskManager = () => {
  const token = localStorage.getItem("token");
  const authContext = useContext(AuthContext);
  function getMondayAndFriday(desiredDate) {
    const date = new Date(desiredDate);
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return [monday, friday];
  }
  function getCurrentMonthDates() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      firstDate: firstDay,
      lastDate: lastDay
    };
  }
  // Example usage:
  const dates = getCurrentMonthDates();
  const desiredDate = new Date(); // Replace with your desired date
  const [monday, friday] = getMondayAndFriday(desiredDate);
  useEffect(() => {
    if (!token) {
      authContext.checkAuth();
    }
    handelfetch(dates.firstDate, dates.lastDate)

  }, []);
  const [tasks, setTasks] = useState({ pending: [], successful: [] });
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [trigger, setTrigger] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('month');

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (task) => {
    console.log('Task saved:', task);
  };
  const handelfetch = (async (s, e) => {
    const data = {
      startDate: s,
      endDate: e
    }
    try {
      const response = await fetchData(data)
      console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", response);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Task data fetched successfully",
          showConfirmButton: false,
          timer: 500,
        });
        setTasks(response.data);
      }
    }
    catch (err) {
      console.log("errrrrrrrrrrrrrrrrrrrrrrrrrr", err);
    }
    finally {
      // Toggle the trigger state to invoke useEffect
      setTrigger(prev => !prev);
    }
  })
  if (dateRange[1]) {
    handelfetch(dateRange[0].$d, dateRange[1].$d)
    console.log("the date range in useEffect", dateRange[0].$d)
  }

  useEffect(() => {
    console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", tasks);
  }, [trigger, tasks]);

  const handleCheckboxChange = (event, taskId) => {
    if (event.target.checked) {
      setCheckedTasks([...checkedTasks, taskId]);
    } else {
      setCheckedTasks(checkedTasks.filter(id => id !== taskId));
    }
  };
  const handleUpdate = async (tasks, status) => {
    // Implement complete functionality here
    const data = {
      taskIds: tasks,
      status: status
    }
    console.log("Complete tasks:", checkedTasks);

    try {
      const response = await update(data);
      console.log("responces  ", response);
      if (response.status === 200) {
        handelfetch(dates.firstDate, dates.lastDate)
      }
    }
    catch (err) {

    }
  };
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'month') {
      handelfetch(dates.firstDate, dates.lastDate);
    } else if (filter === 'weekly') {
      handelfetch(monday, friday);
    } else if (filter === 'today') {
      handelfetch(new Date(), new Date());
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>

        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="info" onClick={handleOpen}>
              Create Task
            </Button>
            <ModalForm open={open} handleClose={handleClose} handleSave={handleSave} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, alignItems: 'flex-end', float: "right" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DemoItem label="Select DateRange" component="DateRangePicker">
                    <DateRangePicker calendars={1}
                      value={dateRange}
                      onChange={handleDateRangeChange} />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              <Button
                variant="contained"
                color={selectedFilter === 'month' ? 'primary' : 'info'}
                onClick={() => handleFilterClick('month')}
              >
                Month
              </Button>
              <Button
                variant="contained"
                color={selectedFilter === 'weekly' ? 'primary' : 'info'}
                onClick={() => handleFilterClick('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant="contained"
                color={selectedFilter === 'today' ? 'primary' : 'info'}
                onClick={() => handleFilterClick('today')}
              >
                Today
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

          <Accordion sx={{ borderRadius: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Pending Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleUpdate(checkedTasks, "completed")}>Complete</Button>
                <Button variant="contained" color="error" sx={{ mr: 1 }} onClick={() => handleUpdate(checkedTasks, "removed")}>Hard Delete</Button>
                <Button variant="contained" color="error" onClick={() => handleUpdate(checkedTasks, "deleted")}>Soft Delete</Button>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#626277", display: "contents" }}>
                    <TableRow >
                      <TableCell sx={{ color: "white", fontSize: 20 }}>Task</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }}>Description</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }}>Due Date</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.pending.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No Task data available</TableCell>
                      </TableRow>
                    ) : (
                      tasks.pending.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell>
                            <FormControlLabel
                              control={<Checkbox checked={checkedTasks.includes(row._id)} onChange={(event) => handleCheckboxChange(event, row._id)} />}
                              label={row.name}
                            />
                          </TableCell>
                          <TableCell style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {row.description}
                          </TableCell>
                          <TableCell>{row.dueDate}</TableCell>
                          <TableCell>
                            <Typography color={row.status === "pending" ? "error" : "inherit"}>
                              {row.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ borderRadius: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Successful Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead sx={{ backgroundColor: "#626277", display: "contents" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontSize: 20 }}>Task</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }} >Description</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }} >Due Date</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }} >Completion Date</TableCell>
                      <TableCell sx={{ color: "white", fontSize: 20 }} >Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.successful.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No  Task data available</TableCell>
                      </TableRow>
                    ) : (
                      tasks.successful.map((task) => (
                        <TableRow key={task._id}>
                          <TableCell>{task.name}</TableCell>
                          <TableCell style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {task.description}
                          </TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>{task.completionDate}</TableCell>
                          <TableCell>
                            <Typography color={task.status === "completed" ? "green" : "inherit"}>
                              {task.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default TaskManager;

