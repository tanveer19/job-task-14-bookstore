import React from "react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import BookSearch from "../BookSearch/BookSearch";
import { useEffect } from "react";

const Header = () => {
  const [searchText, setSearchText] = useState(""); // tracks user input
  const [books, setBooks] = useState([]); // stores fetched books
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // Debounced version of the search text
  const [loading, setLoading] = useState(false); // Loading state for API requests

  // Debounce the search input to prevent too many API calls

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  // Fetch books when the debounced search text changes

  useEffect(() => {
    if (debouncedSearchText) {
      setLoading(true); // start loading before fetch
      // Fetch books from Gutendex API with the correct search query
      fetch(`https://gutendex.com/books?search=${debouncedSearchText}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setBooks(data.results || []); // Ensure `data.results` is set or empty if no results
          setLoading(false); // Stop loading after fetch
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          setLoading(false); // Stop loading in case of error
        });
    } else {
      // Clear books if the search is empty
      setBooks([]);
    }
  }, [debouncedSearchText]);

  // Handle user input for search
  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update searchText on input change

    // handle empty search
    if (searchText.trim() === "") {
      return;
    }
  };
  return (
    <div>
      <div className="navbar bg-base-100 justify-center my-5 gap-4">
        <div className="">
          <NavLink to="/" className="btn btn-ghost text-xl">
            Bookstore
          </NavLink>
        </div>
        <div className="">
          <form>
            <div className="form-control relative">
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search books"
                className="input input-bordered w-32 md:w-96 bg-gray-100"
              />
              <FaMagnifyingGlass className="absolute top-4 right-5"></FaMagnifyingGlass>
            </div>
          </form>
        </div>
      </div>

      {/* Display search results based on the searchText state */}
      <div className="flex flex-col gap-3 max-w-full w-2/3 mx-auto bg-white rounded-xl p-3 text-center">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : searchText === "" ? (
          <p>Start typing to search for books...</p>
        ) : books.length > 0 ? (
          <BookSearch books={books} />
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  );
};

export default Header;
