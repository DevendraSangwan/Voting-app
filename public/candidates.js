const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const candidateListEl = document.getElementById('candidate-list');
const adminSection = document.getElementById('admin-section');

// Show admin section if role is admin
if(currentUser.role === "admin"){
    adminSection.style.display = "block";
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

                // Admin: add update/delete buttons
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
                if(currentUser.role === "voter" && currentUser.isVoted === "No"){
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
            if(currentUser.role === "voter" && currentUser.isVoted === "No"){
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
    if(!name) return alert("Enter candidate name");

    fetch('http://localhost:5000/candidates', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name})
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
        headers: {'Content-Type': 'application/json'},
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

    fetch(`http://localhost:5000/candidates/${id}`, { method: 'DELETE' })
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

    fetch('http://localhost:5000/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({voterId: currentUser._id, candidateId: selected.value})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Vote submitted');
        currentUser.isVoted = "Yes";
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loadCandidates();
    });
}

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

loadCandidates();
