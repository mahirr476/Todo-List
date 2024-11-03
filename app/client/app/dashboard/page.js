import LogoutButton from "../logout/page";
import ProtectedRoute from "../protectedRoute/page";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
