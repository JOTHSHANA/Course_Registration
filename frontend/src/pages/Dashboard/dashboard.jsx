import React, { useState, useEffect } from 'react';
import requestApi from "../../components/utils/axios";
import { getDecryptedCookie } from "../../components/utils/encrypt";
import { jwtDecode } from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';
import './dashboard.css';
import EButton from '../../components/Button/EditButton';

function Dashboard() {

  const [myRegisteredCourses, setMyRegisteredCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [previousCourseId, setPreviousCourseId] = useState(null);
  const [requestedCourses, setRequestedCourses] = useState([]);
  const [rejectedCourse, setRejectedCourse] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const encryptedAuthToken = getDecryptedCookie("authToken");

  if (!encryptedAuthToken) {
    throw new Error("Auth token not found");
  }

  const decodedToken = jwtDecode(encryptedAuthToken);
  const { id } = decodedToken;

  const fetchMyRegisteredCourses = async () => {
    try {
      const result = await requestApi("POST", `/stu-course`, {
        student: id
      });

      if (result.success) {
        setMyRegisteredCourses(result.data.result);
      } else {
        console.error("Error fetching registered courses", result.error);
      }
    } catch (error) {
      console.error("Error during fetch registered courses", error);
    }
  };

  const fetchRequestedCourses = async () => {
    try {
      const result = await requestApi("POST", `/stu-req`, {
        student: id
      });

      if (result.success) {
        setRequestedCourses(result.data.result);
      } else {
        console.error("Error fetching requested courses", result.error);
      }
    } catch (error) {
      console.error("Error during fetch requested courses", error);
    }
  };

  const fetchRejectedCourse = async () => {
    try {
      const result = await requestApi("POST", `/stu-rej`, {
        student: id
      });

      if (result.success) {
        setRejectedCourse(result.data.result);
      } else {
        console.error("Error fetching rejected courses", result.error);
      }
    } catch (error) {
      console.error("Error during fetch rejected courses", error);
    }
  }

  useEffect(() => {
    fetchMyRegisteredCourses();
    fetchRequestedCourses();
    fetchRejectedCourse();
  }, [id]);

  const handleRequestEdit = async (courseId) => {
    setPreviousCourseId(courseId);
    try {
      const result = await requestApi("POST", `/stu-avail`, {
        student: id
      });

      if (result.success) {
        setAvailableCourses(result.data.result);
        setOpenDialog(true);
      } else {
        console.error("Error fetching available courses", result.error);
      }
    } catch (error) {
      console.error("Error during fetch available courses", error);
    }
    fetchRequestedCourses();

  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const handleSubmitRequest = async () => {
    try {
      const result = await requestApi("POST", `/c-request`, {
        student: id,
        f_course: previousCourseId,
        t_course: selectedCourseId
      });

      if (result.success) {
        console.log("Course edit request submitted successfully");
        setOpenDialog(false);
      } else {
        console.error("Error submitting course edit request", result.error);
      }
    } catch (error) {
      console.error("Error during course edit request", error);
    }
  };

  const handleToggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        <EButton onClick={handleToggleEditMode} className="top-request-edit-btn" label={editMode ? "Disable Course Edit" : "Request Course Change"} />
      </div>

      <p className='heading'>My Courses</p>
      {myRegisteredCourses.length > 0 ? (
        <div className="course-card-container">
          {myRegisteredCourses.map((course, index) => (
            <div className="course-cardd" key={index}>
              <div className='course-flex'>
                <p className="course-name">{course.course_type} ({course.department})</p>
                <p><b>{course.code}</b> - {course.course_name} </p>
                <p></p>
              </div>
              {editMode && course.edit === "1" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <EButton
                    className="request-edit-button"
                    onClick={() => handleRequestEdit(course.c_id)}
                    label="Request Edit"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className='no-records'>No Registered Course...</p>
      )}
      <br />

      <p className='heading'>Requested Course Changes</p>
      {requestedCourses.length > 0 ? (
        <div className="requested-course-card-container">
          {requestedCourses.map((request, index) => (
            <div className="requested-course-card" key={index}>
              <p><strong>Registered Course:</strong> {request.f_course_code} - {request.f_course_name} ({request.f_course_type})</p>
              <p><strong>Requested Course:</strong> {request.t_course_code} - {request.t_course_name} ({request.t_course_type})</p>
              <p><strong>Requested Count:</strong> {request.count}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className='no-records'>No Requested Course records...</p>
      )}
      <br />

      <p className='heading'>Rejected Course Changes</p>
      {rejectedCourse.length > 0 ? (
        <div className="requested-course-card-container">
          {rejectedCourse.map((request, index) => (
            <div className="requested-course-card" key={index}>
              <p><strong>Course Registered:</strong> {request.f_course_code} - {request.f_course_name} ({request.f_course_type})</p>
              <p><strong>Requested Course:</strong> {request.t_course_code} - {request.t_course_name} ({request.t_course_type})</p>
              <p><strong>Requested Count:</strong> {request.count}</p>
              <p><strong>Reason:</strong> {request.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className='no-records'>No Rejected Course records...</div>
      )}

      <Dialog fullWidth open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select New Course</DialogTitle>
        <DialogContent>
          {availableCourses.map((course) => (
            <FormControlLabel
              key={course.id}
              control={
                <Checkbox
                  checked={selectedCourseId === course.id}
                  onChange={() => handleCourseSelect(course.id)}
                />
              }
              label={`${course.code} - ${course.name} (Max Count: ${course.max_count})`}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitRequest} color="primary" disabled={!selectedCourseId}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
