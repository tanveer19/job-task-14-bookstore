import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const Home = () => {
  const [showBooks, setShowBooks] = useState([]);
  useEffect(() => {
    fetch("https://gutendex.com/books")
      .then((res) => res.json())

      .then((data) => {
        console.log(data.results);
        setShowBooks(data.results);
      });
  }, []);

  return (
    <div className="flex flex-wrap max-w-7xl mx-auto">
      {showBooks.map((book) => (
        <div
          key={book.id}
          className="card card-compact bg-base-100 w-96 shadow-xl"
        >
          <figure>
            <img src={book.formats["image/jpeg"]} alt="" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{book.title}</h2>
            <div className="card-actions justify-center">
              <button className="btn btn-primary">Wishlist</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
