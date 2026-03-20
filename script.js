const API_KEY = '1e44d26852ea47c39615d74d19af69ff'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full text-blue-400 animate-pulse">🤖 AI Reporter is fetching news...</p>';

    try {
        // Corrected URL with no spaces
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`);
        const data = await response.json();
        
        if (data.status === "ok" && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            grid.innerHTML = `<p class="text-red-500 text-center col-span-full">News not found. Try another topic.</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full">Connection Error. Please check your internet or API key.</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.slice(0, 10).forEach(article => {
        // Cleaning strings to prevent JS errors in the button
        const safeTitle = article.title.replace(/'/g, "").replace(/"/g, "");
        const safeDesc = article.description ? article.description.replace(/'/g, "").replace(/"/g, "") : "No description";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition-all duration-300 shadow-2xl group">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" class="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition">
                <h3 class="font-bold text-lg mb-2 text-blue-100">${article.title}</h3>
                <p class="text-gray-400 text-sm mb-6">${article.description ? article.description.slice(0, 80) + '...' : 'Details in full article.'}</p>
                <div class="flex justify-between items-center mt-auto">
                    <a href="${article.url}" target="_blank" class="text-blue-500 font-bold text-sm hover:underline">Read Full</a>
                    <button onclick="getAISummary('${safeTitle}', '${safeDesc}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition active:scale-95 shadow-lg shadow-blue-900/20">
                        AI Summary
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    if (!desc || desc === "No description") return alert("Summary panna pothumana content illai!");
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this in 2 lines in Tamil: ${title}. ${desc}` }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert("🤖 AI Summary (Tamil):\n\n" + summary);
    } catch (e) {
        alert("AI Engine is busy. Try again after 10 seconds!");
    }
}

// Auto-run on load
fetchNews();
