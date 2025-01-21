import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Users from './pages/Users';
import GameDetail from './pages/GameDetail';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
