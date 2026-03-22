const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const query = inputField && inputField.value ? inputField.value : 'Technology';
    const grid = document.getElementById('newsGrid');

    // Loading State
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono text-sm">🚀 SYNCING TAMIL & ENGLISH AI FEEDS...</p>';

    try {
        // 1. URLs for English and Tamil News
        const enRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const taRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta`;

        const enUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(enRss)}`;
        const taUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(taRss)}`;

        // 2. Fetching both simultaneously
        const [enRes, taRes] = await Promise.all([fetch(enUrl), fetch(taUrl)]);
        const enData = await enRes.json();
        const taData = await taRes.json();

        // 3. Mixing Logic (Interleaving)
        let mixedNews = [];
        const enItems = enData.items || [];
        const taItems = taData.items || [];
        const maxLength = Math.max(enItems.length, taItems.length);

        for (let i = 0; i < maxLength; i++) {
            if (taItems[i]) mixedNews.push(taItems[i]);
            if (enItems[i]) mixedNews.push(enItems[i]);
        }

        if (mixedNews.length > 0) {
            displayNews(mixedNews, query);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No news found. Try another topic!</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full">⚠️ CONNECTION ERROR. CHECK INTERNET.</p>';
    }
}

function displayNews(articles, searchQuery) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article) => {
        // Clean Title
        const title = article.title.split(' - ')[0];
        
        // Dynamic Image Logic based on Search Query
        const randomId = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/400/250/${encodeURIComponent(searchQuery)}?lock=${randomId}`;
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" 
                         class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                         alt="News Visual"
                         loading="lazy">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${article.link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Read Source</a>
                        <button onclick="shareNews('${title.replace(/'/g, "")}', '${article.link}')" class="text-green-500 text-[10px] font-bold">WhatsApp</button>
                    </div>
                    <!-- Trigger AI Summary -->
                    <button onclick="getAISummary(this, '${title.replace(/'/g, "")}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(button, title) {
    const originalText = button.innerText;
    button.innerText = "🤖 AI IS THINKING...";
    button.disabled = true;

    try {
        // Cleaning title of all special characters that crash JSON
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, " ");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: "Summarize this news in exactly 2 short lines in Tamil language: " + cleanTitle }] 
                }]
            })
        });

        const data = await response.json();

        // Safe check for API response path
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
            const summary = data.candidates[0].content.parts[0].text;
            alert("🤖 TAMIL AI SUMMARY:\n\n" + summary);
        } else {
            console.error("API Error Response:", data);
            alert("AI is momentarily busy. Please try again!");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        alert("Connection Error! Check internet or API key.");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    const text = encodeURIComponent("🗞️ " + title + "\n\nFull Story: ");
    window.open("https://api.whatsapp.com/send?text=" + text + encodeURIComponent(url), '_blank');
}

// Start app
window.onload = FetchNews;
