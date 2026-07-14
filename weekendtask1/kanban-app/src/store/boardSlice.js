import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/boards';

// 1. Fetch all boards from the local json-server backend
export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// 2. Add a new task to a specific board and column
export const addTask = createAsyncThunk('boards/addTask', async ({ boardId, columnId, task }, { getState }) => {
  const state = getState().boards;
  const board = state.list.find(b => b.id === boardId);
  
  const updatedBoard = JSON.parse(JSON.stringify(board));
  const column = updatedBoard.columns.find(c => c.id === columnId);
  column.tasks.push(task);

  await axios.put(`${API_URL}/${boardId}`, updatedBoard);
  return { boardId, updatedBoard };
});
 
// 3. Move a task from one column status to another
export const updateTaskStatus = createAsyncThunk('boards/updateTaskStatus', async ({ boardId, sourceColId, destColId, taskId }, { getState }) => {
  const state = getState().boards;
  const board = state.list.find(b => b.id === boardId);
  const updatedBoard = JSON.parse(JSON.stringify(board));

  let movingTask;
  const sourceCol = updatedBoard.columns.find(c => c.id === sourceColId);
  sourceCol.tasks = sourceCol.tasks.filter(t => {
    if (t.id === taskId) {
      movingTask = t;
      return false;
    }
    return true;
  });

  if (movingTask) {
    movingTask.status = destColId;
    const destCol = updatedBoard.columns.find(c => c.id === destColId);
    destCol.tasks.push(movingTask);
  }

  await axios.put(`${API_URL}/${boardId}`, updatedBoard);
  return { boardId, updatedBoard };
});

// 4. Toggle the isCompleted checkmark status of a single subtask
export const toggleSubtask = createAsyncThunk(
  'boards/toggleSubtask',
  async ({ boardId, columnId, taskId, subtaskTitle }, { getState }) => {
    const state = getState().boards;
    const board = state.list.find(b => b.id === boardId);
    
    const updatedBoard = JSON.parse(JSON.stringify(board));
    const column = updatedBoard.columns.find(c => c.id === columnId);
    const task = column.tasks.find(t => t.id === taskId);
    const subtask = task.subtasks.find(s => s.title === subtaskTitle);
    
    if (subtask) {
      subtask.isCompleted = !subtask.isCompleted;
    }

    await axios.put(`${API_URL}/${boardId}`, updatedBoard);
    return { boardId, updatedBoard };
  }
);

const boardSlice = createSlice({
  name: 'boards',
  initialState: { 
    list: [], 
    activeBoardId: null, 
    loading: false 
  },
  reducers: {
    setActiveBoard: (state, action) => {
      state.activeBoardId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initial Load Handling
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        if (action.payload.length && !state.activeBoardId) {
          state.activeBoardId = action.payload[0].id;
        }
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.loading = false;
      })
      // Task Form Submissions Handling
      .addCase(addTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(b => b.id === action.payload.boardId);
        if (index !== -1) {
          state.list[index] = action.payload.updatedBoard;
        }
      })
      // Status Changes via Select Fields Handling
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(b => b.id === action.payload.boardId);
        if (index !== -1) {
          state.list[index] = action.payload.updatedBoard;
        }
      })
      // Interactive Checkbox Clicks Handling
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        const index = state.list.findIndex(b => b.id === action.payload.boardId);
        if (index !== -1) {
          state.list[index] = action.payload.updatedBoard;
        }
      });
  }
});

export const { setActiveBoard } = boardSlice.actions;
export default boardSlice.reducer;