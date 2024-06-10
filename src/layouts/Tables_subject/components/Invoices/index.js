import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../../../../firebase";
import { Card, Button, IconButton } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Table from "examples/Tables/Table";
import AddSubjectModal from "../../../Tables_subject/AddSubjectModal";
import EditSubjectModal from "../../../Tables_subject/EditSubjectModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { saveAs } from "file-saver";
import { useSnackbar } from 'notistack';

const useSubjectsTableData = (handleEditClick, enqueueSnackbar) => {
  const [rows, setRows] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const fetchSubjects = useCallback(async () => {
    const subjectsSnapshot = await getDocs(collection(db, "subjects"));
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSubjectsList(subjectsList);

    const subjectsRows = subjectsList.map((subject) => ({
      name: (
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {subject.name}
        </VuiTypography>
      ),
      course: (
        <VuiTypography variant="button" color="white" fontWeight="medium" sx={{ textAlign: "center" }}>
          {subject.course}
        </VuiTypography>
      ),
      action: (
        <>
          <IconButton color="primary" onClick={() => handleEditClick(subject.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteSubject(subject.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
      hasBorder: true,
    }));

    setRows(subjectsRows);
  }, [handleEditClick]);

  const handleDeleteSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectId));
      fetchSubjects();
      enqueueSnackbar('Subject deleted successfully!', {
        variant: 'success',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    } catch (error) {
      console.error("Error deleting subject:", error);
      enqueueSnackbar('Error deleting subject', {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "course", align: "center" },
      { name: "action", align: "center" },
    ],
    rows,
    fetchSubjects,
    subjectsList,
  };
};

const SubjectsTable = () => {
  const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleEditClick = (subjectId) => {
    setCurrentSubjectId(subjectId);
    setEditSubjectModalOpen(true);
  };

  const { columns, rows, fetchSubjects, subjectsList } = useSubjectsTableData(handleEditClick, enqueueSnackbar);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const handleAddSubject = () => {
    setAddSubjectModalOpen(true);
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Course"];
    csvRows.push(headers.join(","));

    subjectsList.forEach(subject => {
      const values = [subject.name, subject.course];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'subjects.csv');
  };

  return (
    <VuiBox py={3}>
      <Card>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography variant="h6" color="white">
            Subjects
          </VuiTypography>
          <VuiBox display="flex">
            <Button variant="contained" color="primary" onClick={handleAddSubject}>
              Add Subject
            </Button>
            <Button variant="contained" color="secondary" onClick={exportToCSV} sx={{ ml: 2 }}>
              Export CSV
            </Button>
          </VuiBox>
        </VuiBox>
        <VuiBox>
          <Table columns={columns} rows={rows} />
        </VuiBox>
      </Card>
      <AddSubjectModal
        open={addSubjectModalOpen}
        handleClose={() => setAddSubjectModalOpen(false)}
        fetchSubjects={fetchSubjects}
      />
      <EditSubjectModal
        open={editSubjectModalOpen}
        handleClose={() => setEditSubjectModalOpen(false)}
        subjectId={currentSubjectId}
        fetchSubjects={fetchSubjects}
      />
    </VuiBox>
  );
};

export default SubjectsTable;
