const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Voice Search Logic
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Mic not supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
        micBtn.innerText = "🔴";
        micBtn.classList.add("text-red-500", "animate-pulse");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('searchInput').value = transcript;
        FetchNews(transcript);
    };

    recognition.onend = () => {
        micBtn.innerText = "🎤";
        micBtn.classList.remove("text-red-500", "animate-pulse");
    };
    recognition.start();
}

function FetchByCategory(category) {
    document.getElementById('searchInput').value = category;
    FetchNews(category);
}

// 2. Core News Fetching with Error Handling
async function FetchNews(forcedQuery) {
    const query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');
    
    // Show Loading Spinner
    grid.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="animate-spin inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-blue-400 font-bold animate-pulse uppercase tracking-widest">Live Syncing: ${query}</p>
        </div>`;

    try {
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

        const [tnData, engData] = await Promise.all([
            fetch(rssToJson + encodeURIComponent(tnRss)).then(r => r.json()),
            fetch(rssToJson + encodeURIComponent(engRss)).then(r => r.json())
        ]);

        let mixedNews = [];
        if (tnData.items) mixedNews.push(...tnData.items.slice(0, 8));
        if (engData.items) mixedNews.push(...engData.items.slice(0, 8));

        if (mixedNews.length > 0) {
            displayNews(mixedNews, query);
        } else {
            grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400 font-bold">No results found. Try again!</p>`;
        }
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 font-bold">Network Error! Reconnecting...</p>`;
    }
}

// 3. Display News UI
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = ''; 

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)}?lock=${randomId}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col shadow-2xl">
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800">
                <h3 class="font-bold text-sm mb-4 line-clamp-2 text-gray-100">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase tracking-tighter">
                    <a href="${article.link}" target="_blank" class="text-blue-400">Read More</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">Share</button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95">
                    ✨ AI INSIGHTS (TAMIL)
                </button>
            </div>`;
    });
}

// 4. AI Analysis Logic
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
                contents: [{ parts: [{ text: `Act as an AI Reporter. Analyze this: "${title}". Give a 2-line Tamil summary and state Sentiment (Positive/Negative).` }] }]
            })
        });

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;

        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);

        alert(`🚀 AI REPORT:\n\n${summary}`);
    } catch (e) {
        alert("AI Engine is busy!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

// 5. Autocomplete Suggestions
const trendingTopics = ["Tamil Nadu News", "TATA Stocks", "AI Innovations", "Machine Learning", "Python Coding", "IPL Updates", "Space Research"];

function showSuggestions(val) {
    const box = document.getElementById("suggestionBox");
    if (!val || val.trim().length < 1) {
        box.classList.add('hidden');
        return;
    }
    const filtered = trendingTopics.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
    if (filtered.length > 0) {
        box.classList.remove('hidden');
        box.innerHTML = filtered.map(item => `<div onclick="selectSuggestion('${item}')" class="p-4 hover:bg-blue-600/30 cursor-pointer border-b border-gray-800 text-sm text-gray-300">🔍 ${item}</div>`).join('');
    } else {
        box.classList.add('hidden');
    }
}

function selectSuggestion(val) {
    document.getElementById('searchInput').value = val;
    document.getElementById('suggestionBox').classList.add('hidden');
    FetchNews(val);
}

// 6. AUTO-UPDATE LOGIC (Every 60 Seconds)
setInterval(() => {
    const currentVal = document.getElementById('searchInput').value;
    FetchNews(currentVal);
}, 60000); 

// Start Initial Fetch
document.addEventListener('DOMContentLoaded', () => FetchNews());

// Click Outside to close suggestion
document.addEventListener('click', (e) => {
    const box = document.getElementById("suggestionBox");
    const input = document.getElementById("searchInput");
    if (e.target !== box && e.target !== input) box.classList.add('hidden');
});
