const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Core Fetching Function
async function FetchNews(forcedQuery) {
    // FIX: Variable definition must come first
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    // Instagram/Website Sync for 'Local' Category
    if (query === 'Local') {
        query = 'site:tamil.oneindia.com'; 
    }

    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse uppercase tracking-widest">📡 AI SYNCING: ${query.toUpperCase()}</p>
        </div>`;

    try {
        const ts = new Date().getTime(); 
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta&v=${ts}`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

        const response = await fetch(`${rssToJson}${encodeURIComponent(rssUrl)}&nocache=${ts}`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Sort to show newest news first
            data.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(data.items.slice(0, 16), query);
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No updates found for "${query}".</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold">Network Busy. Retrying...</p>`;
        setTimeout(() => FetchNews(query), 5000);
    }
}

// 2. Display Function with Date & Time Fix
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        
        // Date and Time Formatting
const relativeTime = getRelativeTime(article.pubDate);
const dateStr = new Date(article.pubDate).toLocaleDateString([], { day: 'numeric', month: 'short' });
        // Related Image Logic
        const keywords = safeTitle.split(' ').slice(0, 2).join(',');
        const randomId = Math.floor(Math.random() * 8000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${randomId}`;

        grid.innerHTML += `
                <div class="relative bg-black border border-gray-800 p-5 rounded-[32px] overflow-hidden group shadow-2xl flex flex-col min-h-[300px]">
                <div class="absolute inset-0 z-0 bg-cover bg-center opacity-30 grayscale group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-500" 
                     style="background-image: url('https://raw.githubusercontent.com/nishanthnishanth27/AI-NEWS-REPORTER/main/logo.png');"></div>
                <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col relative shadow-2xl overflow-hidden group">
                <div class="absolute top-4 right-4 bg-blue-600 text-[8px] font-bold px-2 py-1 rounded-full z-10 shadow-lg">LATEST</div>
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800 group-hover:scale-105 transition-all" 
                     onerror="this.src='https://raw.githubusercontent.com/NishanthKn12/AI-NEWS-REPORTER/main/logo.png'">
                
                <div class="text-[9px] text-gray-400 font-bold mb-2 uppercase tracking-tighter">
                    📅 ${dateStr}  |  🕒 ${timeStr}
                </div>

                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <a href="${article.link}" target="_blank" class="text-blue-400 underline decoration-blue-900">VIEW SOURCE</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500 font-bold">SHARE</button>
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
            body: JSON.stringify({ contents: [{ parts: [{ text: `Explain in 2 lines in Tamil: "${title}"` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);
        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) { alert("AI Busy! Try again."); }
    finally { button.innerHTML = originalText; button.disabled = false; }
}

// 4. Voice Search Functionality
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice search not supported in this browser.");
        return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => { 
        micBtn.innerHTML = "🔴"; 
        micBtn.classList.add("animate-pulse"); 
    };
    rec.onresult = (e) => { 
        const transcript = e.results[0][0].transcript; 
        document.getElementById('searchInput').value = transcript; 
        FetchNews(transcript); 
    };
    rec.onend = () => { 
        micBtn.innerHTML = "🎤"; 
        micBtn.classList.remove("animate-pulse"); 
    };
    rec.start();
}

// 5. Initialization and Splash Control
document.addEventListener('DOMContentLoaded', () => FetchNews());

function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if(splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 1000);
        }, 2500);
    }
});
function getRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}
