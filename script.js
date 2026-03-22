const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const query = inputField && inputField.value ? inputField.value : 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono text-sm">🚀 SYNCING TAMIL & ENGLISH AI FEEDS...</p>';

    try {
        const enRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const taRss = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta-IN&gl=IN&ceid=IN:ta`;

        const enUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(enRss)}`;
        const taUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(taRss)}`;

        const [enRes, taRes] = await Promise.all([fetch(enUrl), fetch(taUrl)]);
        const enData = await enRes.json();
        const taData = await taRes.json();

        let mixedNews = [];
        const enItems = enData.items || [];
        const taItems = taData.items || [];
        const maxLength = Math.max(enItems.length, taItems.length);

        for (let i = 0; i < maxLength; i++) {
            if (taItems[i]) mixedNews.push(taItems[i]);
            if (enItems[i]) mixedNews.push(enItems[i]);
        }

        if (mixedNews.length > 0) {
            displayNews(mixedNews);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full">No news found. Try another topic!</p>';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full">⚠️ CONNECTION ERROR.</p>';
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article) => {
        const title = article.title.split(' - ')[0];
        
        // IMAGE FIX: If news has no thumbnail, use an AI/Tech placeholder from Unsplash
        const imageUrl = article.thumbnail || article.enclosure?.link || `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80`;
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800">
                    <img src="${imageUrl}" 
                         class="w-full h-44 object-cover hover:scale-110 transition-transform duration-700"
                         alt="News Image"
                         onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${article.link}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase hover:underline">Read Source</a>
                        <button onclick="shareNews('${title.replace(/'/g, "")}', '${article.link}')" class="text-green-500 text-[10px] font-bold">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${title.replace(/'/g, "\\'")}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
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
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Summarize this news title in 2 simple lines in Tamil: " + title }] }]
            })
        });
        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const summary = data.candidates[0].content.parts[0].text;
            alert("🤖 TAMIL AI SUMMARY:\n\n" + summary);
        } else {
            alert("AI is busy. Please try again in 2 seconds!");
        }
    } catch (e) {
        alert("Check your Internet or API Key!");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    const text = encodeURIComponent("🗞️ " + title + "\n\nFull Story: ");
    window.open("https://api.whatsapp.com/send?text=" + text + encodeURIComponent(url), '_blank');
}

window.onload = FetchNews;
