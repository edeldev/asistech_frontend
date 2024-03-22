import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {

  return (
    <>
      <header className="header shadow">
        <div className="navigation">
          <Link to="/" className="home">
            AsisTech
          </Link>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default AuthLayout;
