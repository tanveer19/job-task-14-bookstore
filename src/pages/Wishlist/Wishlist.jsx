import React, { useState, useEffect } from "react";
import LazyLoad from "react-lazy-load";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Store wishlist IDs

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist); // Set wishlist IDs
    fetchWishlistBooks(storedWishlist);
  }, []);

  // Fetch wishlist books by ID
  const fetchWishlistBooks = (bookIds) => {
    if (bookIds.length === 0) return;

    // Fetch books by ID
    const promises = bookIds.map((id) =>
      fetch(`https://gutendex.com/books?ids=${id}`).then((res) => res.json())
    );

    Promise.all(promises)
      .then((booksData) => {
        const allBooks = booksData.map((data) => data.results[0]);
        setWishlistBooks(allBooks);
      })
      .catch((error) => {
        console.error("Error fetching wishlist books:", error);
      });
  };

  // Remove book from wishlist
  const toggleWishlist = (bookId) => {
    const updatedWishlist = wishlist.filter((id) => id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Update the wishlist display
    setWishlistBooks(wishlistBooks.filter((book) => book.id !== bookId));
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center m-5">
      {wishlistBooks.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        wishlistBooks.map((book) => (
          <div
            key={book.id}
            className="card card-compact bg-base-100 w-96 shadow-xl p-3"
          >
            <figure>
              <LazyLoad height={200} offset={100}>
                <img
                  className="w-48 h-72"
                  src={book.formats["image/jpeg"]}
                  alt="book cover"
                />
              </LazyLoad>
            </figure>
            <div className="card-body items-center">
              <h2 className="card-title text-center">{book.title}</h2>
              <p>Author: {book.authors?.[0]?.name ?? "Unknown"}</p>
              <p>ID: {book.id}</p>
              <p>{book.subjects[0]}</p>
              <div className="card-actions flex justify-center w-full">
                {/* Remove from Wishlist Button */}
                <button
                  className="text-red-500 text-2xl"
                  onClick={() => toggleWishlist(book.id)}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
