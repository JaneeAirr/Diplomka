import Dashboard from "layouts/dashboard";
import Tables from "layouts/Tables_admin";
import TablesGroup from "layouts/Tables_group_admin";
import TablesSubject from "layouts/Tables_subject";
import TablesSheld from "layouts/TableSheildu";
import TablesRooms from "layouts/Tables_Rooms";
import Tables_mark from "./layouts/Tables_mark";
import Billing from "layouts/Billing_admin";
import StudentDashboadr from "layouts/Dashboard_Student"
import LogAut from "layouts/authentication/Logout"
import TeacherAden from "layouts/Table_Adden"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import BillingAdmin from "layouts/Billing_admin";
import { FaUserXmark } from "react-icons/fa6";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import { MdFlightClass } from "react-icons/md";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import DashboardAdmin from "layouts/Dashboard_admin";
import DashboardTeacher from "layouts/Dashboard_Teacher";
import DashboardStudent from "layouts/Dashboard_Student";
import { IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { IoBuild } from "react-icons/io5";
import { BsCreditCardFill } from "react-icons/bs";
import { IoStatsChart } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { IoHome } from "react-icons/io5";
import { GrSchedules } from "react-icons/gr";
import { SiGoogleclassroom } from "react-icons/si";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { MdOutlinePlayLesson } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
// Admin routes
export const adminRoutes = [
  {
    type: "collapse",
    name: "Главная",
    key: "admin-dashboard",
    route: "/admin/dashboard",
    icon: <IoHome size="15px" color="inherit" />, // Home icon
    component: DashboardAdmin,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Учителя",
    key: "admin-billing",
    route: "/admin/billing",
    icon: <PiChalkboardTeacherBold size="15px" color="inherit" />, // Billing icon
    component: Billing,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Студенты",
    key: "admin-tables",
    route: "/admin/tables",
    icon: <PiStudent size="15px" color="inherit" />, // Billing icon
    component: Tables,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Группы",
    key: "admin-tables-group",
    route: "/admin/tables-group",
    icon: <SiGoogleclassroom size="15px" color="inherit" />, // Billing icon
    component:   TablesGroup,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Предметы",
    key: "admin-tables-subject",
    route: "/admin/tables-subject",
    icon: <MdOutlinePlayLesson size="15px" color="inherit" />, // Billing icon
    component:   TablesSubject,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Аудитории",
    key: "admin-tables-rooms",
    route: "/admin/tables-rooms",
    icon: <MdFlightClass size="15px" color="inherit" />, // Billing icon
    component:   TablesRooms,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Выйти",
    key: "logout",
    route: "/authentication/logout",
    icon: <CiLogout size="15px" color="inherit" />,
    component: LogAut,
    noCollapse: true,
  },
  // other admin routes...
];

// Teacher routes
export const teacherRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "teacher-dashboard",
    route: "/teacher/dashboard",
    icon: <IoHome size="15px" color="inherit" />, // Home icon
    component: DashboardTeacher,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Расписание",
    key: "teacher-sheuid",
    route: "/teacher/sheuid",
    icon: <IoHome size="15px" color="inherit" />, // Billing icon
    component: TablesSheld,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Посещаемость",
    key: "teacher-adden",
    route: "/teacher/adden",
    icon: <FaUserXmark size="15px" color="inherit" />, // Billing icon
    component: TeacherAden,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Оценивание",
    key: "teacher-mark",
    route: "/teacher/mark",
    icon: <IoIosCheckmarkCircleOutline size="15px" color="inherit" />, // Billing icon
    component: Tables_mark,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Выйти",
    key: "logout",
    route: "/authentication/logout",
    icon: <CiLogout size="15px" color="inherit" />,
    component: LogAut,
    noCollapse: true,
  },
  // other teacher routes...
];

// Student routes
export const studentRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "student-dashboard",
    route: "/student/dashboard",
    icon: <IoHome size="15px" color="inherit" />, // Home icon
    component: StudentDashboadr,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Выйти",
    key: "logout",
    route: "/authentication/logout",
    icon: <CiLogout size="15px" color="inherit" />,
    component: LogAut,
    noCollapse: true,
  },
  // other student routes...
];


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <IoStatsChart size="15px" color="inherit" />,
    component: Tables,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <BsCreditCardFill size="15px" color="inherit" />,
    component: Billing,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    route: "/rtl",
    icon: <IoBuild size="15px" color="inherit" />,
    component: RTL,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Profile,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignUp,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Administrator",
    key: "administrator",
    route: "/admin/dashboard",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: DashboardAdmin,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Teacher",
    key: "teacher",
    route: "/teacher/dashboard",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: DashboardTeacher,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Student",
    key: "student",
    route: "/student/dashboard",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: DashboardStudent,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Выйти",
    key: "logout",
    route: "/authentication/logout",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: LogAut,
    noCollapse: true,
  },
];

export default routes;
