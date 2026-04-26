let currentProfile = null;

async function loadProfile() {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    
    try {
        const res = await fetch('http://localhost:3001/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 404) displayNoProfile();
        else if (res.ok) {
            const data = await res.json();
            currentProfile = data.profile;
            displayProfile(data.profile);
        }
    } catch (err) {
        console.error(err);
    }
}

function displayProfile(profile) {
    document.getElementById('profileInfo').innerHTML = `
        <p>Full name: ${profile.full_name || '—'}</p>
        <p>Bio: ${profile.bio || '—'}</p>
        <p>Birth date: ${profile.birth_date || '—'}</p>
        <button onclick="showEditForm()">Edit</button>
        <button onclick="deleteProfile()">Delete</button>
    `;
}

function displayNoProfile() {
    document.getElementById('profileInfo').innerHTML = `
        <p>No profile found</p>
        <button onclick="showEditForm()">Create Profile</button>
    `;
}

function showEditForm() {
    if (currentProfile) {
        document.getElementById('fullName').value = currentProfile.full_name || '';
        document.getElementById('bio').value = currentProfile.bio || '';
        document.getElementById('birthDate').value = currentProfile.birth_date || '';
    }
}

async function saveProfile() {
    const token = sessionStorage.getItem('token');
    const profileData = {
        full_name: document.getElementById('fullName').value,
        bio: document.getElementById('bio').value,
        birth_date: document.getElementById('birthDate').value
    };
    
    const res = await fetch('http://localhost:3001/api/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    
    if (res.ok) {
        alert('Saved');
        loadProfile();
    }
}

async function deleteProfile() {
    if (!confirm('Delete profile?')) return;
    const token = sessionStorage.getItem('token');
    const res = await fetch('http://localhost:3001/api/profile', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        alert('Deleted');
        loadProfile();
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = '/';
}

window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) window.location.href = '/';
    document.getElementById('userInfo').innerHTML = `<p>Welcome, ${user.login} (ID: ${user.id})</p>`;
    loadProfile();
};