const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

// 1. Category Button Click Logic
function FetchByCategory(category) {
    const inputField = document.getElementById('searchInput');
    if(inputField) {
        inputField.value = category; // Input box-la category name-ah mathum
    }
    FetchNews(category); // Automatic-ah news-ah trigger pannum
}

// 2. Optimized Fetch News Function
async function FetchNews(forcedQuery) {
    const inputField = document.getElementById('searchInput');
    const grid = document.getElementById('newsGrid');
    
    // Buttons click panna forcedQuery edukkum, illana search box value edukkum
    const query = forcedQuery || (inputField && inputField.value ? inputField.value : 'Technology');

    grid.innerHTML = `<p class="text-center col-span-full text-blue-400 animate-pulse font-mono">📡 SYNCING ${query.toUpperCase()} FEEDS...</p>`;

    try {
        // Multi-language RSS Feeds
        const tnRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' Tamil Nadu')}&hl=ta-IN&gl=IN&ceid=IN:ta`;
        const engRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        
        const rssToJsonBase = `https://api.rss2json.com/v1/api.json?rss_url=`;

        const [tnRes, engRes] = await Promise.all([
            fetch(rssToJsonBase + encodeURIComponent(tnRss)).catch(() => null),
            fetch(rssToJsonBase + encodeURIComponent(engRss)).catch(() => null)
        ]);

        const tnData = tnRes ? await tnRes.json() : { items: [] };
        const engData = engRes ? await engRes.json() : { items: [] };

        let mixedNews = [];
        const tnItems = tnData.items || [];
        const engItems = engData.items || [];

        // Mix 1 TN news and 1 National news (Interleaving)
        const count = Math.max(tnItems.length, engItems.length);
        for(let i = 0; i < 10; i++) {
            if (tnItems[i]) mixedNews.push(tnItems[i]);
            if (engItems[i]) mixedNews.push(engItems[i]);
        }

        if (mixedNews.length > 0) {
            displayNews(mixedNews, query);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No news found for this category.</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full">⚠️ CONNECTION ERROR.</p>';
    }
}

// 3. Display News Cards
function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article, index) => {
        const title = article.title;
        const link = article.link || "#";
        const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");
        
        // Dynamic Image based on Search Query
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)},tech?lock=${randomId}`;

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full animate-in fade-in slide-in-from-bottom-5">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Full Story</a>
                        <button onclick="shareNews('${safeTitle}', '${link}')" class="text-green-500 text-[10px] font-bold">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitle}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// 4. Gemini AI Summary
async function getAISummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 THINKING...";
    button.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Explain this news in 2 lines in Tamil language: " + title }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert("🤖 TAMIL AI SUMMARY:\n\n" + summary);
    } catch (e) {
        alert("AI Error: Key busy or limit reached. Wait 30 seconds!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🗞️ News: " + title + "\n" + url), '_blank');
}

// Initial Load & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    FetchNews();
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') FetchNews();
        });
    }
});
