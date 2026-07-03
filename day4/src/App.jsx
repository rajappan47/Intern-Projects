import React, { useState, useMemo } from 'react';
// Material UI Components & Icons
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select as MuiSelect,
  Button as MuiButton,
  Stack
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

// Ant Design Components
import { Table, Form, Input, InputNumber, Select as AntdSelect, Button as AntdButton, notification } from 'antd';

const DEPARTMENTS = [
  "Computer Science",
  "Data Science",
  "Electrical Engineering"
];

export default function App() {
  
  const [students, setStudents] = useState([
    { key: '1', id: '1', name: 'John Doe', age: 20, department: 'Computer Science' },
    { key: '2', id: '2', name: 'Jane Smith', age: 22, department: 'Data Science' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [editingId, setEditingId] = useState(null);

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const notify = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  };


  const totalStudents = students.length;
  const averageAge = useMemo(() => {
    if (totalStudents === 0) return 0;
    const totalAge = students.reduce((sum, s) => sum + Number(s.age), 0);
    return (totalAge / totalStudents).toFixed(1);
  }, [students, totalStudents]);


  const onFormSubmit = (values) => {
    if (editingId) {
      setStudents(prev => prev.map(student => 
        student.id === editingId ? { ...student, ...values } : student
      ));
      notify('success', 'Modification Saved', `${values.name}'s details were updated.`);
      setEditingId(null);
    } else {
      const newStudent = {
        key: Date.now().toString(),
        id: Date.now().toString(),
        ...values
      };
      setStudents(prev => [...prev, newStudent]);
      notify('success', 'Student Enrolled', `${values.name} was successfully registered.`);
    }
    form.resetFields();
  };

  
  const handleEdit = (student) => {
    setEditingId(student.id);
    form.setFieldsValue({
      name: student.name,
      age: student.age,
      department: student.department
    });
    notify('info', 'Form Mode: Edit', `Modifying data for ${student.name}.`);
  };

  
  const handleDelete = (id, name) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    notify('error', 'Record Removed', `${name} has been deleted.`);
    if (editingId === id) {
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.resetFields();
  };

 
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDept === 'All' || student.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [students, searchQuery, filterDept]);

  
  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <MuiButton 
            variant="outlined" 
            color="success" 
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </MuiButton>
          <MuiButton 
            variant="outlined" 
            color="error" 
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(record.id, record.name)}
          >
            Delete
          </MuiButton>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{width:"98%",mt: 5, mb: 5 }}>
      {contextHolder}
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#111', mb: 4 }}>
        Student Management System
      </Typography>

      <Grid container spacing={6} >
        {/* Metric Overview (MUI Layout Cards) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                Dashboard Metrics
              </Typography>
              <Box sx={{ mt: 6 }}>
                <Typography variant="subtitle1" color="text.primary">
                  Total Students: <Box component="span" sx={{ fontWeight: 'bold', ml: 1 }}>{totalStudents}</Box>
                </Typography>
                <Typography variant="subtitle1" color="text.primary" sx={{ mt: 1.5 }}>
                  Average Age: <Box component="span" sx={{ fontWeight: 'bold', ml: 1 }}>{averageAge}</Box>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Input System (Ant Design Validate Engine) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                {editingId ? "Edit Student Record" : "Add New Student"}
              </Typography>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onFormSubmit}
                style={{ marginTop: '20px' }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                        required: true,
                        message: "Please enter the student's name",
                         },
                        {
                        min: 3,
                        message: "Name must be at least 3 characters long",
                        },
                        {
                         pattern: /^[A-Za-z\s]+$/,
                          message: "Only alphabets and spaces are allowed",
                        },
                      
                      ]}
                    >
                      <Input placeholder="John Doe" size="large" />
                    </Form.Item>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Form.Item
                      label="Age"
                      name="age"
                      rules={[
                        { required: true, message: 'Required' },
                        { type: 'number', min: 16, max: 100, message: 'Range 16-100' },
                        {
                          pattern:/^[0-9]+$/,
                          message:"number only allowed"
                        },
                      ]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder="20" size="large" />
                    </Form.Item>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[{ required: true, message: 'Select department' }]}
                    >
                      <AntdSelect placeholder="Choose Department" size="large">
                        {DEPARTMENTS.map(dept => (
                          <AntdSelect.Option key={dept} value={dept}>{dept}</AntdSelect.Option>
                        ))}
                      </AntdSelect>
                    </Form.Item>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <AntdButton 
                    type="primary" 
                    htmlType="submit" 
                    icon={!editingId && <PersonAddIcon style={{ fontSize: '16px', marginRight: '4px' }} />}
                    style={{ 
                      backgroundColor: editingId ? '#28a745' : '#1677ff',
                      height: '40px',
                      borderRadius: '4px'
                    }}
                  >
                    {editingId ? "Save Changes" : "Register Student"}
                  </AntdButton>
                  
                  {editingId && (
                    <AntdButton style={{ height: '40px' }} onClick={handleCancelEdit}>
                      Cancel Edit
                    </AntdButton>
                  )}
                </Stack>
              </Form>
            </CardContent>
          </Card>
        </Grid>

        {/* Roster Layout Filter & Table Overview */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
              Student Database Roster
            </Typography>

            {/* Filter controls row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField 
                label="Search student by name..." 
                variant="outlined" 
                size="small" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 300 }}
              />

              <FormControl size="small" sx={{ width: 220 }}>
                <InputLabel id="dept-filter-label">Filter Department</InputLabel>
                <MuiSelect
                  labelId="dept-filter-label"
                  value={filterDept}
                  label="Filter Department"
                  onChange={(e) => setFilterDept(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {DEPARTMENTS.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </Box>

            {/* Dynamic Data Table */}
            <Table 
              columns={columns} 
              dataSource={filteredStudents} 
              pagination={{ pageSize: 2 }} 
              locale={{ emptyText: 'No matching records found' }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}