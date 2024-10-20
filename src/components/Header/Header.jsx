import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <div className="navbar bg-base-100 justify-center my-5 gap-4">
        <div>
          <NavLink to="/" className="btn text-xl mr-3">
            Bookstore
          </NavLink>
          <NavLink to="/wishlist" className="btn text-xl">
            Wishlist Books
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
