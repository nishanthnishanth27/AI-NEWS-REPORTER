const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Fetch News Function
async function FetchNews(forcedQuery) {
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    if (query === 'Local') { query = 'site:tamil.oneindia.com'; }

    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse">📡 AI SYNCING: ${query.toUpperCase()}</p>
        </div>`;

    try {
        const ts = new Date().getTime(); 
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta&v=${ts}`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}&nocache=${ts}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items.slice(0, 16), query);
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No updates found.</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20">Network Busy. Retrying...</p>`;
    }
}

// 2. Display Function with SQL Button
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

// 3. AI Insights Logic
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerText = "🤖 ANALYZING...";
    button.disabled = true;
    window.speechSynthesis.cancel();
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize in 2 lines Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) { alert("AI Busy!"); }
    finally { button.innerHTML = originalText; button.disabled = false; }
}

// 4. SQL SAVE FUNCTION
async function saveToSQL(title, link, pubDate) {
    try {
        const response = await fetch('http://localhost:5000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, link: link, pub_date: pubDate })
        });
        const result = await response.json();
        alert(result.message);
    } catch (e) { alert("run on the laptop"); }
}

// 5. SPLASH SCREEN FIX 
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        console.log("Splash screen found, starting timer...");
        setTimeout(() => {
            splash.style.transition = 'opacity 0.6s ease';
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                console.log("Splash hidden, fetching news...");
                FetchNews(); 
            }, 600);
        }, 2000); 
    } else {
        console.log("Splash screen element not found!");
        FetchNews();
    }
});

// Category Fetch
function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// Voice Search
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => { micBtn.innerHTML = "🔴"; };
    rec.onresult = (e) => { 
        const transcript = e.results[0][0].transcript; 
        document.getElementById('searchInput').value = transcript; 
        FetchNews(transcript); 
    };
    rec.onend = () => { micBtn.innerHTML = "🎤"; };
    rec.start();
}
