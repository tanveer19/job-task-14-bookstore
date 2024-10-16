import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import LazyLoad from "react-lazy-load";

const Home = () => {
  const [showBooks, setShowBooks] = useState([]);
  useEffect(() => {
    fetch("https://gutendex.com/books")
      .then((res) => res.json())

      .then((data) => {
        console.log(data.results);
        setShowBooks(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
            <p>{book.authors?.[0]?.name}</p>
            <p>ID: {book.id}</p>
            <p>{book.subjects[0]}</p>
            <div className="card-actions ">
              <button className="btn btn-primary">Wishlist</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
