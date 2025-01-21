import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Scoreboard
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Games
          </Link>
          <Link to="/users" className="hover:text-blue-200">
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 
