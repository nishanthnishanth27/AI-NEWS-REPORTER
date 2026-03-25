const GEMINI_API_KEY = 'AlzaSyCTheqaqkuuScbCqPpiyakl5NA1ZRuRRk';

// 1. Voice Search (Microphone)
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Mic not supported");

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

// 2. News Fetching logic
async function FetchNews(forcedQuery) {
    const query = forcedQuery || document.getElementById('searchInput').value || 'Technology';
    const grid = document.getElementById('newsGrid');
    
    grid.innerHTML = `<p class="text-center col-span-full text-blue-400 animate-pulse font-mono py-20">📡 SYNCING ${query.toUpperCase()} DATA...</p>`;

    try {
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const rssToJson = "https://api.rss2json.com/v1/api.json?rss_url=";

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
        const safeTitle = article.title.replace(/'/g, " ");
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)}?lock=${randomId}`;

        grid.innerHTML += `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all flex flex-col">
                <img src="${imageUrl}" class="w-full h-44 object-cover rounded-2xl mb-4 bg-gray-800">
                <h3 class="font-bold text-sm mb-4 line-clamp-2 flex-grow">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 text-[10px] font-black uppercase">
                    <a href="${article.link}" target="_blank" class="text-blue-400">Link</a>
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(article.link)}')" class="text-green-500">WhatsApp</button>
                </div>
                <button onclick="getAiSummary(this, '${safeTitle}')" class="w-full bg-blue-600 py-3 rounded-xl text-[10px] font-bold">
                    ✨ GET TAMIL AI SUMMARY
                </button>
            </div>`;
    });
}

// 3. AI Tamil Summary + Sentiment Analysis (Multi-Language Logic)
async function getAiSummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 AI ANALYZING...";
    button.disabled = true;
    window.speechSynthesis.cancel();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json
                
