const NEWS_API_KEY = '5f80b1e16f7319777551066795f66367'; 
const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

// BACKUP DATA: In case API fails, these will show up (Symposium Safety)
const backupNews = [
    { title: "OpenAI Announces GPT-5 Internal Testing Phases", url: "https://openai.com", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995" },
    { title: "NVIDIA reaches new milestone in AI Chip Production", url: "https://nvidia.com", image: "https://images.unsplash.com/photo-1591453088216-0bc4b9982405" },
    { title: "SpaceX Starship prepares for its next orbital flight", url: "https://spacex.com", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933" }
];

async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const query = inputField && inputField.value ? inputField.value : 'AI Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">🚀 SYNCING GLOBAL AI FEEDS...</p>';

    try {
        // Direct RSS to JSON (Most reliable for Free Tier)
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            displayNews(data.items);
        } else {
            // API FAILED? SHOW BACKUP NEWS
            displayNews(backupNews);
        }
    } catch (error) {
        // NETWORK FAILED? SHOW BACKUP NEWS
        displayNews(backupNews);
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article, index) => {
        const title = article.title;
        const link = article.link || article.url;
        // Use article image or a high-tech placeholder based on index
        const imageUrl = article.thumbnail || article.image || `https://loremflickr.com/400/250/technology,robot?lock=${index}`;
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full animate-in fade-in zoom-in duration-500">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News" onerror="this.src='https://via.placeholder.com/400x250?text=AI+Update'">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Source</a>
                        <button onclick="shareNews('${safeTitle}', '${link}')" class="text-green-500 text-[10px] font-bold uppercase">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(button, cleanTitle) {
    const originalText = button.innerText;
    button.innerText = "🤖 THINKING...";
    button.disabled = true;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Summarize in 2 lines in Tamil: " + cleanTitle }] }] })
        });
        const data = await res.json();
        if (data.candidates) {
            alert("🤖 TAMIL AI SUMMARY:\n\n" + data.candidates[0].content.parts[0].text);
        } else {
            alert("Gemini is busy. Try again!");
        }
    } catch (e) {
        alert("Summary error!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🗞️ " + title + "\n" + url), '_blank');
}

window.onload = FetchNews;
