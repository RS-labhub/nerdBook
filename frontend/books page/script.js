async function fetchBooks() {
    const response = await fetch('https://api.mindsdb.com/sql/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_MINDSDB_API_KEY' // Replace with your MindsDB API key
        },
        body: JSON.stringify({
            query: 'SELECT * FROM ai_library.books;'
        })
    });

    const data = await response.json();
    return data.data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const books = await fetchBooks();
    const booksContainer = document.getElementById('books-container');

    function displayBooks(filteredBooks) {
        booksContainer.innerHTML = '';
        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.classList.add('col-md-4');
            bookCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.description}</p>
                        <a href="${book.download_link}" class="btn btn-primary" download>Download</a>
                        <a href="${book.read_online_link}" class="btn btn-secondary" target="_blank">Read Online</a>
                    </div>
                </div>
            `;
            booksContainer.appendChild(bookCard);
        });
    }

    displayBooks(books);

    document.getElementById('search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.description.toLowerCase().includes(searchTerm)
        );
        displayBooks(filteredBooks);
    });
});