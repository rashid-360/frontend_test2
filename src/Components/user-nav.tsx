import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Usernav() {
  const navigate = useNavigate();

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("admin_access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.username || "Unknown User";
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    return "Unknown User";
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    navigate("/admin/login/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-background border-b border-primary/20 shadow-md z-50">
        {/* Left Side: Loan Management System */}
        <span className="text-xl font-semibold">Admin Panel</span>

        {/* Right Side: Username and Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">{getUsernameFromToken()}</span>
          <Button 
            variant="outline" 
            className="text-red-600 flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </nav>

      {/* Add margin below navbar to prevent overlap */}
      <div className="mt-20"></div>
    </>
  );
}

export default Usernav;
