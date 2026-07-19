import React, { useState, useEffect } from 'react';

function StudentForm({ onAddStudent, editingStudent, onSaveEdit, onCancelEdit }) {
  const [formData, setFormData] = useState({ name: '', rollNum: '', dept: '' });
  const [errors, setErrors] = useState({ name: "", rollNum: "", dept: "" });

  // Watch editingStudent properties coming down dynamically from App level
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        rollNum: editingStudent.rollNum || '',
        dept: editingStudent.dept || ''
      });
      setErrors({ name: "", rollNum: "", dept: "" });
    } else {
      setFormData({ name: '', rollNum: '', dept: '' });
    }
  }, [editingStudent]);

  const isFormInvalid = !formData.name.trim() || !formData.rollNum.trim() || !formData.dept.trim() || Object.values(errors).some(err => err);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        newErrors.name = "Enter only alphabets";
      } else {
        newErrors.name = "";
      }
    }

    if (name === "dept") {
      if (!/^[a-zA-Z\s-]*$/.test(value)) {
        newErrors.dept = "Enter only alphabets";
      } else {
        newErrors.dept = "";
      }
    }

    if (name === "rollNum") {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        newErrors.rollNum = "Special characters are not allowed";
      } else {
        newErrors.rollNum = "";
      }
    }

    setErrors(newErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    if (editingStudent) {
      onSaveEdit(editingStudent.id || editingStudent._id, formData);
    } else {
      onAddStudent(formData);
      setFormData({ name: '', rollNum: '', dept: '' });
    }
  };

  const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' };

  return (
    <form onSubmit={handleSubmit} style={{ 
      backgroundColor: editingStudent ? '#e6f7ff' : '#fff', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
      marginBottom: '30px',
      border: editingStudent ? '1px solid #91d5ff' : 'none'
    }}>
      <h3>{editingStudent ? 'Edit Student Details' : 'Register New Student'}</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Student Name</label>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={inputStyle} />
          {errors.name && <p style={{ color: "red", margin: "5px 0 0", fontSize: '12px' }}>{errors.name}</p>}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Roll Number</label>
          <input type="text" name="rollNum" placeholder="Roll Number" value={formData.rollNum} onChange={handleChange} style={inputStyle} />
          {errors.rollNum && <p style={{ color: "red", margin: "5px 0 0", fontSize: '12px' }}>{errors.rollNum}</p>}
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '12px', color: '#666' }}>Department Branch</label>
          <input type="text" name="dept" placeholder="Department" value={formData.dept} onChange={handleChange} style={inputStyle} />
          {errors.dept && <p style={{ color: "red", margin: "5px 0 0", fontSize: '12px' }}>{errors.dept}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          type="submit" 
          disabled={isFormInvalid}
          style={{
            padding: '10px 20px',
            backgroundColor: isFormInvalid ? '#cccccc' : (editingStudent ? '#52c41a' : '#007bff'),
            color: '#fff', border: 'none', borderRadius: '4px',
            cursor: isFormInvalid ? 'not-allowed' : 'pointer', flex: 2
          }}
        >
          {editingStudent ? 'Update Details' : 'Add Student'}
        </button>
        {editingStudent && (
          <button 
            type="button"
            onClick={onCancelEdit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              color: '#333', border: '1px solid #d9d9d9', borderRadius: '4px',
              cursor: 'pointer', flex: 1
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentForm;