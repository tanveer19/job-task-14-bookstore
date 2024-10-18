import React from "react";

const BookSearch = ({ books }) => {
  return (
    <>
      {books.map((book) => (
        <div key={book.id} className="flex items-center gap-3 border p-1 ">
          {book.formats && book.formats["image/jpeg"] ? (
            <img
              className="w-8 h-8"
              src={book.formats["image/jpeg"]}
              alt="book cover"
            />
          ) : (
            <p className="text-red-300">No Image available</p>
          )}
          <h2> {book.title}</h2>
        </div>
      ))}
    </>
  );
};

export default BookSearch;
