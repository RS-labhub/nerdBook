document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const booksContainer = document.getElementById('books-container');

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchBar.value.trim();
            fetchBooks(query);
        }
    });

    async function fetchBooks(query) {
        try {
            const response = await fetch(`http://localhost:5000/api/books?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            booksContainer.innerHTML = '<div class="col-12"><p>Error fetching books.</p></div>';
        }
    }

    function displayBooks(books) {
        booksContainer.innerHTML = ''; // Clear previous results
        if (books.length === 0) {
            booksContainer.innerHTML = '<div class="col-12"><p>No books found.</p></div>';
        } else {
            books.forEach(book => {
                const bookCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${book.image_url}" class="card-img-top" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.description}</p>
                                <a href="${book.pdf_url}" class="btn btn-primary me-2" target="_blank">Read Online</a>
                                <a href="${book.pdf_url}" download="${book.title}.pdf" class="btn btn-secondary">Download</a>
                            </div>
                        </div>
                    </div>
                `;
                booksContainer.innerHTML += bookCard;
            });
        }
    }
});
