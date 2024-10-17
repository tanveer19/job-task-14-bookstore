import React from "react";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import BookSearch from "../BookSearch/BookSearch";

const Header = () => {
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    // handle empty search
    if (searchText.trim() === "") {
      return;
    }

    // fetch
    fetch(`https://gutendex.com/books?search=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBooks(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
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
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search Books"
                className="input input-bordered w-32 md:w-96 bg-gray-100"
              />
              <button className="absolute top-4 right-5" onClick={handleSearch}>
                <FaMagnifyingGlass></FaMagnifyingGlass>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-center">
        {books.length > 0 && <BookSearch books={books}></BookSearch>}
      </div>
    </div>
  );
};

export default Header;
