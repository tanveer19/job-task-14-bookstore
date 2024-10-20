import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import LazyLoad from "react-lazy-load";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const [showBooks, setShowBooks] = useState([]); // Books from the API
  const [wishlist, setWishlist] = useState([]); // Wishlisted book IDs

  // Fetch books from the API
  useEffect(() => {
    fetch("https://gutendex.com/books")
      .then((res) => res.json())
      .then((data) => {
        setShowBooks(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Toggle wishlist status for a book
  const toggleWishlist = (bookId) => {
    let updatedWishlist;
    if (wishlist.includes(bookId)) {
      // Remove from wishlist
      updatedWishlist = wishlist.filter((id) => id !== bookId);
    } else {
      // Add to wishlist
      updatedWishlist = [...wishlist, bookId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center m-5">
      {showBooks.map((book) => (
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
          <div className="card-body items-center ">
            <h2 className="card-title text-center">{book.title}</h2>
            <p>Author: {book.authors?.[0]?.name ?? "Unknown"}</p>
            <p>ID: {book.id}</p>
            <p>{book.subjects[0]}</p>
            <div className="card-actions flex justify-center w-full">
              {/* Heart Icon for Wishlist Toggle */}
              <button
                className="text-red-500 text-2xl"
                onClick={() => toggleWishlist(book.id)}
              >
                {wishlist.includes(book.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
