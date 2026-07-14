import React, { useState } from 'react';

function StudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState({ name: '', rollNum: '', dept: '' });

  const [errors, setErrors] = useState({
  name: "",
  rollNum: "",
  dept: ""
});

  // Disables button if any field is empty or just whitespace
  const isFormInvalid = !formData.name.trim() || !formData.rollNum.trim() || !formData.dept.trim();

 const handleChange = (e) => {
  const { name, value } = e.target;

  let newErrors = { ...errors };

  // Name Validation
  if (name === "name") {
    const letterRegex = /^[a-zA-Z\s]*$/;

    if (!letterRegex.test(value)) {
      newErrors.name = "Enter only alphabets";
      setErrors(newErrors);
      return;
    } else {
      newErrors.name = "";
    }
  }

  // Department Validation
  if (name === "dept") {
    const letterRegex = /^[a-zA-Z\s-]*$/;

    if (!letterRegex.test(value)) {
      newErrors.dept = "Enter only alphabets";
      setErrors(newErrors);
      return;
    } else {
      newErrors.dept = "";
    }
  }

  // Roll Number Validation
  if (name === "rollNum") {
    const rollRegex = /^[a-zA-Z0-9]*$/;

    if (!rollRegex.test(value)) {
      newErrors.rollNum = "Special characters are not allowed";
      setErrors(newErrors);
      return;
    } else {
      newErrors.rollNum = "";
    }
  }

  setErrors(newErrors);

  setFormData({
    ...formData,
    [name]: value
  });
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
        <div style={{ flex: 1 }}>
  <input
    type="text"
    name="name"
    placeholder="Name"
    value={formData.name}
    onChange={handleChange}
    style={inputStyle}
  />

  {errors.name && (
    <p style={{ color: "red", margin: "5px 0 0" }}>
      {errors.name}
    </p>
  )}
</div>
<div style={{ flex: 1 }}>
  <input
    type="text"
    name="rollNum"
    placeholder="Roll Number"
    value={formData.rollNum}
    onChange={handleChange}
    style={inputStyle}
  />

  {errors.rollNum && (
    <p style={{ color: "red", margin: "5px 0 0" }}>
      {errors.rollNum}
    </p>
  )}
</div>
<div style={{ flex: 1 }}>
  <input
    type="text"
    name="dept"
    placeholder="Department"
    value={formData.dept}
    onChange={handleChange}
    style={inputStyle}
  />

  {errors.dept && (
    <p style={{ color: "red", margin: "5px 0 0" }}>
      {errors.dept}
    </p>
  )}
</div>
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