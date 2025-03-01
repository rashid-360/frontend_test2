import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoanUsernav() {
  const navigate = useNavigate();

  // Function to extract username from JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("user_access_token"); // Get stored token
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode JWT
        return decoded.username || "Unknown User"; // Return username or default
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    return "Unknown User"; // Default username if token is missing/invalid
  };

  const handleLogout = () => {
    // Clear user tokens
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_refresh_token");

    // Redirect to home/login page
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-background border-b border-primary/20 shadow-md z-50">
        {/* Left Side: Loan Management System */}
        <span className="text-xl font-semibold">Loan Management System</span>

        {/* Right Side: Username and Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">{getUsernameFromToken()}</span>
          <Button 
            variant="outline" 
            className="text-red-600 flex items-center"
            onClick={handleLogout} // Call the logout function on click
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </nav>

      {/* Add margin below navbar to prevent overlap */}
      <div className="mt-16"></div>
    </>
  );
}

export default LoanUsernav;
