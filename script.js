const GEMINI_API_KEY = 'AIzaSyCTheqagkuuScbCqFphiyakl5NA12RURrk'; 

// 1. Voice Search (Microphone) Logic
function startVoiceSearch() {
    const micBtn = document.getElementById('micBtn');
    const inputField = document.getElementById('searchInput');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice search not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Search logic is better in English

    recognition.onstart = () => {
        micBtn.innerText = "🛑"; 
        micBtn.classList.add("text-red-500", "animate-pulse");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
        FetchNews(transcript); // Automatically starts searching
    };

    recognition.onend = () => {
        micBtn.innerText = "🎤";
        micBtn.classList.remove("text-red-500", "animate-pulse");
    };

    recognition.start();
}

// 2. Category Click Logic
function FetchByCategory(category) {
    const inputField = document.getElementById('searchInput');
    if(inputField) inputField.value = category;
    FetchNews(category);
}

// 3. News Fetching Engine (Interleaved Tamil & English)
async function FetchNews(forcedQuery) {
    const inputField = document.getElementById('searchInput');
    const grid = document.getElementById('newsGrid');
    const query = forcedQuery || (inputField && inputField.value ? inputField.value : 'Latest Technology');

    grid.innerHTML = `<p class="text-center col-span-full text-blue-400 animate-pulse font-mono py-20">📡 SYNCING ${query.toUpperCase()} NEWS...</p>`;

    try {
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const rssToJsonBase = 'https://api.rss2json.com/v1/api.json?rss_url=';

        const [tnRes, engRes] = await Promise.all([
            fetch(rssToJsonBase + encodeURIComponent(tnRss)).then(r => r.json()).catch(() => ({items:[]})),
            fetch(rssToJsonBase + encodeURIComponent(engRss)).then(r => r.json()).catch(() => ({items:[]}))
        ]);

        let mixedNews = [];
        const tnItems = tnRes.items || [];
        const engItems = engRes.items || [];

        // Mix 10 news items
        for(let i = 0; i < 10; i++) {
            if (tnItems[i]) mixedNews.push(tnItems[i]);
            if (engItems[i]) mixedNews.push(engItems[i]);
        }

        if (mixedNews.length > 0) displayNews(mixedNews, query);
        else grid.innerHTML = `<p class="text-yellow-500 text-center col-span-full py-20">No news found. Try another keyword!</p>`;
        
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full py-20">⚠️ CONNECTION ERROR. CHECK API LIMIT.</p>`;
    }
}

// 4. News Card Display
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article) => {
        const safeTitle = article.title.replace(/[^a-zA-Z0-9 ]/g, " ");
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)}?lock=${randomId}`;

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-xl flex flex-col h-full">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News Image">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white line-clamp-2 flex-grow">${article.title}</h3>
                <div class="flex justify-between items-center mb-4 px-1">
                    <a href="${article.link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Full Story</a>
                    <button onclick="shareOnWhatsApp('${safeTitle}', '${article.link}')" class="text-green-500 text-[10px] font-black uppercase">WhatsApp</button>
                </div>
                <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                    ✨ GET TAMIL AI SUMMARY
                </button>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// 5. Gemini AI Tamil Summary + Voice Reader
async function getAISummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 THINKING...";
    button.disabled = true;

    // Stop any existing speech
    window.speechSynthesis.cancel();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Explain this news in 2 short lines in Tamil language: " + title }] }] })
        });
        
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;

        // Voice Reader Logic
        const speech = new SpeechSynthesisUtterance(summary);
        speech.lang = 'ta-IN'; // Tamil India
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);

        alert("🤖 TAMIL AI SUMMARY:\n\n" + summary);

    } catch (e) {
        alert("AI Limit Reached! Try again in 30 seconds.");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareOnWhatsApp(title, url) {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("🗞️ " + title + "\n\nLink: " + url)}`, '_blank');
}

// Initial News Load
document.addEventListener('DOMContentLoaded', () => FetchNews());
