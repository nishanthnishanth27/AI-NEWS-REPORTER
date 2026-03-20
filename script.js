const GNEWS_API_KEY = '3713a2237ee5e9d2812b765100a5009f'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">🤖 AI Engine fetching live news...</p>';

    try {
        // GNews API URL structure
        const response = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&apikey=${GNEWS_API_KEY}`);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full">No news found. Try another topic!</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full">API Error. Check your GNews key.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.forEach(article => {
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const safeDesc = article.description ? article.description.replace(/'/g, "").replace(/"/g, "") : "No description";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition-all duration-300 shadow-2xl group flex flex-col h-full">
                <img src="${article.image || 'https://via.placeholder.com/400x200'}" class="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition">
                <h3 class="font-bold text-lg mb-2 text-blue-100">${article.title}</h3>
                <p class="text-gray-400 text-sm mb-6 flex-grow">${article.description ? article.description.slice(0, 100) + '...' : 'Click read full for more details.'}</p>
                <div class="flex justify-between items-center mt-auto">
                    <a href="${article.url}" target="_blank" class="text-blue-500 font-bold text-sm hover:underline text-xs">Read Full Article</a>
                    <button onclick="getAISummary('${safeTitle}', '${safeDesc}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition active:scale-95 shadow-lg shadow-blue-900/20">
                        AI Summary
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    if (!desc || desc === "No description") return alert("Summary panna content illai!");
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this news in 2 short lines in Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert("🤖 AI News Summary (Tamil):\n\n" + summary);
    } catch (e) {
        alert("Gemini AI is busy! Wait 10 seconds and try again.");
    }
}

fetchNews();
