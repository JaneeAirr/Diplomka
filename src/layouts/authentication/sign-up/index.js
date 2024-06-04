// src/layouts/authentication/components/SignUp.js
import React, { useState } from "react";
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
import GradientBorder from "examples/GradientBorder";
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgSignIn from "assets/images/background-basic-auth.webp";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import db from "../../../firebase";
import { useUser } from "../../../context/UserContext"; // Add this import

function SignUp() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userRole, setUserRole] = useState("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", open: false });
  const { setUser } = useUser(); // Get setUser from context

  const navigate = useNavigate();
  const auth = getAuth();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleRoleChange = (role) => setUserRole(role);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "", open: false });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !password || !userRole) {
      setAlert({ type: "warning", message: "All fields must be filled out.", open: true });
      setLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setAlert({ type: "warning", message: "The email address is not valid.", open: true });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setAlert({ type: "warning", message: "Password should be at least 6 characters long.", open: true });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Authenticated user ID:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: userRole,
        createdAt: serverTimestamp()
      });
      console.log("User document created successfully");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User registered successfully:", user);
        setUser(userDoc.data()); // Set user in context

        if (userRole === "student") {
          navigate("/student/dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        console.error("No user found with the provided user ID.");
      }
    } catch (error) {
      console.error("Error registering user or creating document:", error);
      if (error.code === "auth/email-already-in-use") {
        setAlert({ type: "error", message: "The email address is already in use by another account.", open: true });
      } else if (error.code === "auth/invalid-email") {
        setAlert({ type: "warning", message: "The email address is not valid.", open: true });
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
            onSubmit={handleSignUp}
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
              Register
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
                  Name
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
                  placeholder="Your full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>

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

            <VuiBox mt={4} mb={1}>
              <VuiButton color="info" fullWidth type="submit" disabled={loading}>
                SIGN UP
              </VuiButton>
            </VuiBox>

            <VuiBox mt={3} textAlign="center">
              <VuiTypography variant="button" color="text" fontWeight="regular">
                Already have an account?{" "}
                <Link to="/authentication/sign-in" style={{ color: "#fff", fontWeight: "medium" }}>
                  Sign in
                </Link>
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </GradientBorder>
      </CoverLayout>

      <VuiBox
        display={{ xs: "flex", md: "none" }}
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={3}
        px={2}
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
            onSubmit={handleSignUp}
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
              Register with
            </VuiTypography>

            <Stack direction="row" spacing={2} justifyContent="center" mb="24px">
              <IconButton color="primary">
                <FaFacebook />
              </IconButton>
              <IconButton color="primary">
                <FaApple />
              </IconButton>
              <IconButton color="primary">
                <FaGoogle />
              </IconButton>
            </Stack>
            <VuiTypography color="text" textAlign="center" mb="24px">
              or
            </VuiTypography>

            <VuiBox display="flex" justifyContent="center" mb="24px">
              <Button
                variant={userRole === "student" ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleRoleChange("student")}
                sx={{ marginRight: "10px" }}
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
            </VuiBox>

            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                  Name
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
                  placeholder="Your full name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={({ typography: { size } }) => ({
                    fontSize: size.sm,
                  })}
                />
              </GradientBorder>
            </VuiBox>

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
            <VuiBox mt={4} mb={1}>
              <VuiButton color="info" fullWidth type="submit" disabled={loading}>
                SIGN UP
              </VuiButton>
            </VuiBox>

            <VuiBox mt={3} textAlign="center">
              <VuiTypography variant="button" color="text" fontWeight="regular">
                Already have an account?{" "}
                <Link to="/authentication/sign-in" style={{ color: "#fff", fontWeight: "medium" }}>
                  Sign in
                </Link>
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </GradientBorder>
      </VuiBox>

      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionProps={{ onExited: handleCloseAlert }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;
