// app.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Global configuration ---
  // Set the API URL – during development, use localhost;
  // In production, update this to your deployed backend URL.
  const apiUrl = 'http://localhost:3000/api'; // e.g., 'https://your-backend-app.onrender.com/api'

  // Utility function for making API requests using fetch
  function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.body = JSON.stringify(data);
    return fetch(apiUrl + endpoint, options).then((response) => response.json());
  }

  // --- Authentication: Login Form ---
  const loginForm = document.querySelector('.login-form.login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      apiRequest('/login', 'POST', { email, password })
        .then((data) => {
          if (data.success) {
            // You may store a token or user info in localStorage/sessionStorage here
            window.location.href = 'dashboard.html';
          } else {
            alert(data.message || 'Login failed');
          }
        })
        .catch((err) => console.error(err));
    });
  }

  // --- Reset Password Form ---
  const resetForm = document.querySelector('.login-form.reset');
  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      apiRequest('/reset-password', 'POST', { email })
        .then((data) => {
          alert(data.message || 'A reset link has been sent to your email.');
        })
        .catch((err) => console.error(err));
    });
  }

  // --- Teacher Management: Add Teacher ---
  const teacherForm = document.querySelector('.teacher-management form');
  if (teacherForm) {
    teacherForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('teacher-name').value;
      const email = document.getElementById('teacher-email').value;
      const subject = document.getElementById('teacher-subject').value;
      const phone = document.getElementById('teacher-phone').value;
      apiRequest('/teachers', 'POST', { name, email, subject, phone })
        .then((data) => {
          if (data.success) {
            alert('Teacher added successfully.');
            // Optionally update the teacher table dynamically
            window.location.reload();
          } else {
            alert(data.message || 'Failed to add teacher.');
          }
        })
        .catch((err) => console.error(err));
    });
  }

  // --- Teacher Management: Delete Teacher (using event delegation) ---
  const teacherTable = document.querySelector('.teacher-management table');
  if (teacherTable) {
    teacherTable.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this teacher?')) {
          // Assume the teacher’s email (or another unique ID) is in the second cell.
          const teacherRow = e.target.closest('tr');
          const teacherEmail = teacherRow.querySelector('td:nth-child(2)').textContent;
          apiRequest(`/teachers?email=${encodeURIComponent(teacherEmail)}`, 'DELETE')
            .then((data) => {
              if (data.success) {
                alert('Teacher deleted successfully.');
                teacherRow.remove();
              } else {
                alert(data.message || 'Failed to delete teacher.');
              }
            })
            .catch((err) => console.error(err));
        }
      }
      // Additional event delegation for edit actions can be added here.
    });
  }

  // --- Dark Mode Toggle with Persistence ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // On page load, check stored theme preference.
    const storedTheme = localStorage.getItem('theme') || 'light';
    if (storedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // --- Additional Functionality ---
  // You can add similar handlers for fee management, student list, parent portal, etc.
});
