import React from "react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import BookSearch from "../BookSearch/BookSearch";
import { useEffect } from "react";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearchText) {
      // fetch
      fetch(`https://gutendex.com/books?q=${debouncedSearchText}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setBooks(data.results);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [debouncedSearchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);

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
              <button className="absolute top-4 right-5" onClick={handleSearch}>
                <FaMagnifyingGlass></FaMagnifyingGlass>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-3 max-w-full w-2/3 mx-auto bg-white rounded-xl p-3">
        {books.length > 0 && <BookSearch books={books}></BookSearch>}
      </div>
    </div>
  );
};

export default Header;
