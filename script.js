const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakI5NA1ZRuRRk';

// 1. SPLASH SCREEN CONTROL - Idhu dhaan black screen-ai remove pannum
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    
    // 2 seconds-ku apparam splash screen-ai hide pannum
    setTimeout(() => {
        if (splash) {
            splash.style.transition = 'opacity 0.8s ease';
            splash.style.opacity = '0';
            
            setTimeout(() => {
                splash.style.display = 'none';
                // Splash screen mudinja udanae default-aa Technology news load aagum
                FetchNews('Technology'); 
            }, 800);
        }
    }, 2000); 
});

// 2. FETCH NEWS FUNCTION (Fixed: Added https:// and Template Literals)
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    // Category button logic
    if (query === 'Local') { query = 'site:tamil.oneindia.com'; }

    // Loading Animation
    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse">📡 AI SYNCING: ${query.toUpperCase()}</p>
        </div>`;

    try {
        const ts = new Date().getTime(); 
        // FIXED URL: https:// add panniyaachu
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta&v=${ts}`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}&nocache=${ts}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Latest news-ai sort panni display pannum
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items.slice(0, 16));
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-500">No updates found for "${query}".</p>`;
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20">Network Busy. Internet connection-ai check pannunga.</p>`;
    }
}

// 3. DISPLAY FUNCTION (Unga image-la irukka maari UI layout)
function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        // SQL and AI processing-ku easy-aa title-ai clean pannuvom
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const dateObj = new Date(article.pubDate);
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
        
        // Dynamic Images based on Title
        const keywords = safeTitle.split(' ').slice(0, 2).join(',');
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${Math.floor(Math.random() * 8000)}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col relative shadow-2xl group">
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800 group-hover:scale-105 transition-all" 
                     onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                
                <div class="text-[9px] text-gray-400 font-bold mb-2 uppercase tracking-tighter">📅 ${dateStr} | 🕒 ${timeStr}</div>

                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                
                <div class="flex justify-between items-center mb-4 text-[10px] font-black">
                    <a href="${article.link}" target="_blank" class="text-blue-400 underline">SOURCE</a>
                    <button onclick="saveToSQL('${safeTitle}', '${article.link}', '${article.pubDate}')" class="text-yellow-500 font-bold border border-yellow-500 px-2 py-1 rounded-lg">⭐ SAVE SQL</button>
                </div>

                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl text-[10px] font-black transition-all shadow-lg">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

// 4. AI SUMMARY (Gemini Flash API)
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerText = "🤖 ANALYZING...";
    button.disabled = true;
    
    // Previous speech-ai stop pannum
    window.speechSynthesis.cancel();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this technology news in 2 lines of simple Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        // Tamil Voice Output
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
        
        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) { 
        alert("AI Service currently busy. Apparam try pannunga."); 
    } finally { 
        button.innerHTML = originalText; 
        button.disabled = false; 
    }
}

// 5. SQL SAVE FUNCTION
async function saveToSQL(title, link, pubDate) {
    const serverUrl = 'http://127.0.0.1:5000/save'; 

    try {
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, link, pub_date: pubDate })
        });
        const result = await response.json();
        if (response.ok) {
            alert("🚀 SUCCESS: News saved to SQL Database!");
        } else {
            alert("ℹ️ INFO: " + result.message);
        }
    } catch (e) {
        alert("❌ ERROR: Connection Failed! 'app.py' run aagudha-nu check pannunga.");
    }
}

// Category and Search Helpers
function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onresult = (e) => { 
        const transcript = e.results[0][0].transcript; 
        document.getElementById('searchInput').value = transcript; 
        FetchNews(transcript); 
    };
    rec.start();
}
