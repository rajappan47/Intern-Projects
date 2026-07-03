const API_URL = "https://jsonplaceholder.typicode.com/posts";
let postarr =[];

window.onload = function() {
    const savedData = localStorage.getItem("my_cached_posts");
    if (savedData) {
        renderList(JSON.parse(savedData));
    }
    getPosts();
};


async function searchPostById() {
    
    const searchId = document.getElementById("search-id").value;
    if (!searchId) {
        alert("Please enter an ID number to search!");
        return;
    }

    try {
       
        const response = await fetch(`${API_URL}/${searchId}`);
        
      
        if (!response.ok) {
            alert(`Post with ID ${searchId} was not found.`);
            return;
        }

        const post = await response.json();
        
        
        const singlePostArray = [post];
        console.log("found",singlePostArray);
      
        renderList(singlePostArray);

    } catch (error) {
        alert("Error while looking for the post.");
    }
}


async function getPosts() {
    try {
       
        document.getElementById("search-id").value = "";

        const response = await fetch(API_URL);
        const posts = await response.json();
        
        const limitedPosts = posts;
        //posts.slice(0, 5);
        postarr.push(...limitedPosts);
        console.log(postarr);
        localStorage.setItem("my_cached_posts", JSON.stringify(limitedPosts));
        
        renderList(postarr);
    } catch (error) {
        console.log("Offline mode. Loading local storage cache.");
    }
}


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


// async function handleSave() {
//     const id = document.getElementById("post-id").value;
//     const title = document.getElementById("post-title").value;
//     const body = document.getElementById("post-body").value;

//     if (!title || !body) {
//         alert("Please fill out both fields!");
//         return;
//     }

//     const payload = { title: title, body: body, userId: 1 };
//     let url = API_URL;
//     let httpMethod = "POST"; 

//     if (id !== "") {
//         url = API_URL + "/" + id;
//         httpMethod = "PUT";
//     }

//     try {
//         const response = await fetch(url, {
//             method: httpMethod,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });

//         if (response.ok) {
//             alert("Success!");
//             console.log("put/ post",payload);
//             postarr = [...postarr,payload];
//             console.log(" add arr",postarr);
//             clearForm();
//              renderList(postarr); 
//         } else {
//             alert("Server error occurred.");
//         }
//     } catch (error) {
//         alert("Network error.");
//     }
// }

async function handleSave() {
    const id = document.getElementById("post-id").value;
    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;

    if (!title || !body) {
        alert("Please fill out both fields!");
        return;
    }

    let payload = {
        title: title,
        body: body,
        userId: 1
    };

    let url = API_URL;
    let httpMethod = "POST";

    if (id !== "") {
        url = API_URL + "/" + id;
        httpMethod = "PUT";
        payload.id = Number(id);
    }

    try {
        const response = await fetch(url, {
            method: httpMethod,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {

            const savedPost = await response.json();

            if (httpMethod === "POST") {

                // If API doesn't return an id, create one
                if (!savedPost.id) {
                    savedPost.id = Date.now();
                }

                postarr.push(savedPost);

            } else {

                // Update existing object
                postarr = postarr.map(post =>
                    post.id == savedPost.id
                        ? savedPost
                        : post
                );

            }

            console.log(postarr);

            renderList(postarr);
            clearForm();

            alert("Success!");

        } else {
            alert("Server error occurred.");
        }

    } catch (error) {
        console.error(error);
        alert("Network error.");
    }
}


async function deletePost(id) {
    const confirmation = confirm("Are you sure you want to delete post #" + id + "?");
    if (!confirmation) return; 

    try {
        const response = await fetch(API_URL + "/" + id, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Post successfully deleted!");
            const responseData = await response.json();
            console.log("delete", responseData);
            getPosts(); 
        } else {
            alert("Could not complete the delete action.");
        }
    } catch (error) {
        alert("Error connecting to the server.");
    }
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