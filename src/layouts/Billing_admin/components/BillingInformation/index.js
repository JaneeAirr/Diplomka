import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../../../../firebase";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";

// Custom styled components
const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    background: theme.palette.background.default,
    borderRadius: "12px",
    padding: theme.spacing(2),
  },
}));

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  textAlign: "center",
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const CustomDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    padding: theme.spacing(1),
  },
}));

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  padding: theme.spacing(2, 0),
}));

function Bill({ id, name, email, subject, onEdit }) {
  const { gradients } = colors;
  const { bill } = gradients;

  return (
    <VuiBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ background: linearGradient(bill.main, bill.state, bill.deg) }}
      borderRadius="lg"
      p="24px"
      mb="24px"
      mt="20px"
    >
      <VuiBox width="100%" display="flex" flexDirection="column">
        <VuiBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb="5px"
        >
          <VuiTypography
            variant="button"
            color="white"
            fontWeight="medium"
            textTransform="capitalize"
          >
            {name}
          </VuiTypography>

          <VuiBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                flexDirection: "column",
              },
            })}
          >
            <VuiBox mr={1}>
              <VuiButton variant="text" color="text" onClick={() => onEdit(id)}>
                <Icon sx={{ mr: "4px" }}>edit</Icon>&nbsp;EDIT
              </VuiButton>
            </VuiBox>
          </VuiBox>
        </VuiBox>
        <VuiBox mb={1} lineHeight={0}>
          <VuiTypography variant="caption" color="text">
            Email Address:&nbsp;&nbsp;&nbsp;
            <VuiTypography variant="caption" fontWeight="regular" color="text">
              {email}
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
        <VuiTypography variant="caption" color="text">
          Subject:&nbsp;&nbsp;&nbsp;
          <VuiTypography variant="caption" fontWeight="regular" color="text">
            {subject || "Not assigned"}
          </VuiTypography>
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

Bill.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  subject: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
};

function BillingInformation() {
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);
  const [subject, setSubject] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const teachersList = usersList.filter(user => user.role === "teacher");
      setTeachers(teachersList);
    };

    fetchTeachers();
  }, []);

  const handleEdit = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    setEditTeacher(teacher);
    setSubject(teacher.subject || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTeacher(null);
    setSubject("");
  };

  const handleSave = async () => {
    if (editTeacher) {
      const teacherDoc = doc(db, "users", editTeacher.id);
      await updateDoc(teacherDoc, { subject });
      setTeachers(teachers.map((t) => (t.id === editTeacher.id ? { ...t, subject } : t)));
      handleClose();
    }
  };

  return (
    <Card id="delete-account">
      <VuiBox>
        <VuiTypography variant="lg" color="white" fontWeight="bold">
          Учителя
        </VuiTypography>
      </VuiBox>
      <VuiBox>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {teachers.map((teacher) => (
            <Bill
              key={teacher.id}
              id={teacher.id}
              name={teacher.name}
              email={teacher.email}
              subject={teacher.subject}
              onEdit={handleEdit}
            />
          ))}
        </VuiBox>
      </VuiBox>
      <CustomDialog open={open} onClose={handleClose}>
        <CustomDialogTitle>Edit Subject for {editTeacher?.name}</CustomDialogTitle>
        <CustomDialogContent>
          <CustomDialogContentText>
            To edit the subject for {editTeacher?.name}, please enter the new subject here.
          </CustomDialogContentText>
          <CustomTextField
            autoFocus
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </CustomDialogContent>
        <CustomDialogActions>
          <VuiButton onClick={handleClose} color="secondary">
            Cancel
          </VuiButton>
          <VuiButton onClick={handleSave} color="primary">
            Save
          </VuiButton>
        </CustomDialogActions>
      </CustomDialog>
    </Card>
  );
}

export default BillingInformation;
