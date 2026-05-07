// --- 1. LIVELY PARTICLE BACKGROUND ---
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particlesArray;
canvas.width = window.innerWidth; canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX; this.y += this.directionY;
        this.draw();
    }
}
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        particlesArray.push(new Particle(x, y, (Math.random() * 1) - 0.5, (Math.random() * 1) - 0.5, size, '#6366f1'));
    }
}
function animateParticles() { requestAnimationFrame(animateParticles); ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); } }
initParticles(); animateParticles();

// --- 2. INTERACTIVE TOAST NOTIFICATIONS ---
function showToast(message, type = 'default') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `cyber-toast ${type}`;
    toast.innerText = `SYSTEM // ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'fadeOut 0.4s ease forwards'; setTimeout(() => toast.remove(), 400); }, 3000);
}

// --- 3. DATABASE STATE (Hardcoded for GitHub Pages) ---
let missions = [
    {
        id: 1,
        title: "The Boundary Sentinel",
        category: "Programmer",
        desc: "Write a program to input an integer N (0 < N < 10). Create an N x N matrix. Fill it with random single-digit numbers. Extract and print only the boundary elements of the matrix in their correct positions, leaving the interior elements as spaces. Finally, calculate and print the sum of these boundary elements.",
        code: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Mission Level: Programmer (Easy)\n        // Topic: The Boundary Sentinel\n        \n        Scanner sc = new Scanner(System.in);\n        \n        // Write your code here...\n        \n    }\n}"
    },
    {
        id: 2,
        title: "Lexicographical Vowel Extraction",
        category: "Hacker",
        desc: "Accept a sentence terminated by either '.' , '?' or '!'. Convert the sentence to uppercase. Extract all words that begin with a vowel (A, E, I, O, U). Store these words in a 1D array, sort them in alphabetical (lexicographical) order WITHOUT using built-in sorting methods like Arrays.sort(), and print the resulting array.",
        code: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Mission Level: Hacker (Moderate)\n        // Topic: Lexicographical Vowel Extraction\n        \n        Scanner sc = new Scanner(System.in);\n        \n        // Write your code here...\n        \n    }\n}"
    },
    {
        id: 3,
        title: "The Matrix Rotator (In-Place)",
        category: "Developer",
        desc: "Write a program to accept a square matrix of size M x M (2 < M < 10). Rotate the matrix exactly 90 degrees CLOCKWISE. The Twist: You must perform the rotation IN-PLACE. You are strictly forbidden from declaring a second matrix or temporary 2D array to hold the rotated values. Manipulate the indices directly.",
        code: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Mission Level: Developer (Hardcore)\n        // Topic: The Matrix Rotator (In-Place)\n        \n        Scanner sc = new Scanner(System.in);\n        \n        // Write your code here...\n        \n    }\n}"
    }
];
let activeMissionId = null;

// The Load Function
function loadMissions() {
    const saved = localStorage.getItem('codezilla_missions');
    if(saved && JSON.parse(saved).length > 0) { 
        missions = JSON.parse(saved); 
    } else {
        saveMissions(); 
    }
}

// THE MISSING SAVE FUNCTION
function saveMissions() { 
    localStorage.setItem('codezilla_missions', JSON.stringify(missions)); 
}

// THE MISSING SYNC LISTENER
window.addEventListener('storage', (e) => {
    if(e.key === 'codezilla_missions') { 
        loadMissions(); 
        renderMissions(); 
        showToast('ARENA DATA SYNCHRONIZED', 'success'); 
    }
});

// --- 4. TERMINAL TYPEWRITER EFFECT ---
let typeInterval;
function typeWriterCode(text, element) {
    clearInterval(typeInterval); element.value = ""; let i = 0;
    typeInterval = setInterval(() => { element.value += text.charAt(i); i++; if (i >= text.length) clearInterval(typeInterval); }, 25);
}

// --- 5. RENDERING ENGINE & EDIT/DELETE INJECTION ---
function renderMissions() {
    const adminList = document.getElementById('live-questions-list');
    const playerBoard = document.getElementById('player-missions-container');
    
    adminList.innerHTML = ''; playerBoard.innerHTML = '';

    missions.forEach((m, index) => {
        const questionNumber = index + 1; 
        
        // ADMIN LIST
        adminList.innerHTML += `
            <li class="mission-item">
                <strong>[Q${questionNumber}]</strong> ${m.title} 
                <div class="mission-actions">
                    <button class="icon-btn edit-btn" onclick="loadMissionForEdit(${m.id})">EDIT</button>
                    <button class="icon-btn delete-btn" onclick="deleteMission(${m.id})">DEL</button>
                </div>
            </li>`;
        
        // PLAYER BOARD (COLORS RESTORED HERE)
        let colorClass = m.category === 'Programmer' ? 'easy' : (m.category === 'Hacker' ? 'medium' : 'hard');
        
        let card = document.createElement('div');
        // Added the colorClass back into the className string!
        card.className = `threat-card ${colorClass}`; 
        card.innerHTML = `<span class="badge">Q${questionNumber} - ${m.category.toUpperCase()}</span><h4>${m.title}</h4><p>${m.desc}</p>`;
        
        card.onclick = () => {
            document.querySelectorAll('.threat-card').forEach(c => c.classList.remove('active-card'));
            card.classList.add('active-card');
            activeMissionId = questionNumber; 
            
            document.getElementById('active-mission-banner').classList.remove('hidden');
            document.getElementById('active-mission-title').innerText = `MISSION Q${questionNumber}: ${m.title.toUpperCase()}`;
            document.getElementById('active-mission-desc').innerText = m.desc;
            
            const studentName = localStorage.getItem('currentPlayerName') || 'Agent';
            const dynamicClassName = `${studentName}${activeMissionId}`;
            const customizedCode = m.code.replace(/public class \w+/g, `public class ${dynamicClassName}`);
            typeWriterCode(customizedCode, document.getElementById('code-editor'));
        };
        playerBoard.appendChild(card);
    });
}
loadMissions(); renderMissions(); 

// --- 6. ADMIN CRUD LOGIC ---
window.loadMissionForEdit = function(id) {
    const m = missions.find(x => x.id === id);
    if(m) {
        document.getElementById('edit-mission-id').value = m.id;
        document.getElementById('q-title').value = m.title;
        document.getElementById('q-category').value = m.category;
        document.getElementById('q-desc').value = m.desc;
        
        document.getElementById('admin-form-title').innerText = "UPDATE EXISTING MISSION";
        document.getElementById('submit-mission-btn').innerText = "SAVE CHANGES";
        document.getElementById('cancel-edit-btn').classList.remove('hidden');
    }
}
document.getElementById('cancel-edit-btn').addEventListener('click', resetAdminForm);

window.deleteMission = function(id) {
    if(confirm("Are you sure you want to delete this mission?")) {
        missions = missions.filter(x => x.id !== id);
        saveMissions(); renderMissions(); showToast('Mission Deleted', 'error'); resetAdminForm();
    }
}

function resetAdminForm() {
    document.getElementById('add-question-form').reset(); document.getElementById('edit-mission-id').value = "";
    document.getElementById('admin-form-title').innerText = "DEPLOY NEW MISSION";
    document.getElementById('submit-mission-btn').innerText = "DEPLOY TO ARENA";
    document.getElementById('cancel-edit-btn').classList.add('hidden');
}

document.getElementById('add-question-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-mission-id').value;
    const title = document.getElementById('q-title').value;
    const category = document.getElementById('q-category').value;
    const desc = document.getElementById('q-desc').value;
    
    if(id) {
        const index = missions.findIndex(x => x.id == id);
        missions[index].title = title; missions[index].category = category; missions[index].desc = desc;
        showToast('Mission Updated', 'success');
    } else {
        // Replace the old autoGeneratedCode line with this:
const autoGeneratedCode = `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here...\n        \n    }\n}`;
        missions.push({ id: Date.now(), title, category, desc, code: autoGeneratedCode });
        showToast('Mission Deployed to Arena', 'success');
    }
    saveMissions(); renderMissions(); resetAdminForm();
});

// --- 7. NEW FEATURES: UI TOGGLES (Support, Passwords, Feedback) ---

const adminPassInput = document.getElementById('admin-pass');
const togglePassBtn = document.getElementById('toggle-pass-btn');

togglePassBtn.addEventListener('click', () => {
    if (adminPassInput.type === "password") { 
        adminPassInput.type = "text"; 
        togglePassBtn.innerText = "🙈"; 
    } else { 
        adminPassInput.type = "password"; 
        togglePassBtn.innerText = "👁️"; 
    }
});

const supportBtn = document.getElementById('support-btn');
const supportModal = document.getElementById('support-modal');
supportBtn.addEventListener('click', () => supportModal.classList.remove('hidden'));
document.getElementById('close-support-btn').addEventListener('click', () => supportModal.classList.add('hidden'));

const stars = document.querySelectorAll('.star');
let ratingValue = 0;
stars.forEach(star => {
    star.addEventListener('click', () => {
        ratingValue = star.getAttribute('data-value');
        stars.forEach(s => s.classList.remove('active'));
        for(let i = 0; i < ratingValue; i++) { stars[i].classList.add('active'); }
    });
});

document.getElementById('submit-feedback-btn').addEventListener('click', () => {
    if(ratingValue > 0) {
        document.getElementById('feedback-modal').classList.add('hidden');
        showToast(`Thank you for rating us ${ratingValue} stars!`, 'success');
    } else {
        showToast('Please select a star rating first.', 'error');
    }
});

// --- 8. SCREEN & AUTH ROUTING ---
const screens = { 
    login: document.getElementById('screen-login'), 
    admin: document.getElementById('screen-admin'), 
    arena: document.getElementById('screen-arena') 
};

function showScreen(screenName) { 
    Object.values(screens).forEach(s => { 
        s.classList.add('hidden'); 
        s.classList.remove('active'); 
    }); 
    screens[screenName].classList.remove('hidden'); 
    setTimeout(() => screens[screenName].classList.add('active'), 50); 
}

document.getElementById('btn-player-tab').onclick = function() { 
    this.classList.add('active'); 
    document.getElementById('btn-admin-tab').classList.remove('active'); 
    document.getElementById('player-form').classList.remove('hidden'); 
    document.getElementById('admin-form').classList.add('hidden'); 
};

document.getElementById('btn-admin-tab').onclick = function() { 
    this.classList.add('active'); 
    document.getElementById('btn-player-tab').classList.remove('active'); 
    document.getElementById('admin-form').classList.remove('hidden'); 
    document.getElementById('player-form').classList.add('hidden'); 
};

document.getElementById('player-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('player-name').value;
    const cls = document.getElementById('player-class').value;
    const sec = document.getElementById('player-section').value;
    
    localStorage.setItem('currentPlayerName', name.replace(/\s+/g, '')); 
    document.getElementById('user-display').innerText = name.toUpperCase();
    document.getElementById('user-class-display').innerText = `[CLASS ${cls}-${sec.toUpperCase()}]`;
    
    screens.login.classList.add('hidden'); 
    document.getElementById('instruction-modal').classList.remove('hidden');
});

document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if(document.getElementById('admin-pass').value === "codezilla") { 
        showScreen('admin'); 
        showToast('Admin Access Granted', 'success'); 
    } else { 
        showToast('Access Denied: Invalid Key', 'error'); 
    }
});

document.getElementById('start-mission-btn').addEventListener('click', () => {
    document.getElementById('instruction-modal').classList.add('hidden'); 
    showScreen('arena'); 
    showToast('Arena Initialized', 'success'); 
    startTimer(3 * 60 * 60);
    
    setTimeout(() => {
        document.getElementById('feedback-modal').classList.remove('hidden');
    }, 600000); 
});

// --- 9. EXACT TERMINAL DOWNLOAD ---
document.getElementById('save-btn').addEventListener('click', () => {
    if(!activeMissionId) { showToast('ERROR: Select a mission first', 'error'); return; }
    const codeContent = document.getElementById('code-editor').value;
    const studentName = localStorage.getItem('currentPlayerName') || 'Agent';
    const fileName = `${studentName}${activeMissionId}.java`;
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    showToast(`Payload Secured: ${fileName}`, 'success');
});

// --- 10. TIMER LOGIC ---
function startTimer(durationInSeconds) {
    const timerDisplay = document.getElementById('global-timer'); let time = durationInSeconds;
    setInterval(() => {
        let h = Math.floor(time / 3600); let m = Math.floor((time % 3600) / 60); let s = Math.floor(time % 60);
        timerDisplay.textContent = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        if (--time < 0) time = 0;
    }, 1000);
}
