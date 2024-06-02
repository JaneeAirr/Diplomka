import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        navigate("/authentication/sign-in");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
      });
  }, [navigate]);

  return null;
}

export default Logout;
