import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Page from "./app/Page"
import AdminLogin from "./Pages/AdminLogin";
import LoansPage from "./app/adminpage";
import LoanDetailPage from "./app/admin/loans/details/page";
import { Toaster } from "react-hot-toast";
import MessageHandler from "./components/MessageHandler";
function App() {
  return (<>

    <Router>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Page/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/loans" element={<LoansPage/>}/>
          <Route path="/admin/loans/detail" element={<LoanDetailPage/>}/>
        </Routes>
      </div>
    </Router>
  </>
  );
}

export default App;
