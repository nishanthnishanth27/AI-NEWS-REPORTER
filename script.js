const API_KEY = '1e44d26852ea47c39615d74d19af69ff'; 
const GEMINI_API_KEY = 'AIzaSyCTNqWg9umScbCqFphUyaAI5NA12RUrKRk'; // Double check this key!

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full animate-pulse">Fetching latest news...</p>';

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${API_KEY}`);
        const data = await response.json();
        
        if(data.status === "ok") {
            displayNews(data.articles);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full">Error: ${error.message}</p>`;
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.slice(0, 10).forEach(article => {
        const title = article.title.replace(/'/g, "\\'");
        const desc = article.description ? article.description.replace(/'/g, "\\'") : "";
        
        const card = `
            <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-blue-500 transition shadow-xl">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" class="w-full h-48 object-cover rounded-xl mb-4">
                <h3 class="font-bold text-xl mb-2 text-white">${article.title}</h3>
                <p class="text-gray-400 text-sm mb-6">${article.description ? article.description.slice(0, 100) + '...' : 'No details available'}</p>
                <div class="flex justify-between items-center">
                    <a href="${article.url}" target="_blank" class="text-blue-400 font-medium text-sm">Read Full</a>
                    <button onclick="getAISummary('${title}', '${desc}')" class="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition">AI Summary</button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function getAISummary(title, desc) {
    if(!desc) return alert("Content pathalana summary panna mudiyadhu!");
    const prompt = `Summarize this news in 2 short lines in Tamil: Title: ${title}. Content: ${desc}`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        alert("🤖 AI Summary (Tamil):\n\n" + summary);
    } catch (e) {
        alert("AI limit reach aagi irukalam. Try again!");
    }
}

fetchNews();
