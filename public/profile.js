// Get user data from localStorage (set at login)
const user = JSON.parse(localStorage.getItem('currentUser'));

// Display user details
if(user){
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-age').textContent = user.age;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-mobile').textContent = user.mobile;
    document.getElementById('profile-address').textContent = user.address;
    document.getElementById('profile-aadhar').textContent = user.aadharCardNumber;
    document.getElementById('profile-role').textContent = user.role;
    document.getElementById('profile-isVoted').textContent = user.isVoted;
} else {
    alert("No user logged in. Redirecting to login page...");
    window.location.href = 'login.html';
}

// buttons  functionality
document.getElementById('goCandidatesBtn').addEventListener('click', () => {
    window.location.href = 'candidates.html';
});
document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});
const toggleBtn = document.getElementById("togglePasswordBtn");
const passwordForm = document.getElementById("changePasswordForm");

toggleBtn.addEventListener("click", () => {
    if (passwordForm.style.display === "none") {
        passwordForm.style.display = "block";
        toggleBtn.textContent = "Hide Password Form";
    } else {
        passwordForm.style.display = "none";
        toggleBtn.textContent = "Change Password";
    }
});

// Change Password 
document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const msg = document.getElementById('password-message');

    if(newPassword !== confirmPassword){
        msg.style.color = 'red';
        msg.textContent = "New password and confirm password do not match!";
        return;
    }

    fetch('http://localhost:5000/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
         },
        body: JSON.stringify({
          currentPassword: oldPassword,
           newPassword: newPassword
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            msg.style.color = 'green';
            msg.textContent = "Password changed successfully!";
            // clear form
            document.getElementById('changePasswordForm').reset();
        } else {
            msg.style.color = 'red';
            msg.textContent = data.message || "Failed to change password.";
        }
    })
    .catch(err => console.error(err));
});

