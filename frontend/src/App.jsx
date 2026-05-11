import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventListing from './pages/EventListing';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/events/new" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-gray-500">
        <p>&copy; 2026 EventManage System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
