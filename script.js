const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Core Fetching with Fresh Data Logic
async function FetchNews(forcedQuery) {
    // 1. Define the query first
    let query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');
   // 2. Then check if it is 'Local'
    if (query === 'Local') {
        query = 'site:tamil.oneindia.com'; 
    }
    // Initializing state with spinner
    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse tracking-widest uppercase">Syncing Live: ${query}</p>
        </div>`;

    try {
        // Cache busting: Har vaati unique URL create pannum
        const ts = new Date().getTime(); 
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta&v=${ts}`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en&v=${ts}`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

        const [tnData, engData] = await Promise.all([
            fetch(`${rssToJson}${encodeURIComponent(tnRss)}&nocache=${ts}`).then(r => r.json()),
            fetch(`${rssToJson}${encodeURIComponent(engRss)}&nocache=${ts}`).then(r => r.json())
        ]);

        let allNews = [];
        if (tnData.items) allNews.push(...tnData.items);
        if (engData.items) allNews.push(...engData.items);

        // IMPORTANT: New News mela vara date sorting
        allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        if (allNews.length > 0) {
            displayNews(allNews.slice(0, 16), query);
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No fresh news found for "${query}".</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold">Network Busy. Retrying in 5 seconds...</p>`;
        setTimeout(() => FetchNews(query), 5000);
    }
}

// 2. Display UI with Live Timestamps
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        // Format date to local time
const keywords = safeTitle.split(' ').slice(0, 2).join(','); 
const randomId = Math.floor(Math.random() * 8000);
const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${randomId}`;
        
const keywords = safeTitle.split(' ').slice(0, 2).join(','); 
const randomId = Math.floor(Math.random() * 8000);
const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(keywords)}?lock=${randomId}`;
        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col shadow-2xl relative overflow-hidden group">
                <div class="absolute top-4 right-4 bg-blue-600 text-[8px] font-bold px-2 py-1 rounded-full z-10 shadow-lg">LATEST</div>
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800 group-hover:scale-105 transition-transform duration-500">
                <div class="text-[9px] text-gray-500 font-bold mb-2">🕒 ${timeStr} | 📅 ${dateStr}</div>
                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black">
                    <a href="${article.link}" target="_blank" class="text-blue-400 hover:text-white underline">VIEW SOURCE</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">WHATSAPP</button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-[10px] font-black tracking-widest shadow-lg active:scale-95 transition-all">
                    ✨ GET AI TAMIL SUMMARY
                </button>
            </div>`;
    });
}

// 3. AI Insights Logic (No-Error Version)
async function getAiSummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 ANALYZING...";
    button.disabled = true;
    window.speechSynthesis.cancel();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Explain this news in 2 short lines in Tamil: "${title}"` }] }]
            })
        });

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);

        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) {
        alert("AI Engine is busy. Please try again!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

// 4. Auto-Refresh every 3 minutes for "New News"
setInterval(() => {
    const q = document.getElementById('searchInput').value;
    FetchNews(q);
}, 180000); 

document.addEventListener('DOMContentLoaded', () => FetchNews());

function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// 5. Voice Search
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.onstart = () => { micBtn.innerText = "🔴"; micBtn.classList.add("animate-pulse"); };
    rec.onresult = (e) => { 
        const t = e.results[0][0].transcript; 
        document.getElementById('searchInput').value = t; 
        FetchNews(t); 
    };
    rec.onend = () => { micBtn.innerText = "🎤"; micBtn.classList.remove("animate-pulse"); };
    rec.start();
}
// Splash Screen Timeout Logic
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        splash.style.opacity = '0'; // Smooth fade out
        setTimeout(() => {
            splash.style.display = 'none'; // Completely remove
        }, 1000);
    }, 2500); // 2.5 seconds delay
});

