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

const useSubjectsTableData = (handleEditClick) => {
  const [rows, setRows] = useState([]);

  const fetchSubjects = useCallback(async () => {
    const subjectsSnapshot = await getDocs(collection(db, "subjects"));
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDeleteSubject = async (subjectId) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectId));
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "course", align: "center" },
      { name: "action", align: "center" },
    ],
    rows,
    fetchSubjects,
  };
};

const SubjectsTable = () => {
  const [editSubjectModalOpen, setEditSubjectModalOpen] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);

  const handleEditClick = (subjectId) => {
    setCurrentSubjectId(subjectId);
    setEditSubjectModalOpen(true);
  };

  const { columns, rows, fetchSubjects } = useSubjectsTableData(handleEditClick);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  const handleAddSubject = () => {
    setAddSubjectModalOpen(true);
  };

  return (
    <VuiBox py={3}>
      <Card>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography variant="h6" color="white">
            Subjects
          </VuiTypography>
          <Button variant="contained" color="primary" onClick={handleAddSubject}>
            Add Subject
          </Button>
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
