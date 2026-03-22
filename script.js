// USING MEDIASTACK FOR GUARANTEED CONNECTION
const NEWS_API_KEY = '5f80b1e16f7319777551066795f66367'; 
const GEMINI_API_KEY = 'AIzaSyCThwqagkuuScbCqFphUyaAI5NA12RUrRk';

async function FetchNews() {
    const inputField = document.getElementById('searchInput');
    const query = inputField && inputField.value ? inputField.value : 'Technology';
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse font-mono text-sm">🚀 BOOTING AI NEWS ENGINE...</p>';

    try {
        // Secure HTTPS News API
        const url = `https://api.mediastack.com/v1/news?access_key=${NEWS_API_KEY}&keywords=${encodeURIComponent(query)}&languages=en&countries=in&limit=12`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayNews(data.data);
        } else {
            grid.innerHTML = '<p class="text-yellow-500 text-center col-span-full font-mono">No news found. Try "AI" or "Tesla".</p>';
        }
    } catch (error) {
        console.error("News Fetch Error:", error);
        grid.innerHTML = '<p class="text-red-500 text-center col-span-full font-mono uppercase tracking-widest">⚠️ API SYNC ERROR: RETRYING...</p>';
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach((article) => {
        // Handling missing images with a high-quality tech placeholder
        const imageUrl = article.image || `https://loremflickr.com/400/250/technology?lock=${Math.random()}`;
        const title = article.title;
        const safeTitleForAI = title.replace(/[^a-zA-Z0-9 ]/g, " ");

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full">
                <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-800 h-44">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="News Image" onerror="this.src='https://via.placeholder.com/400x250?text=Tech+News'">
                </div>
                <h3 class="font-bold text-[14px] mb-4 text-white leading-tight flex-grow">${title}</h3>
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${article.url}" target="_blank" class="text-blue-400 text-[10px] font-black uppercase tracking-tighter hover:underline">Read Source</a>
                        <button onclick="shareNews('${safeTitleForAI}', '${article.url}')" class="text-green-500 text-[10px] font-bold uppercase tracking-tighter">WhatsApp</button>
                    </div>
                    <button onclick="getAISummary(this, '${safeTitleForAI}')" 
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
                contents: [{ parts: [{ text: "Summarize this news in 2 short lines in Tamil: " + cleanTitle }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const summary = data.candidates[0].content.parts[0].text;
            alert("🤖 TAMIL AI SUMMARY:\n\n" + summary);
        } else {
            alert("AI is momentarily busy. Please try again!");
        }
    } catch (e) {
        alert("Summary Error! Check internet.");
    } finally {
        button.innerText = originalText;
        button.disabled = false;
    }
}

function shareNews(title, url) {
    window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("🗞️ " + title + "\n\nLink: " + url), '_blank');
}

window.onload = FetchNews;
