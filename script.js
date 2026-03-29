const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';
const EMAILJS_PUBLIC_KEY = 'ZMkclx4cHgNZXN66H'; // Unga Public Key

// --- LOGIN ALERT FUNCTION ---
// App open aagum pothu unga mail-ku alert anuppum
function sendLoginAlert() {
    const params = {
        user_event: "User Logged In / App Opened",
        time_stamp: new Date().toLocaleString(),
        to_email: 'legendnishanth52@gmail.com' // Unga mail
    };

    emailjs.send('service_default', 'template_sidfav5', params, EMAILJS_PUBLIC_KEY)
        .then(() => { console.log('Login alert sent to Nishanth!'); })
        .catch((err) => { console.error('Alert failed:', err); });
}

// 1. Fetch News Function with Search Tracking
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');
    
    // Loading Animation
    grid.innerHTML = `<div class="col-span-full text-center py-20"><p class="text-blue-400 animate-pulse font-bold uppercase tracking-widest">AI SYNCING: ${query.toUpperCase()}</p></div>`;

    try {
        const ts = new Date().getTime();
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta&gl=IN&ceid=IN:ta`;
        const rssToJson = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&nocache=${ts}`;

        const response = await fetch(rssToJson);
        const data = await response.json();

        // 🎯 CRITICAL FIX: small 'i' for items
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items.slice(0, 16), query);
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400 font-bold uppercase">No updates found for "${query}"</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center py-20 text-red-500 font-bold uppercase">Network Busy. Retrying...</p>`;
        console.error(e);
    }
}
    }
}
}

// 2. EmailJS Function for Tracking
function sendSearchAlert(searchQuery) {
    const templateParams = {
        user_search: searchQuery,
        time_stamp: new Date().toLocaleString(),
        to_email: 'legendnishanth52@gmail.com'
    };
    emailjs.send('service_default', 'template_sidfav5', templateParams, EMAILJS_PUBLIC_KEY);
}

// 3. Display Function (Includes SQL Save and AI Summary)
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const dateObj = new Date(article.pubDate);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
        
        const keywords = safeTitle.split(' ').slice(0, 2).join(',');
        const randomId = Math.floor(Math.random() * 8000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${randomId}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col relative shadow-2xl overflow-hidden group">
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800 group-hover:scale-105 transition-all" 
                     onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                <div class="text-[9px] text-gray-400 font-bold mb-2 uppercase tracking-tighter">📅 ${dateStr} | 🕒 ${timeStr}</div>
                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <a href="${article.link}" target="_blank" class="text-blue-400 underline">SOURCE</a>
                    <button onclick="saveToSQL('${safeTitle}', '${article.link}', '${article.pubDate}')" 
                            class="text-yellow-500 font-bold border border-yellow-500 px-2 py-1 rounded-lg hover:bg-yellow-500 hover:text-black transition-all">
                        ⭐ SAVE SQL
                    </button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl text-[10px] font-black transition-all shadow-lg active:scale-95">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

// 4. AI Summary (Gemini API)
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerText = "🤖 ANALYZING...";
    button.disabled = true;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize in 2 lines Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) { alert("AI Busy!"); }
    finally { button.innerHTML = originalText; button.disabled = false; }
}

// 5. SQL Save Function (Backend)
async function saveToSQL(title, link, pubDate) {
    try {
        const response = await fetch('http://localhost:5000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, link: link, pub_date: pubDate })
        });
        const result = await response.json();
        alert(result.message);
    } catch (e) { alert("ERROR: SQL Backend run aagala!"); }
}

// 6. Splash Screen and Login Trigger
window.addEventListener('load', () => {
    // TRIGGER LOGIN MAIL
    sendLoginAlert();

    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.transition = 'opacity 0.6s ease';
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                FetchNews(); 
            }, 600);
        }, 2000); 
    } else { FetchNews(); }
});

// Category & Voice Search
function FetchByCategory(cat) { document.getElementById('searchInput').value = cat; FetchNews(cat); }

function startVoiceSearch() {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.onresult = (e) => { 
        const transcript = e.results[0][0].transcript; 
        document.getElementById('searchInput').value = transcript; 
        FetchNews(transcript); 
    };
    rec.start();
}
