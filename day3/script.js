const API_URL = "https://jsonplaceholder.typicode.com/posts";
let apiPosts = [];   // Stores only API data
let allPosts = [];   // Stores API data + User Added Data

// ---------------------------------------------------------
// 1. WINDOW ONLOAD (Fix: Prevents overwriting local changes)
// ---------------------------------------------------------
window.onload = function() {
    // Check if data already exists in LocalStorage
    const savedData = localStorage.getItem("my_cached_posts");

    if (savedData) {
        allPosts = JSON.parse(savedData);
        console.log("Loaded from LocalStorage on boot, total posts:", allPosts.length);
        renderList(allPosts);
    } else {
        // Data illana mattum thaan API-lerundhu fresh-ah edukanum
        getPosts();
    }
};

async function getPosts() {
    try {
        document.getElementById("search-id").value = "";

        console.log("LocalStorage empty. Fetching from live API...");
        const response = await fetch(API_URL);
        const posts = await response.json();
        
        // Normalize all IDs to String for consistent matching across UI and storage
        const normalizedPosts = posts.map(post => ({
            ...post,
            id: String(post.id)
        }));

        apiPosts = [...normalizedPosts];
        allPosts = [...normalizedPosts];
        
        // Save the clean slate to cache
        localStorage.setItem("my_cached_posts", JSON.stringify(allPosts));
        renderList(allPosts);

    } catch (error) {
        console.log("Offline mode or error fetching live API data.");
    }
}

// ---------------------------------------------------------
// 2. SEARCH POST BY ID
// ---------------------------------------------------------
async function searchPostById() {
    const searchId = document.getElementById("search-id").value.trim();
    if (!searchId) {
        alert("Please enter an ID number to search!");
        return;
    }

    try {
        // Safe string-based comparison
        const post = allPosts.find(p => String(p.id) === String(searchId));

        if (!post) {
            alert("Post not found.");
            return;
        }

        renderList([post]);

    } catch (error) {
        alert("Error while looking for the post.");
    }
}

// ---------------------------------------------------------
// 3. HANDLE SAVE (Add and Update functionality with dynamic type fix)
// ---------------------------------------------------------
async function handleSave() {
    const id = document.getElementById("post-id").value.trim();
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();

    if (!title || !body) {
        alert("Please fill out both fields!");
        return;
    }

    // CASE 1: ADD NEW POST
    if (id === "") {
        const payload = { title, body, userId: 1 };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                alert("Server error occurred.");
                return;
            }

            const savedPost = await response.json();

            // Calculate exact unique ID above 100 sequentially
            let dynamicId;
            if (allPosts.length > 0) {
                dynamicId = Math.max(...allPosts.map(post => Number(post.id))) + 1;
            } else {
                dynamicId = 101;
            }
            
            // Store as a String to strictly match standard DOM field type output
            savedPost.id = String(dynamicId);

            allPosts.push(savedPost);
            
            // Sync immediately to local storage cache
            localStorage.setItem("my_cached_posts", JSON.stringify(allPosts));

            renderList(allPosts);
            clearForm();
            alert("Post Added Successfully! ID: " + savedPost.id);

        } catch (error) {
            console.error(error);
            alert("Network error.");
        }
        return;
    }

    // CASE 2: UPDATE EXISTING POST
    const payload = {
        id: String(id), // Keep consistent with lookup arrays
        title,
        body,
        userId: 1
    };

    try {
        // If local custom ID (>100)
        if (Number(id) > 100) {
            const index = allPosts.findIndex(post => String(post.id) === String(id));

            if (index !== -1) {
                allPosts[index] = payload;
                localStorage.setItem("my_cached_posts", JSON.stringify(allPosts));
            } else {
                alert("Error: Post ID " + id + " does not exist in local storage memory.");
                console.log("Failed lookup block. ID searched:", id, "Existing IDs:", allPosts.map(p => p.id));
                return;
            }

            renderList(allPosts);
            clearForm();
            alert("Updated Successfully (Local ID > 100)!");
            return;
        }

        // Standard API original posts (1 to 100)
        const response = await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            alert("Server error occurred.");
            return;
        }

        const updatedPost = await response.json();
        const index = allPosts.findIndex(post => String(post.id) === String(updatedPost.id));

        if (index !== -1) {
            updatedPost.id = String(updatedPost.id); // Ensure normalization keeps working
            allPosts[index] = updatedPost;
        }
        
        localStorage.setItem("my_cached_posts", JSON.stringify(allPosts));
        renderList(allPosts);
        clearForm();
        alert("Updated Successfully!");

    } catch (error) {
        console.error(error);
        alert("Network error.");
    }
}

// ---------------------------------------------------------
// 4. DELETE POST
// ---------------------------------------------------------
async function deletePost(id) {
    const confirmation = confirm("Are you sure you want to delete post #" + id + "?");
    if (!confirmation) return; 

    try {
        // Normal code execution check for safety bounds
        if (Number(id) <= 100) {
            await fetch(API_URL + "/" + id, { method: "DELETE" });
        }

        alert("Post successfully deleted!");
        allPosts = allPosts.filter(post => String(post.id) !== String(id));

        renderList(allPosts); 
        localStorage.setItem("my_cached_posts", JSON.stringify(allPosts));

    } catch (error) {
        alert("Error connecting to the server.");
    }
}

// ---------------------------------------------------------
// 5. HELPER FUNCTIONS (UI Setup, Forms, Escape Chars)
// ---------------------------------------------------------
function renderList(postsArray) {
    const container = document.getElementById("list-container");
    container.innerHTML = ""; 

    postsArray.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";

        card.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>ID:</strong> ${post.id} | <strong>User ID:</strong> ${post.userId}</p>
            <p>${post.body}</p>
            <button onclick="setupEditForm('${post.id}', '${escapeSpecialChars(post.title)}', '${escapeSpecialChars(post.body)}')">Edit</button>
            <button style="background-color:#dc3545;" onclick="deletePost('${post.id}')">Delete</button>
        `;
        container.appendChild(card);
    });
}

function setupEditForm(id, title, body) {
    document.getElementById("form-title").textContent = "Edit Existing Post (#" + id + ")";
    document.getElementById("post-id").value = id;
    document.getElementById("post-title").value = title;
    document.getElementById("post-body").value = body;

    document.getElementById("save-btn").textContent = "Update Changes";
    document.getElementById("cancel-btn").style.display = "inline-block";
}

function clearForm() {
    document.getElementById("form-title").textContent = "Add New Post";
    document.getElementById("post-id").value = "";
    document.getElementById("post-title").value = "";
    document.getElementById("post-body").value = "";

    document.getElementById("save-btn").textContent = "Save Post";
    document.getElementById("cancel-btn").style.display = "none";
}

function escapeSpecialChars(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, "\\n");
}