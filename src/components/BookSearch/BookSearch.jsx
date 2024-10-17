import React from "react";

const BookSearch = ({ books }) => {
  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>
          <h2>Title: {book.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default BookSearch;
