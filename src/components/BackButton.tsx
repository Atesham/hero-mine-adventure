import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Back Icon
import { useEffect } from "react";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Save scroll position before navigating away
    const saveScrollPosition = () => {
      sessionStorage.setItem(`scrollPosition-${location.pathname}`, window.scrollY.toString());
    };
    window.addEventListener("beforeunload", saveScrollPosition);
    return () => window.removeEventListener("beforeunload", saveScrollPosition);
  }, [location.pathname]);

  const handleBack = () => {
    const previousPath = sessionStorage.getItem("previousPath");
    const prevScroll = sessionStorage.getItem(`scrollPosition-${previousPath}`);

    navigate(-1); // Navigate Back

    // Restore scroll position
    if (prevScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(prevScroll));
      }, 100);
    }
  };
  // if (location.pathname === "/") return null;

    // Hide back button on specific routes
    const hiddenRoutes = ["/", "/mining", "/wallet", "/leaderboard"];
    if (hiddenRoutes.includes(location.pathname)) return null;
    
  return (
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
