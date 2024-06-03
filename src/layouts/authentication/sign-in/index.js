import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgSignIn from "assets/images/background-basic-auth.webp";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import db from "../../../firebase";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", open: false });

  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleRoleChange = (role) => setUserRole(role);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "", open: false });

    if (!email || !password) {
      setAlert({ type: "warning", message: "All fields must be filled out.", open: true });
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in successfully:", user);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const storedUserRole = userData.role;

        const roleToCheck = userRole || "admin";

        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", storedUserRole);

        if (storedUserRole === roleToCheck) {
          if (storedUserRole === "admin") {
            navigate("/admin/dashboard");
          } else if (storedUserRole === "teacher") {
            navigate("/teacher/dashboard");
          } else if (storedUserRole === "student") {
            navigate("/student/dashboard");
          }
        } else {
          setAlert({ type: "error", message: "Selected role does not match the stored role.", open: true });
        }
      } else {
        setAlert({ type: "error", message: "No user found with the provided user ID.", open: true });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      if (error.code === "auth/user-not-found") {
        setAlert({ type: "error", message: "No user found with this email.", open: true });
      } else if (error.code === "auth/wrong-password") {
        setAlert({ type: "error", message: "Incorrect password.", open: true });
      } else {
        setAlert({ type: "error", message: "An unexpected error occurred. Please try again.", open: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <CoverLayout
        title="Welcome!"
        color="white"
        image={bgSignIn}
        premotto="COLLEGE MANAGEMENT"
        motto="by Daniil Shekhovtsov"
        cardContent
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 0,
        }}
      >
        <GradientBorder borderRadius={borders.borderRadius.form} width="100%" maxWidth="440px">
          <VuiBox
            component="form"
            role="form"
            borderRadius="inherit"
            p="45px"
            sx={({ palette: { secondary } }) => ({
              backgroundColor: secondary.focus,
              width: "100%",
              mx: "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "rgb(15, 21, 53)",
            })}
            onSubmit={handleSignIn}
          >
            <VuiTypography
              color="white"
              fontWeight="bold"
              textAlign="center"
              mb="24px"
              sx={{
                fontSize: "2rem",
              }}
            >
              Sign In
            </VuiTypography>

            <VuiTypography color="white" textAlign="center" mb="24px">
              Select Role
            </VuiTypography>
            <Stack direction="row" spacing={2} justifyContent="center" mb="24px">
              <Button
                variant={userRole === "student" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleRoleChange("student")}
              >
                Student
              </Button>
              <Button
                variant={userRole === "teacher" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleRoleChange("teacher")}
              >
                Teacher
              </Button>
            </Stack>

            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Email
                </VuiTypography>
              </VuiBox>
              <GradientBorder
                minWidth="100%"
                borderRadius={borders.borderRadius.lg}
                padding="1px"
                backgroundImage={radialGradient(
                  palette.gradients.borderLight.main,
                  palette.gradients.borderLight.state,
                  palette.gradients.borderLight.angle
                )}
              >
                <VuiInput
                  type="email"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>

            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Password
                </VuiTypography>
              </VuiBox>
              <GradientBorder
                minWidth="100%"
                borderRadius={borders.borderRadius.lg}
                padding="1px"
                backgroundImage={radialGradient(
                  palette.gradients.borderLight.main,
                  palette.gradients.borderLight.state,
                  palette.gradients.borderLight.angle
                )}
              >
                <VuiInput
                  type="password"
                  placeholder="Your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>

            <VuiBox display="flex" alignItems="center" mt={2}>
              <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
              <VuiTypography
                variant="caption"
                color="white"
                fontWeight="medium"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;Remember me
              </VuiTypography>
            </VuiBox>

            <VuiBox mt={4} mb={1}>
              <VuiButton color="info" fullWidth type="submit" disabled={loading}>
                SIGN IN
              </VuiButton>
            </VuiBox>

            <VuiBox mt={3} textAlign="center">
              <VuiTypography variant="button" color="text" fontWeight="regular">
                Don&apos;t have an account?{" "}
                <Link to="/authentication/sign-up" style={{ color: "#fff", fontWeight: "medium" }}>
                  Sign up
                </Link>
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </GradientBorder>
      </CoverLayout>

      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionProps={{ onExited: handleCloseAlert }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignIn;
