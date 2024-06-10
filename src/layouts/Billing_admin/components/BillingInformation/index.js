import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { useSnackbar } from 'notistack';
import db from "../../../../firebase"; // Ensure this path is correct

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import { Modal, Icon, Box, Button, styled, TextField, Chip, Autocomplete, Card } from "@mui/material";
import Table from "examples/Tables/Table";
import { Typography } from "@mui/material";
import { saveAs } from "file-saver"; // For exporting CSV

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "rgba(255, 255, 255, 0.15)",
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
  p: 4,
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
  animation: "fadeIn 0.5s",
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#007BFF",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "10px",
  fontSize: "1rem",
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "10px",
    backgroundColor: "rgb(15, 21, 53) !important",
    color: "#fff",
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '& .MuiInputLabel-root': {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "0.9rem",
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: "#007BFF",
    },
    '& .MuiSelect-icon': {
      color: "#fff",
    },
  },
  '& .MuiAutocomplete-endAdornment': {
    '& .MuiAutocomplete-popupIndicator': {
      color: "#fff",
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'center',
    fontSize: '0.8rem',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "10px",
    backgroundColor: "rgb(15, 21, 53) !important",
    color: "#fff",
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: "#fff",
    },
    '& .MuiInputLabel-root': {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "0.9rem",
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: "#007BFF",
    },
    '& .MuiSelect-icon': {
      color: "#fff",
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgb(0, 117, 255) !important",
  color: "#fff",
  '& .MuiChip-deleteIcon': {
    color: "#fff",
  },
}));

function TeachersTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [teachers, setTeachers] = useState([]);
  const [editTeacher, setEditTeacher] = useState(null);
  const [subject, setSubject] = useState([]);
  const [course, setCourse] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchTeachers = useCallback(async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const teachersList = usersList.filter((user) => user.role === "teacher");
    setTeachers(teachersList);
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    if (course) {
      const fetchSubjects = async () => {
        const q = query(collection(db, "subjects"), where("course", "==", course));
        const subjectsSnapshot = await getDocs(q);
        const subjectsList = subjectsSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
        setSubjects(subjectsList);
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [course]);

  useEffect(() => {
    if (editTeacher) {
      setCourse(editTeacher.course || "");
      setSubject(editTeacher.subject || []);
    }
  }, [editTeacher]);

  const handleEdit = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    setEditTeacher(teacher);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchTeachers();
      enqueueSnackbar('Teacher successfully deleted', { variant: 'success' });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      enqueueSnackbar('Error deleting teacher', { variant: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditTeacher(null);
    setCourse("");
    setSubject([]);
  };

  const handleSave = async () => {
    if (editTeacher) {
      const teacherDoc = doc(db, "users", editTeacher.id);
      await updateDoc(teacherDoc, { subject, course });
      setTeachers(teachers.map((t) => (t.id === editTeacher.id ? { ...t, subject, course } : t)));
      enqueueSnackbar('Subjects and course successfully assigned', { variant: 'success' });
      handleClose();
    } else {
      enqueueSnackbar('Failed to assign subjects and course', { variant: 'error' });
    }
  };

  const handleSubjectChange = (event, newValue) => {
    setSubject(newValue);
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Email", "Course", "Subjects"];
    csvRows.push(headers.join(","));

    teachers.forEach(teacher => {
      const values = [
        `"${teacher.name}"`,
        `"${teacher.email}"`,
        `"${teacher.course || "N/A"}"`,
        `"${teacher.subject ? teacher.subject.map((subj) => subj.name).join(", ") : "Not assigned"}"`
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'teachers.csv');
  };

  const columns = [
    { name: "name", align: "left" },
    { name: "email", align: "left" },
    { name: "course", align: "left" },
    { name: "subjects", align: "left" },
    { name: "actions", align: "center" }
  ];

  const rows = teachers.map((teacher) => ({
    name: (
      <VuiTypography variant="button" color="white" fontWeight="medium">
        {teacher.name}
      </VuiTypography>
    ),
    email: (
      <VuiTypography variant="caption" color="text">
        {teacher.email}
      </VuiTypography>
    ),
    course: (
      <VuiTypography variant="caption" color="text">
        {teacher.course || "N/A"}
      </VuiTypography>
    ),
    subjects: (
      <VuiTypography variant="caption" color="text">
        {teacher.subject ? teacher.subject.map((subj) => subj.name).join(", ") : "Not assigned"}
      </VuiTypography>
    ),
    actions: (
      <VuiBox display="flex" justifyContent="center" gap={1}>
        <VuiButton variant="text" color="text" onClick={() => handleEdit(teacher.id)}>
          <Icon>edit</Icon>
        </VuiButton>
        <VuiButton variant="text" color="text" onClick={() => handleDelete(teacher.id)}>
          <Icon>delete</Icon>
        </VuiButton>
      </VuiBox>
    )
  }));

  return (
    <Card>
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="22px">
        <VuiTypography variant="lg" color="white">
          Teachers Table
        </VuiTypography>
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Export CSV
        </Button>
      </VuiBox>
      <VuiBox
        sx={{
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
          },
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
            },
          },
        }}
      >
        <Table columns={columns} rows={rows} />
      </VuiBox>
      <Modal open={open} onClose={handleClose}>
        <StyledBox>
          <Typography variant="h5" align="center" gutterBottom color="white">
            Назначить предмет для {editTeacher?.name}
          </Typography>
          <StyledTextField
            fullWidth
            label="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <StyledAutocomplete
            multiple
            options={subjects.filter(subject => !editTeacher?.subject?.find(s => s.id === subject.id))}
            getOptionLabel={(option) => option.name}
            value={subject}
            onChange={handleSubjectChange}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <StyledChip label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subjects"
                variant="outlined"
              />
            )}
          />
          <StyledButton variant="contained" onClick={handleSave} fullWidth>
            Сохранить
          </StyledButton>
        </StyledBox>
      </Modal>
    </Card>
  );
}

export default TeachersTable;
