const GEMINI_API_KEY = 'AIzaSyCTheqagkuuScbCqFphiyakl5NA12RURrk';

// 1. Voice Search (Microphone)
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return alert("Mic not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
        micBtn.innerText = "🛑";
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

// 2. News Fetching logic (Fixed syntax from your screenshots)
async function FetchNews(forcedQuery) {
    const query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = `<p class="text-center col-span-full text-blue-400 animate-pulse font-mono py-20">📡 SYNCING ${query.toUpperCase()}...</p>`;

    try {
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const rssToJson = 'https://api.rss2json.com/v1/api.json?rss_url=';

        const [tnData, engData] = await Promise.all([
            fetch(rssToJson + encodeURIComponent(tnRss)).then(r => r.json()),
            fetch(rssToJson + encodeURIComponent(engRss)).then(r => r.json())
        ]);

        let mixedNews = [];
        const tItems = tnData.items || [];
        const eItems = engData.items || [];

        for(let i = 0; i < 12; i++) {
            if (tItems[i]) mixedNews.push(tItems[i]);
            if (eItems[i]) mixedNews.push(eItems[i]);
        }

        if (mixedNews.length > 0) displayNews(mixedNews, query);
        else grid.innerHTML = `<p class="col-span-full text-center py-20">No News Found.</p>`;
        
    } catch (e) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20">⚠️ API Error. Refresh!</p>`;
    }
}

function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/[^a-zA-Z0-9 ]/g, " ");
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)}?lock=${randomId}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col h-full shadow-lg">
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800">
                <h3 class="font-bold text-sm mb-4 line-clamp-2 flex-grow">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <a href="${article.link}" target="_blank" class="text-blue-400">Link</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">WhatsApp</button>
                </div>
                <button onclick="getAISummary(this, '${safeTitle}')" class="w-full bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                    ✨ GET TAMIL AI SUMMARY
                </button>
            </div>`;
    });
}

// 3. AI Tamil Summary + Voice Reader
async function getAiSummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 AI ANALYZING...";
    button.disabled = true;

    try {
        // Multi-language prompt engineering (Pythonic Logic)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Act as a Data Scientist. Analyze this news title: "${title}". 
                    1. Provide a 2-line summary in Tamil.
                    2. Categorize the sentiment as [POSITIVE], [NEGATIVE], or [NEUTRAL].` }]
                }]
            })
        });

        const data = await response.json();
        const fullResponse = data.candidates[0].content.parts[0].text;

        // Displaying with mass effect
        alert(`🚀 AI INSIGHTS:\n\n${fullResponse}`);
        
        // Voice reader still works
        const speech = new SpeechSynthesisUtterance(fullResponse);
        speech.lang = 'ta-IN';
        window.speechSynthesis.speak(speech);

    } catch (e) {
        alert("AI Engine Busy!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

}
document.addEventListener('DOMContentLoaded', () => FetchNews());
// 4. Smart Search Logic
const trendingTopics = [
    "Tamil Nadu News", "TATA Stocks", "AI Innovations", "Machine Learning", 
    "IPL Updates", "Cinema News", "Education Policy", "Weather Today",
    "Space Research", "Stock Market India", "Startup India", "Python Programming"
];

function showSuggestions(val) {
    const box = document.getElementById('suggestionBox');
    if (!val || val.trim().length < 1) {
        box.classList.add('hidden');
        return;
    }

    const filtered = trendingTopics.filter(topic => 
        topic.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5); 

    if (filtered.length > 0) {
        box.classList.remove('hidden');
        box.innerHTML = filtered.map(item => `
            <div onclick="selectSuggestion('${item}')" class="p-4 hover:bg-blue-600/30 cursor-pointer border-b border-gray-800 last:border-0 text-sm font-medium text-gray-300 flex items-center gap-3">
                <span class="text-blue-500">🔍</span> ${item}
            </div>
        `).join('');
    } else {
        box.classList.add('hidden');
    }
}

function selectSuggestion(val) {
    document.getElementById('searchInput').value = val;
    document.getElementById('suggestionBox').classList.add('hidden');
    FetchNews(val); 
}

// Hide box when clicking outside
document.addEventListener('click', (e) => {
    const box = document.getElementById('suggestionBox');
    const input = document.getElementById('searchInput');
    if (e.target !== box && e.target !== input) {
        box.classList.add('hidden');
    }
});
