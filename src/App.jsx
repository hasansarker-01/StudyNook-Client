
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRoom from "./pages/AddRoom";
import MyListings from "./pages/MyListings";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            borderRadius: "12px",
                            padding: "12px 16px",
                        },
                    }}
                />

                <Routes>
                    {/* Public pages */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/rooms/:id" element={<RoomDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Protected pages */}
                    <Route element={<PrivateLayout />}>
                        <Route path="/add-room" element={<AddRoom />} />
                        <Route path="/my-listings" element={<MyListings />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
