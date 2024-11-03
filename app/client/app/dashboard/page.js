
import ProtectedRoute from "../protectedRoute/page";
import Header from "../header/page";
import Navbar from "../navbar/page";
const Dashboard = () => {
  return (
    <ProtectedRoute>
   <div className="flex justify-between">
          <Header/>
          <Navbar/>
        </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
