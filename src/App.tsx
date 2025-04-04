
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Mining from "./pages/Mining";
import Wallet from "./pages/Wallet";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Referrals from "./pages/Referrals";
import TransactionsPage from './pages/TransactionsPage'; 
import Chat from "./pages/chat"; // Import Chat Page
import Profile from "./pages/Profile"; // We'll create this file
import Careers from "./components/layout/careers";
import Contact from "./components/layout/contact";
import Privacy from "./components/layout/privacy";
import Terms from "./components/layout/terms";
import Cookies from "./components/layout/cookies";
import About from "./components/layout/about";
import MobileNavbar from "./components/layout/MobileNavbar"; // Import Mobile Navbar
import EarnMore from "./pages/EarnMore"; // Import Earn More component
import Guide from "./pages/Guide"; // Import Guide component

// Create a Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/EarnMore" element={<EarnMore />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/mining" element={<Mining />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/chat" element={<Chat />} /> 
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/about" element={<About />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/guide/:id" element={<Guide />} /> {/* Add the Guide route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNavbar /> 
          </Router>
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
