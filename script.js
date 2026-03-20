const API_KEY = '1e44d26852ea47c39615d74d19af69ff'; 

async function fetchNews() {
    const query = document.getElementById('searchInput').value || 'Artificial Intelligence';
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '<p class="text-center col-span-full">Loading news...</p>';

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${API_KEY}`);
        const data = await response.json();
        
        displayNews(data.articles);
    } catch (error) {
        grid.innerHTML = '<p class="text-red-500">Error fetching news. Check API Key.</p>';
    }
}

function displayNews(articles) {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = '';

    articles.slice(0, 10).forEach(article => {
        const card = `
            <div class="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" class="w-full h-40 object-cover rounded-lg mb-4">
                <h3 class="font-bold text-lg mb-2">${article.title}</h3>
                <p class="text-gray-400 text-sm mb-4">${article.description ? article.description.slice(0, 100) + '...' : 'No description available'}</p>
                <div class="flex justify-between items-center">
                    <a href="${article.url}" target="_blank" class="text-blue-400 text-sm font-bold">Read More</a>
                    <button class="bg-green-600 text-xs px-3 py-1 rounded">AI Summary</button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Initial Fetch
fetchNews();

