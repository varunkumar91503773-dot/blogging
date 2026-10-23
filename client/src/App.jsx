import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Profile from './pages/Profile';
import AuthorProfile from './pages/AuthorProfile';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="py-16 text-center text-zinc-500">Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/authors/:id" element={<AuthorProfile />} />
            <Route path="/create" element={<Protected><PostForm /></Protected>} />
            <Route path="/edit/:id" element={<Protected><PostForm /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
          </Routes>
          <footer className="mt-16 border-t border-white/10 py-6 text-center text-xs text-zinc-500">
            Inkwell · MERN Blogging Platform · React + Express + MongoDB
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
