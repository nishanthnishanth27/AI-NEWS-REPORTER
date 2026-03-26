const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Core Fetching Logic
async function FetchNews(forcedQuery) {
    // Variable definition MUST come first
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    // Instagram Channel Sync Logic
    if (query === 'Local') {
        query = 'site:tamil.oneindia.com'; 
    }

    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse uppercase tracking-widest">LIVE SYNCING: ${query.toUpperCase()}</p>
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
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No updates found for "${query}".</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20">Network Busy. Retrying...</p>`;
        setTimeout(() => FetchNews(query), 5000);
    }
}

// 2. UI Display with Related Image Logic
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const timeStr = new Date(article.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Cleaned Keywords for better image matching
        const keywords = safeTitle.split(' ').slice(0, 2).join(',');
        const randomId = Math.floor(Math.random() * 8000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${randomId}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col relative shadow-2xl overflow-hidden group">
                <div class="absolute top-4 right-4 bg-blue-600 text-[8px] font-bold px-2 py-1 rounded-full z-10 shadow-lg">LATEST</div>
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800 group-hover:scale-105 transition-all" 
                     onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                <div class="text-[9px] text-gray-500 font-bold mb-2 uppercase tracking-tighter">🕒 Update: ${timeStr}</div>
                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <a href="${article.link}" target="_blank" class="text-blue-400 underline decoration-blue-900">VIEW SOURCE</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">WHATSAPP</button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-lg active:scale-95">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

// 3. AI Insights
async function getAiSummary(button, title) {
    const originalText = button.innerHTML;
    button.innerText = "🤖 ANALYZING...";
    button.disabled = true;
    window.speechSynthesis.cancel();
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Explain this in 2 lines in Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) { alert("AI Engine Busy! Try again."); }
    finally { button.innerHTML = originalText; button.disabled = false; }
}

// 4. Utility Functions
document.addEventListener('DOMContentLoaded', () => FetchNews());

function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// Auto-Refresh News
setInterval(() => {
    const q = document.getElementById('searchInput').value || 'Technology';
    FetchNews(q);
}, 180000);

// Splash Screen Control
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 1000);
        }, 2500);
    }
});
