import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LazyLoad from "react-lazy-load";

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the book details based on the ID
    fetch(`https://gutendex.com/books?ids=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data.results[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="flex justify-center m-5">
      <div className="card bg-base-100 w-96 shadow-xl p-3">
        <figure>
          <LazyLoad height={200} offset={100}>
            <img
              className="w-48 h-72"
              src={book.formats["image/jpeg"]}
              alt="book cover"
            />
          </LazyLoad>
        </figure>
        <div className="card-body">
          <h2 className="card-title text-center">{book.title}</h2>
          <p>Author: {book.authors?.[0]?.name ?? "Unknown"}</p>
          <p>ID: {book.id}</p>
          <p>
            {book.subjects ? book.subjects.join(", ") : "No subjects available"}
          </p>
          <p>Download Count: {book.download_count}</p>
          <a
            href={
              book.formats["text/html"] || book.formats["application/epub+zip"]
            }
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Read Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
