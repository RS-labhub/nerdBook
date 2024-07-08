document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById('search-bar');
    const booksContainer = document.getElementById('content-container');

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchBar.value.trim();
            fetchBooks(query);
        }
    });

    const content = await fetchContent();
    const contentContainer = document.getElementById('content-container');

    function displayContent(filteredContent) {
        contentContainer.innerHTML = '';
        filteredContent.forEach(item => {
            const contentCard = document.createElement('div');
            contentCard.classList.add('col-md-4');
            contentCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                        <a href="${item.video_link}" class="btn btn-primary" target="_blank">Watch Video</a>
                        <a href="${item.notes_link}" class="btn btn-secondary" target="_blank">Read Notes</a>
                    </div>
                </div>
            `;
            contentContainer.appendChild(contentCard);
        });
    }

    displayContent(content);

    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredContent = content.filter(item => 
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        displayContent(filteredContent);
    });
});