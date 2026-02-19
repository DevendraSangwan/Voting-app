document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const aadhar = document.getElementById('login-aadhar').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:5000/login', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadharCardNumber: aadhar, password })
    })
    .then(res => res.json())
    .then(data => {
        const msg = document.getElementById('login-message');

        if(data.success){
            msg.style.color = 'green';
            msg.textContent = "Login successful! Redirecting to voting page...";
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = 'vote.html'; // Redirect to voting page
            }, 1500);
        } else {
            msg.style.color = 'red';
            msg.textContent = data.message || "Aadhar or password is incorrect!";
        }
    })
    .catch(err => console.error('Login error:', err));
});
