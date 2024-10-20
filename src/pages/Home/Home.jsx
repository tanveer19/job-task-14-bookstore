import React, { useState, useEffect } from "react";
import LazyLoad from "react-lazy-load";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SearchBar from "../../components/SearchBar/SearchBar";
import { Link } from "react-router-dom";

const Home = () => {
  const [showBooks, setShowBooks] = useState([]); // Books to display
  const [wishlist, setWishlist] = useState([]); // Wishlisted books
  const [loading, setLoading] = useState(false); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const pageLimit = 5; // Limit the number of page buttons to show at once

  // Function to fetch books for the current page
  const fetchBooks = (page) => {
    setLoading(true);
    fetch(`https://gutendex.com/books/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setShowBooks(data.results);
        setTotalPages(Math.ceil(data.count / 32)); // Assuming 32 books per page
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Fetch books on component mount and whenever the page changes
  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Toggle wishlist status for a book
  const toggleWishlist = (bookId) => {
    let updatedWishlist;
    if (wishlist.includes(bookId)) {
      updatedWishlist = wishlist.filter((id) => id !== bookId);
    } else {
      updatedWishlist = [...wishlist, bookId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate array of page numbers for pagination, with ellipsis
  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    const endPage = Math.min(totalPages, startPage + pageLimit - 1);

    if (startPage > 1) {
      pages.push(
        <button key="first" className="btn" onClick={() => handlePageChange(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-dots" className="btn">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${currentPage === i ? "btn-active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-dots" className="btn">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key="last"
          className="btn"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <SearchBar></SearchBar>
      <div className="flex flex-col items-center m-5">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center">
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
                  <div className="card-body items-center">
                    <h2 className="card-title text-center">{book.title}</h2>
                    <p>Author: {book.authors?.[0]?.name ?? "Unknown"}</p>
                    <p>ID: {book.id}</p>
                    <p>{book.subjects[0]}</p>
                    <div className="card-actions flex justify-center items-center w-full">
                      {/* link to book details page */}
                      <Link to={`/book/${book.id}`} className="btn btn-primary">
                        View Details
                      </Link>

                      {/* Heart Icon for Wishlist Toggle */}
                      <button
                        className="text-red-500 text-2xl"
                        onClick={() => toggleWishlist(book.id)}
                      >
                        {wishlist.includes(book.id) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center flex-wrap overflow-x-auto m-2 space-x-2 space-y-1 py-4">
              <button
                className={`btn ${currentPage === 1 ? "btn-disabled" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {renderPageNumbers()}

              <button
                className={`btn ${
                  currentPage === totalPages ? "btn-disabled" : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
