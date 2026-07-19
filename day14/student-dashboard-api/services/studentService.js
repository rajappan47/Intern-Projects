const Student = require('../models/Student');

exports.fetchAllStudents = async () => {
  return await Student.find();
};

exports.createNewStudent = async (studentData) => {
  const newStudent = new Student(studentData);
  return await newStudent.save();
};

exports.toggleActiveStatus = async (id) => {
  const student = await Student.findById(id);
  if (!student) throw new Error('Student not found');
  
  student.isActive = !student.isActive;
  return await student.save();
};

exports.removeStudent = async (id) => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) throw new Error('Student not found');
  return { message: 'Student deleted successfully' };
};