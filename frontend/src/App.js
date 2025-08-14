import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MyBookings from './components/MyBookings';
import Home from './components/Home';

// MUI Components
import { Container } from '@mui/material';

// Our Components
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyProfile from './components/MyProfile';
import CreateProfile from './components/CreateProfile';
import ServiceManagement from './components/ServiceManagement';
import ProviderList from './components/ProviderList';
import ProviderDetail from './components/ProviderDetail';
import BookingTest from './components/BookingTest';
import ProviderBookings from './components/ProviderBookings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<h2>Welcome to Project Servify!</h2>} />
            <Route path="/providers" element={<ProviderList />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/manage-services" element={<ServiceManagement />} />
            <Route path="/my-bookings" element={<MyBookings />} /> 
            <Route path="/booking-test" element={<BookingTest />} />
            <Route path="/provider/bookings" element={<ProviderBookings />} />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;