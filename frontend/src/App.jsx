import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((response) => response.json())
      .then((data) => setBackendMessage(data.message))
      .catch((error) => console.log("Backend error:", error));
  }, []);

  const handleLogin = (email) => {
  if (email.includes("admin")) {
    setUserRole("admin");
  } else if (email.includes("manager")) {
    setUserRole("manager");
  } else {
    setUserRole("employee");
  }
};
if (userRole === "admin") {
  return <AdminDashboard onLogout={() => setUserRole(null)} />;
}

  if (userRole === "manager") {
    return <ManagerDashboard onLogout={() => setUserRole(null)} />;
  }

  if (userRole === "employee") {
    return (
      <Dashboard
        onLogout={() => setUserRole(null)}
        backendMessage={backendMessage}
      />
    );
  }

  return <Login onLogin={handleLogin} />;
}

export default App;