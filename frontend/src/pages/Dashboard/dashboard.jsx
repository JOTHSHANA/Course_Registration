import React, { useState, useEffect } from 'react';
import requestApi from "../../components/utils/axios";
import { getDecryptedCookie } from "../../components/utils/encrypt";
import { jwtDecode } from 'jwt-decode';
import './dashboard.css'

function Dashboard() {

  const [myRegisteredCourses, setMyRegisteredCourses] = useState([]);

  const encryptedAuthToken = getDecryptedCookie("authToken");

  if (!encryptedAuthToken) {
    throw new Error("Auth token not found");
  }

  const decodedToken = jwtDecode(encryptedAuthToken);
  const { id } = decodedToken;
  console.log(id)

  useEffect(() => {
    const fetchMyRegisteredCourses = async () => {
      try {
        const result = await requestApi("POST", `/stu-course`, {
          student: id
        });

        if (result.success) {
          setMyRegisteredCourses(result.data.result); // Update state with fetched courses
          console.log(result.data.result);
        } else {
          console.error("Error fetching registered courses", result.error);
        }
      } catch (error) {
        console.error("Error during fetch registered courses", error);
      }
    };
    fetchMyRegisteredCourses();
  }, [id]);

  return (

    <div className="dashboard">
      <h2>My Registered Courses</h2>
      <div className="course-card-container">
        {myRegisteredCourses.map((course, index) => (
          <div className="course-card" key={index}>
            <h3 className="course-name">{course.course_type}</h3>
            <p>{course.code}- {course.course_name}</p>
            <p><strong>Department:</strong> {course.department}</p>
            {/* <p><strong>Year:</strong> {course.year}</p> */}
            {/* <p><strong>Course Type:</strong> {course.course_type}</p> */}
            <button className="request-edit-button">Request Edit</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
