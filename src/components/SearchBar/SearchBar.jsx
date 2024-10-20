import React, { useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import BookSearch from "../BookSearch/BookSearch";

const SearchBar = () => {
  const [searchText, setSearchText] = useState(""); // Tracks user input
  const [books, setBooks] = useState([]); // Stores fetched books
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // Debounced version of the search text
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [genreOptions, setGenreOptions] = useState([]); // Stores unique genres/topics
  const [selectedGenre, setSelectedGenre] = useState(""); // Selected genre for filtering

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
      setLoading(true); // Start loading before the fetch
      fetch(`https://gutendex.com/books?search=${debouncedSearchText}`)
        .then((res) => res.json())
        .then((data) => {
          const fetchedBooks = data.results || [];
          setBooks(fetchedBooks); // Set the fetched books
          extractGenres(fetchedBooks); // Extract unique genres from the books
          setLoading(false); // Stop loading after fetch
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          setLoading(false); // Stop loading in case of error
        });
    } else {
      setBooks([]); // Clear books if the search is empty
    }
  }, [debouncedSearchText]);

  // Function to extract unique genres or topics from the books
  const extractGenres = (books) => {
    const genres = new Set(); // Use a Set to avoid duplicates
    books.forEach((book) => {
      book.subjects?.forEach((subject) => {
        genres.add(subject);
      });
    });
    setGenreOptions([...genres]); // Convert Set to an array and set genre options
  };

  // Handle user input for search
  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update searchText on input change
  };

  // Handle genre selection from the dropdown
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value); // Update selected genre
  };

  // Filter books based on the selected genre
  const filteredBooks = selectedGenre
    ? books.filter((book) => book.subjects?.includes(selectedGenre))
    : books; // If no genre is selected (i.e. "All Genres"), show all books
  return (
    <div>
      <div>
        <form>
          <div className="form-control relative w-full max-w-xs mx-auto mb-4">
            <input
              type="text"
              value={searchText}
              onChange={handleSearch} // Call handleSearch on input change
              placeholder="Search books"
              className="input input-bordered w-full md:w-96 bg-gray-100 pr-10 "
            />
            <FaMagnifyingGlass className="absolute top-4 right-4 md:-right-10 text-gray-500"></FaMagnifyingGlass>
          </div>
        </form>
      </div>

      {/* Dropdown for selecting a genre */}

      <div className="form-control w-full max-w-xs mx-auto mb-4">
        <label className="label">
          <span className="label-text">Filter by Genre</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All Genres</option>
          {genreOptions.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Display search results based on the searchText and selectedGenre */}
      <div className="flex flex-col gap-3 max-w-full w-2/3 mx-auto bg-white rounded-xl p-3 text-center">
        {loading ? (
          <p>Loading...</p> // Show loading while fetching books
        ) : searchText === "" ? (
          <p>Start typing to search for books...</p> // Show this message when input is empty
        ) : filteredBooks.length > 0 ? (
          <BookSearch books={filteredBooks} />
        ) : (
          <p>No books found</p> // Show this only when no books match the filter
        )}
      </div>
    </div>
  );
};

export default SearchBar;
