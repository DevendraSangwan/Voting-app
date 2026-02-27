const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const candidateListEl = document.getElementById('candidate-list');
const adminSection = document.getElementById('admin-section');

//first login 
if(!currentUser){
    alert("Please login first!");
    window.location.href = "login.html";
}else{

// Show admin section if role is admin
   if(currentUser.role === "admin"){
    adminSection.style.display = "block";
}
}

// Load all candidates
function loadCandidates(){
    fetch('http://localhost:5000/candidates')
        .then(res => res.json())
        .then(candidates => {
            candidateListEl.innerHTML = '';
            candidates.forEach(c => {
                const li = document.createElement('li');
                li.textContent = `${c.name} (${c.votes.length} votes)`;

                // Admin: add /update /delete buttons
                if(currentUser.role === "admin"){
                    const updateBtn = document.createElement('button');
                    updateBtn.textContent = 'Update';
                    updateBtn.style.marginLeft = '10px';
                    updateBtn.onclick = () => updateCandidate(c._id);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.style.marginLeft = '5px';
                    deleteBtn.onclick = () => deleteCandidate(c._id);

                    li.appendChild(updateBtn);
                    li.appendChild(deleteBtn);
                }

                // Voter: add vote radio button if not voted
                if(currentUser.role === "voter" && currentUser.isVoted === false){
                    const voteRadio = document.createElement('input');
                    voteRadio.type = 'radio';
                    voteRadio.name = 'vote';
                    voteRadio.value = c._id;
                    voteRadio.style.marginLeft = '10px';
                    li.appendChild(voteRadio);
                }

                candidateListEl.appendChild(li);
            });

            // Voter vote button
            if(currentUser.role === "voter" && currentUser.isVoted === false){
                const voteBtn = document.createElement('button');
                voteBtn.textContent = 'Submit Vote';
                voteBtn.onclick = submitVote;
                candidateListEl.appendChild(voteBtn);
            }
        });
}

// Admin: Add candidate
document.getElementById('addCandidateBtn').addEventListener('click', () => {
   const name = document.getElementById('candidate-name').value;
const party = document.getElementById('candidate-party').value;
const age = parseInt(document.getElementById('candidate-age').value);

if(!name || !party || !age) {
    return alert("Fill all fields");
}
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    fetch('http://localhost:5000/candidates', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({name,party,age, role:currentUser.role})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Candidate added');
        document.getElementById('candidate-name').value = '';
        loadCandidates();
    });
});

// Admin: Update candidate
function updateCandidate(id){
    const newName = prompt("Enter new name:");
    if(!newName) return;

    fetch(`http://localhost:5000/candidates/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({name: newName})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Candidate updated');
        loadCandidates();
    });
}

// Admin: Delete candidate
function deleteCandidate(id){
    if(!confirm("Are you sure?")) return;

    fetch(`http://localhost:5000/candidates/${id}`, {
         method: 'DELETE', 
          headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || 'Candidate deleted');
            loadCandidates();
        });
}

// Voter: Submit vote
function submitVote(){
    const selected = document.querySelector('input[name="vote"]:checked');
    if(!selected) return alert("Select a candidate");

    fetch(`http://localhost:5000/vote/${selected.value}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem("token")}`

        },

        body: JSON.stringify({voterId: currentUser._id, candidateId: selected.value})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Vote submitted');
        currentUser.isVoted = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadCandidates();
    });
}

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

loadCandidates();
