const NEWS_API_KEY = '538e1b1062024220b22a07c91d4e022d'; // NewsAPI Key
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const userInput = document.getElementById('searchInput').value;
    const query = userInput || 'India'; 
    
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-bounce">🚀 SEARCHING GLOBAL SATELLITES...</p>';

    try {
        // Using a different robust News API endpoint
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            // If everything fails, show a manual error but with detail
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">📡 No Live feed for "${query}". Try "Sports" or "Tech".</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full font-bold">⚠️ CONNECTION TIMEOUT. REFRESH!</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        // Filter out removed articles
        if (article.title === "[Removed]") return;

        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Summary available.";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all shadow-2xl flex flex-col h-full text-left group">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=Trending+News'}" 
                     class="w-full h-44 object-cover rounded-2xl mb-4 group-hover:scale-105 transition duration-500" 
                     onerror="this.src='https://via.placeholder.com/400x200'">
                
                <h3 class="font-bold text-[13px] mb-3 text-white leading-tight">${article.title.slice(0, 80)}...</h3>
                
                <div class="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-3">
                    <div class="flex justify-between items-center px-1">
                        <a href="${article.url}" target="_blank" class="text-blue-400 text-[9px] font-black hover:underline uppercase tracking-widest">Read Source</a>
                        <button onclick="shareNews('whatsapp', '${cleanTitle}', '${article.url}')" class="text-green-500 text-[10px] font-bold">SHARE WA</button>
                    </div>
                    
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">
                        ✨ GET TAMIL AI SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Reuse existing share and AI functions...
function shareNews(platform, title, url) {
    const text = encodeURIComponent(`📍 *AI Reporter*: ${title}\n\nLink: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`, '_blank');
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize in 2 short lines in Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI Summary (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) { alert("AI busy!"); }
}

window.onload = fetchNews;
