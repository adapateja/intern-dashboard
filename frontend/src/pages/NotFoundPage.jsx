import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Page not found</p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
