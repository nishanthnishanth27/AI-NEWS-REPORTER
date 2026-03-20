const CURRENTS_API_KEY = 'nA7FhdKRgKuB4ur7Ce77_hTt7eVLaucj-MnL22RDcU7oqn8Z'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const userInput = document.getElementById('searchInput').value;
    // Simplified query for better results
    const query = userInput || 'India Technology'; 
    
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse text-sm font-mono">📡 SATELLITE LINK ESTABLISHED... FETCHING DATA...</p>';

    try {
        // Broad search with language filter
        const url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${CURRENTS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
            displayNews(data.news);
        } else {
            // Backup search if first one fails
            grid.innerHTML = `<p class="text-yellow-500 text-center col-span-full italic">Scanning backup servers... try searching "World".</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full italic">NETWORK ERROR. REFRESH PAGE.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const cleanTitle = article.title.replace(/['"]/g, "");
        const cleanDesc = article.description ? article.description.replace(/['"]/g, "") : "AI Analysis available.";
        const newsUrl = article.url;

        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-3xl hover:border-blue-500 transition-all duration-300 shadow-2xl flex flex-col h-full text-left group">
                <div class="relative overflow-hidden rounded-2xl mb-4">
                    <img src="${article.image !== 'None' ? article.image : 'https://via.placeholder.com/400x200?text=Live+Update'}" 
                         class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" 
                         onerror="this.src='https://via.placeholder.com/400x200?text=AI+News+Reporter'">
                </div>
                
                <h3 class="font-bold text-[13px] mb-3 text-white leading-tight">${article.title.slice(0, 85)}...</h3>
                
                <div class="mt-auto pt-4 border-t border-gray-800">
                    <div class="flex justify-between items-center mb-4">
                        <a href="${newsUrl}" target="_blank" class="text-blue-400 text-[9px] font-black tracking-tighter hover:text-white transition">READ FULL SOURCE</a>
                        <div class="flex gap-3">
                            <button onclick="shareNews('whatsapp', '${cleanTitle}', '${newsUrl}')" class="bg-green-600/20 px-2 py-1 rounded-md">
                                <span class="text-green-500 font-bold text-[9px]">WA</span>
                            </button>
                            <button onclick="shareNews('linkedin', '${cleanTitle}', '${newsUrl}')" class="bg-blue-600/20 px-2 py-1 rounded-md">
                                <span class="text-blue-400 font-bold text-[9px]">LI</span>
                            </button>
                        </div>
                    </div>
                    
                    <button onclick="getAISummary('${cleanTitle}', '${cleanDesc}')" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shadow-lg">
                        ✨ GET AI TAMIL SUMMARY
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

function shareNews(platform, title, url) {
    const text = encodeURIComponent(`🗞️ *AI News Alert*: ${title}\n\nView more on my AI Reporter: `);
    let shareUrl = platform === 'whatsapp' 
        ? `https://api.whatsapp.com/send?text=${text}${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
}

async function getAISummary(title, desc) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this news in 2 short lines in clear Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        alert("🤖 AI NEWS SUMMARY (Tamil):\n\n" + data.candidates[0].content.parts[0].text);
    } catch (e) {
        alert("AI processing error. Try again!");
    }
}

window.onload = fetchNews;
setInterval(() => {
    fetchNews();
}, 900000); 

