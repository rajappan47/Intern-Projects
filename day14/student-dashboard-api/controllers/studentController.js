const Student = require('../models/Student');
const AttendanceLog = require('../models/AttendanceLog'); 



// GET all students (With Safe Search & Pagination Fallbacks)
// GET all students (With Safe Search & Pagination Fallbacks)
// exports.getAllStudents = async (req, res) => {
//   try {
//     const { search, page = 1, limit = 5 } = req.query;
//     let query = {};

//     // Only apply search criteria if a search string actually exists
//     if (search && search.trim() !== "") {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { rollNum: { $regex: search, $options: 'i' } },
//         { dept: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const parsedPage = Math.max(1, parseInt(page) || 1);
//     const parsedLimit = Math.max(1, parseInt(limit) || 5);
//     const skipCount = (parsedPage - 1) * parsedLimit;
    
//     // Core Query execution
//     const students = await Student.find(query)
//       .skip(skipCount)
//       .limit(parsedLimit)
//       .sort({ createdAt: -1 });

//     const totalRecords = await Student.countDocuments(query);

//     // LOG THIS TO YOUR BACKEND TERMINAL TO DEBUG EXACTLY WHAT IS GOING ON
//     console.log("=== API DEBUGGER ===");
//     console.log("Search Term:", search);
//     console.log("Generated Query Object:", JSON.stringify(query));
//     console.log("Documents Found in Database:", students.length);
//     console.log("====================");

//     res.status(200).json({
//       students: students || [],
//       pagination: {
//         totalRecords: totalRecords || 0,
//         currentPage: parsedPage,
//         totalPages: Math.ceil((totalRecords || 0) / parsedLimit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching records', error: error.message });
//   }
// };// GET all students (Filtering out soft-deleted records)
exports.getAllStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;
    
    // 1. Base Query: Only fetch records that are NOT soft-deleted ($ne: true)
    let query = { isDeleted: { $ne: true } };

    // 2. If a search term exists, combine the soft-delete filter with the search conditions
    if (search && search.trim() !== "") {
      query = {
        isDeleted: { $ne: true }, // Must not be soft-deleted
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { rollNum: { $regex: search, $options: 'i' } },
          { dept: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // 3. Setup Pagination variables
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, parseInt(limit) || 5);
    const skipCount = (parsedPage - 1) * parsedLimit;
    
    // 4. Core Database Execution 
    const students = await Student.find(query)
      .skip(skipCount)
      .limit(parsedLimit)
      .sort({ updatedAt: -1 }); // Shows recently updated or added records first

    // 5. Count total active records for the pagination UI component
    const totalRecords = await Student.countDocuments(query);

    // 6. Return the structured response payload back to React
    res.status(200).json({
      students: students || [],
      pagination: {
        totalRecords: totalRecords || 0,
        currentPage: parsedPage,
        totalPages: Math.ceil((totalRecords || 0) / parsedLimit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};



// GET metrics via Aggressive Aggregation Framework
exports.getStudentStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      { $match: { isDeleted: { $ne: true } } }, 
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || { total: 0, presentCount: 0, absentCount: 0 };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Aggregation computation failure', error: error.message });
  }
};

// PUT /api/students/:id (Edit / Update Student Details)
exports.updateStudent = async (req, res) => {
  try {
    const { name, rollNum, dept, status } = req.body;
    
    // Find and update with validators turned on to protect schema requirements
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNum, dept, status },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Validation rule violation on update', error: error.message });
  }
};

// POST Create Student
// exports.createStudent = async (req, res) => {
//   try {
//     const newStudent = new Student(req.body);
//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (error) {
//     res.status(400).json({ message: 'Validation rule violation', error: error.message });
//   }
// };

// // PUT Toggle Attendance Status
// exports.toggleStudentStatus = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) return res.status(404).json({ message: 'Record not found' });
    
//     student.status = student.status === 'Present' ? 'Absent' : 'Present';
//     await student.save();
//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ message: 'Status updating failed', error: error.message });
//   }
// };

//const Student = require('../models/Student');
// Import the AttendanceLog model so we can write relationship logs!

// 1. POST: Create Student AND automatically write an initial Attendance Log
exports.createStudent = async (req, res) => {
  try {
    // Save the student to the database
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();

    // RELATIONSHIP AUTOMATION:
    // Automatically create the very first attendance log for this new student
    const initialLog = new AttendanceLog({
      student: savedStudent._id,
      status: savedStudent.status || 'Present',
      remarks: 'Initial registration check-in'
    });
    await initialLog.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Validation rule violation', error: error.message });
  }
};

// 2. PUT: Toggle Student Status AND write a new history log
exports.toggleStudentStatus = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Record not found' });
    
    // Toggle the status
    student.status = student.status === 'Present' ? 'Absent' : 'Present';
    await student.save();

    // RELATIONSHIP AUTOMATION:
    // Create a new historical entry in the AttendanceLog collection
    const newHistoryLog = new AttendanceLog({
      student: student._id,
      status: student.status,
      remarks: `Status manually toggled to ${student.status}`
    });
    await newHistoryLog.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Status updating failed', error: error.message });
  }
};

// DELETE Soft Delete Execution
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Record not found' });

    student.isDeleted = true;
    student.deletedAt = new Date();
    await student.save();

    res.status(200).json({ message: 'Student micro-record soft deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Soft deletion execution error', error: error.message });
  }
};