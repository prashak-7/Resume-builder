import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserProvider from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import EditResume from "./components/EditResume";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume/:id" element={<EditResume />} />
      </Routes>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
