const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const grid = document.getElementById('newsGrid');
    
    // User search panna query, illana default-ah India level news edukum
    const query = (inputField && inputField.value && inputField.value.trim() !== "") ? inputField.value : 'Latest News';

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">📡 SYNCING TAMIL NADU & NATIONAL FEEDS...</p>';

    try {
        // 1. Tamil Nadu Local News (Tamil Language)
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        
        // 2. Other States / National News (English Language)
        const indiaRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' India')}&hl=en-IN&gl=IN&ceid=IN:en`;

        const rssToJsonBase = `https://api.rss2json.com/v1/api.json?rss_url=`;

        // Parallel Fetch for Speed
        const [tnRes, indiaRes] = await Promise.all([
            fetch(rssToJsonBase + encodeURIComponent(tnRss)),
            fetch(rssToJsonBase + encodeURIComponent(indiaRss))
        ]);

        const tnData = await tnRes.json();
        const indiaData = await indiaRes.json();

        // MIXING LOGIC: Combine TN and India news
        let mixedNews = [];
        const tnItems = tnData.items || [];
        const indiaItems = indiaData.items || [];

        // Interleaving: 1 TN news, then 1 India news
        const maxLen = Math.max(tnItems.length, indiaItems.length);
        for(let i = 0; i < 10; i++) {
            if (tnItems[i]) mixedNews.push(tnItems[i]);
            if (indiaItems[i]) mixedNews.push(indiaItems[i]);
        }

        if (mixedNews.length > 0) {
            displayNews(mixedNews);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No news found. Try searching "Politics" or "Sports".</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full">⚠️ CONNECTION ERROR.</p>';
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article, index) => {
        const title = article.title;
        const link = article.link;
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
        
        // Random visual based on India/TN context
        const imageUrl = `https://loremflickr.com/400/250/india,city?lock=${index + Math.random()}`;

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full animate-in fade-in slide-in-from-bottom-5">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News Image" onerror="this.src='https://via.placeholder.com/400x250?text=News+Update'">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline">Source</a>
                        <button onclick="shareNews('${safeTitle}', '${link}')" class="text-green-500 text-[10px] font-bold">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
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
    button.innerText = "🤖 AI IS THINKING...";
    button.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Explain this news briefly in 2 lines in Tamil: " + cleanTitle }] }]
            })
        });

        const data = await response.json();
        if (data.candidates) {
            alert("🤖 TAMIL AI SUMMARY:\n\n" + data.candidates[0].content.parts[0].text);
        } else {
            alert("AI is busy. Try again!");
        }
    } catch (e) {
        alert("Summary Connection Error!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🗞️ " + title + "\n" + url), '_blank');
}

// Attach Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    
