import React, { useEffect, useState } from "react";
import SchedulePage from "./index"; // Update the path as needed

const App = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Simulate user login and storing email in localStorage
    const email = "teacher@example.com"; // Replace with actual user email
    localStorage.setItem("userEmail", email);
    setUserEmail(email);
  }, []);

  return (
    <div>
      <SchedulePage userEmail={userEmail} />
    </div>
  );
};

export default App;
