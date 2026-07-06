import React, { useState } from 'react';

function StudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState({ name: '', rollNum: '', dept: '' });

  // Disables button if any field is empty or just whitespace
  const isFormInvalid = !formData.name.trim() || !formData.rollNum.trim() || !formData.dept.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // --- NEW: Block numbers and special characters for the 'name' field ---
    if (name === 'name') {
      // This regex allows ONLY uppercase letters, lowercase letters, and spaces
      const letterRegex = /^[a-zA-Z\s]*$/;
      
      // If the typed value doesn't match the regex, stop and do not update state
      if (!letterRegex.test(value)) {
        return; 
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    onAddStudent(formData);
    setFormData({ name: '', rollNum: '', dept: '' }); // Clear inputs
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: 1
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
      <h3>Add New Student</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <input 
          type="text" name="name" placeholder="Name (Letters Only)" 
          value={formData.name} onChange={handleChange} style={inputStyle} 
        />
        <input 
          type="text" name="rollNum" placeholder="Roll Number" 
          value={formData.rollNum} onChange={handleChange} style={inputStyle} 
        />
        <input 
          type="text" name="dept" placeholder="Department" 
          value={formData.dept} onChange={handleChange} style={inputStyle} 
        />
      </div>
      <button 
        type="submit" 
        disabled={isFormInvalid}
        style={{
          padding: '10px 20px',
          backgroundColor: isFormInvalid ? '#cccccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isFormInvalid ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        Add Student
      </button>
    </form>
  );
}

export default StudentForm;