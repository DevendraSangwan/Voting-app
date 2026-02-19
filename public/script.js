let currentUser = null;

// Signup 
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        address: document.getElementById('address').value,
        aadharCardNumber: document.getElementById('aadharCardNumber').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        isVoted: false
    };

    fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('signup-message').textContent = data.message;
        if(data.success){
            document.getElementById('signup-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        }
    });
});

// Login 
document.getElementById('loginBtn').addEventListener('click', () => {
    const aadhar = document.getElementById('login-aadhar').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadharCardNumber: aadhar, password })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            currentUser = data.user;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('vote-section').style.display = 'block';
            loadCandidates();
            loadResults();
        } else {
            document.getElementById('login-message').textContent = data.message;
        }
    });
});

// Load Candidates 
function loadCandidates() {
    fetch('http://localhost:5000/candidates')
        .then(res => res.json())
        .then(candidates => {
            const list = document.getElementById('candidate-list');
            list.innerHTML = '';
            candidates.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<input type="radio" name="vote" value="${c._id}" ${currentUser.isVoted === "Yes" ? "disabled" : ""}> ${c.name}`;
                list.appendChild(li);
            });
        });
}

//  Submit Vote 
document.getElementById('voteBtn').addEventListener('click', () => {
    if(currentUser.isVoted === true){
        alert("You have already voted!");
        return;
    }

    const selected = document.querySelector('input[name="vote"]:checked');
    if(!selected) { alert('Select a candidate!'); return; }

  fetch(`http://localhost:5000/vote/${selected.value}`,{
   method:'POST',
   headers:{
      'Content-Type':'application/json',
      'Authorization':'Bearer '+localStorage.getItem("token")
   }
})

    .then(res => res.json())
    .then(data => {
        document.getElementById('vote-msg').textContent = data.message;
        currentUser.isVoted = "true"; 
        loadResults();
    });
});

//  Load Results 
function loadResults() {
    fetch('http://localhost:5000/results')
        .then(res => res.json())
        .then(results => {
            const list = document.getElementById('results-list');
            list.innerHTML = '';
            results.forEach(r => {
                const li = document.createElement('li');
                li.textContent = `${r.name}: ${r.votes.length} votes`;
                list.appendChild(li);
            });
        });
}
