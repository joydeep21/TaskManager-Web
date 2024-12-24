// ModalForm.js
import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { addTask } from "../../../assets/globalAPI"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ModalForm = ({ open, handleClose, handleSave }) => {
  const [task, setTask] = useState({
    name: '',
    description: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addTask(task);
      if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Task Added succesfully",
        showConfirmButton: false,
        timer: 500,
      });
      handleSave(task);
      setTask({
        name: '',
        description: '',
        dueDate: ''
      })
    handleClose();
      }
    }
    catch (err) {
      console.log("task",err);

    }
    
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Task
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={onSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Task Name"
            name="name"
            value={task.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline  // Make the description field multiline
            rows={4}    // Adjust the number of rows as needed
            value={task.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dueDate"
            label="Due Date"
            name="dueDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={task.dueDate}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save Task
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalForm;
