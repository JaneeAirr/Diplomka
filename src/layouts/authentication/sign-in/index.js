import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import bgSignIn from "assets/images/signInImage.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import db from "../../../firebase";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState(""); // Пустая строка для роли по умолчанию
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleRoleChange = (event) => setUserRole(event.target.value);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      console.log("Starting sign-in process...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in successfully:", user);

      // Получение роли пользователя из Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const storedUserRole = userData.role;
        console.log("User role from Firestore:", storedUserRole);

        // Установить роль по умолчанию как "admin", если никакая роль не выбрана
        const roleToCheck = userRole || "admin";
        console.log("Role to check:", roleToCheck);

        // Сохранение email и роли пользователя в локальном хранилище
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", storedUserRole);

        // Проверка выбранной роли пользователя и перенаправление
        if (storedUserRole === roleToCheck) {
          if (storedUserRole === "admin") {
            console.log("Redirecting to admin dashboard...");
            navigate("/admin/dashboard");
          } else if (storedUserRole === "teacher") {
            console.log("Redirecting to teacher dashboard...");
            navigate("/teacher/dashboard");
          } else if (storedUserRole === "student") {
            console.log("Redirecting to student dashboard...");
            navigate("/student/dashboard");
          }
        } else {
          console.error("Selected role does not match the stored role");
        }
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <CoverLayout
      title="Nice to see you!"
      color="white"
      description="Enter your email, password, and role to sign in"
      premotto="College Managment"
      motto="by Daniil_Shekhovtsov"
      image={bgSignIn}
    >
      <VuiBox component="form" role="form" onSubmit={handleSignIn}>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Email
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              type="email"
              placeholder="Your email..."
              fontWeight="500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              sx={({ typography: { size } }) => ({
                fontSize: size.sm,
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </GradientBorder>
        </VuiBox>

        <FormControl component="fieldset" mb={2}>
          <FormLabel component="legend" color="white">Select Role</FormLabel>
          <RadioGroup row value={userRole} onChange={handleRoleChange}>
            <FormControlLabel value="student" control={<Radio />} label="Student" />
            <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
          </RadioGroup>
        </FormControl>

        <VuiBox display="flex" alignItems="center">
          <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
          <VuiTypography
            variant="caption"
            color="white"
            fontWeight="medium"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;Remember me
          </VuiTypography>
        </VuiBox>
        <VuiBox mt={4} mb={1}>
          <VuiButton color="info" fullWidth type="submit">
            SIGN IN
          </VuiButton>
        </VuiBox>
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Sign up
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
