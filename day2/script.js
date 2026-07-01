
const initialStudents = [
    { id: 101, name: "Alexander Smith", age: 20, department: "Computer Science" },
    { id: 102, name: "Beatrice Vance", age: 22, department: "Data Science" },
    { id: 103, name: "Charles Finch", age: 21, department: "Electrical Engineering" }
];

let students = [...initialStudents]; 
let editId = null;                  
let sortAscending = true;           

const renderDatabaseRows = () => {
    const tableBody = document.getElementById("tableBody");
    console.log(tableBody);
    tableBody.innerHTML = "";

    const searchQuery = document.getElementById("searchBox").value.toLowerCase();
    const activeFilter = document.getElementById("filterDept").value;


    // const filteredResults = students.filter(student => {
    //     // OPTIONAL CHAINING (?.) safety assertion mapping
    //     const nameMatches = student?.name?.toLowerCase().includes(searchQuery);
    //     const departmentMatches = activeFilter === "All" || student?.department === activeFilter;
    //     return nameMatches && departmentMatches;
    // });

    const filteredResults = students.filter(student=>
    {
        return student.name.toLowerCase().includes(searchQuery)  && (activeFilter==="All" ||student.department ===activeFilter);
    });

    
    for (const student of filteredResults) {
        const { id, name, age, department } = student;
        const elementTemplate = `
            <tr>
                <td>${name}</td>
                <td>${age}</td>
                <td>${department}</td>
                <td>
                    <button class="edit-action-btn" data-id="${id}">Edit</button>
                    <button class="delete-action-btn" data-id="${id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', elementTemplate);
    }

    document.querySelectorAll('.edit-action-btn').forEach(btn => {
        btn.onclick = () => setupFormForEdit(Number(btn.dataset.id));
    });
    document.querySelectorAll('.delete-action-btn').forEach(btn => {
        btn.onclick = () => executionDeleteTarget(Number(btn.dataset.id));
    });

    calculateDashboardMetrics();
};


const calculateDashboardMetrics = () => {
   
    document.getElementById("totalCount").innerText = students.length;
    
    const totalCombinedAge = students.reduce((accumulator, currentItem) => accumulator + Number(currentItem.age), 0);
    const calculatedAvg = students.length > 0 ? (totalCombinedAge / students.length).toFixed(1) : 0;
    
    document.getElementById("avgAge").innerText = calculatedAvg;
};

document.getElementById("studentForm").onsubmit = (event) => {
    event.preventDefault();
    
    const nameValue = document.getElementById("studName").value;
    const ageValue = document.getElementById("studAge").value;
    const departmentValue = document.getElementById("studDept").value;

    if (editId !== null) {
        students = students.map(item => 
            item.id === editId ? { ...item, name: nameValue, age: ageValue, department: departmentValue } : item
        );
        clearFormState();
    } else {
        
        const freshRecord = { id: Date.now(), name: nameValue, age: ageValue, department: departmentValue };
        students = [...students, freshRecord];
    }

    document.getElementById("studentForm").reset();
    renderDatabaseRows();
};

const executionDeleteTarget = (targetId) => {
    students = students.filter(student => student.id !== targetId);
    if (editId === targetId) clearFormState();
    renderDatabaseRows();
};

const setupFormForEdit = (targetId) => {
    const matchedProfile = students.find(s => s.id === targetId);
    if (!matchedProfile) return;

    editId = targetId;
    document.getElementById("formTitle").innerText = "Edit Student Profile Data";
    document.getElementById("submitBtn").innerText = "Save Student Updates";
    document.getElementById("cancelBtn").style.display = "inline-block";

    document.getElementById("studName").value = matchedProfile.name;
    document.getElementById("studAge").value = matchedProfile.age;
    document.getElementById("studDept").value = matchedProfile.department;
};

const clearFormState = () => {
    editId = null;
    document.getElementById("formTitle").innerText = "Add Student";
    document.getElementById("submitBtn").innerText = "Add Student";
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("studentForm").reset();
};

document.getElementById("sortBtn").onclick = () => {
    students.sort((firstItem, secondItem) => {
        const sortingOutcome = firstItem.name.localeCompare(secondItem.name);
        return sortAscending ? sortingOutcome : -sortingOutcome;
    });

    sortAscending = !sortAscending;
    document.getElementById("sortBtn").innerText = `Sort by Name (${sortAscending ? 'A-Z' : 'Z-A'})`;
    
    systemLoggerChannel("Database Sorter Triggered Run", sortAscending, students.length);
    renderDatabaseRows();
};

  const systemLoggerChannel = (summaryMessage, ...unlimitedContextDetails) => {
      console.log(`[Event Log Summary]: ${summaryMessage}`, unlimitedContextDetails);
  };

document.getElementById("cancelBtn").onclick = clearFormState;
document.getElementById("searchBox").oninput = renderDatabaseRows;
document.getElementById("filterDept").onchange = renderDatabaseRows;
renderDatabaseRows();