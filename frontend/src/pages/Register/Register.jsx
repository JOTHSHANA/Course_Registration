import React, { useState, useEffect } from 'react';
import { School, People, AddCircle, Star, Book } from '@mui/icons-material'; // Importing icons
import './Register.css';
import requestApi from '../../components/utils/axios';

function Register() {

    const [courseTypes, setCourseTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Function to capitalize the first letter and make others lowercase
    const formatCourseType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };

    // Function to render the correct icon based on the course type
    const getIconForCourse = (type) => {
        switch (type) {
            case 'OPEN ELECTIVE':
                return <School style={{ color: 'white', backgroundColor: "#4CAF50", padding: "7px", fontSize: "35px", borderRadius: "10px" }} />;
            case 'PROFESSIONAL ELECTIVE':
                return <People style={{ color: 'white', backgroundColor: "#2196F3", padding: "7px", fontSize: "35px", borderRadius: "10px" }} />;
            case 'ADD ON':
                return <AddCircle style={{ color: 'white', backgroundColor: "#FF9800", padding: "7px", fontSize: "35px", borderRadius: "10px" }} />;
            case 'HONOUR':
                return <Star style={{ color: 'white', backgroundColor: "#FFC107", padding: "7px", fontSize: "35px", borderRadius: "10px" }} />;
            case 'MINOR':
                return <Book style={{ color: 'white', backgroundColor: "#9C27B0", padding: "7px", fontSize: "35px", borderRadius: "10px" }} />;
            default:
                return null;
        }
    };

    const dept = 1;

    const fetchCourses = async (CourseTypeid) => {
        try {
            const result = await requestApi("POST", `/course`, {
                type: CourseTypeid,
                dept: dept
            });

            if (result.success) {
                setCourses(result.data.result); // Update state with fetched courses
                console.log(result.data.result);
            } else {
                console.error("Error fetching available courses", result.error);
            }
        } catch (error) {
            console.error("Error during fetch operation", error);
        }
    };

    const handleCourseClick = (id) => {
        setSelectedCourse(id);
        fetchCourses(id);
    };

    useEffect(() => {
        const fetchCourseTypes = async () => {
            const result = await requestApi("GET", `/c-type`);
            if (result.success) {
                setCourseTypes(result.data);
                console.log(result.data);
            } else {
                console.error("Error fetching course types:", result.error);
            }
        };
        fetchCourseTypes();
    }, []);

    return (
        <div>
            {/* Render course cards only if no course is selected */}
            {!selectedCourse && (
                <div className="course-cards">
                    {courseTypes.map(course => (
                        <div key={course.id} className="course-card" onClick={() => handleCourseClick(course.id)}>
                            <div className="icon-container">{getIconForCourse(course.type)}</div>
                            <p className='c_name'>{formatCourseType(course.type)}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedCourse && (
                <div className="course-details">
                    <h2>Course Details</h2>
                    {courses.map(detail => (
                        <div key={detail.id} className="course-detail-card">
                            <div className="course-detail-info">
                                <p><strong>Department:</strong> {detail.department}</p>
                                <p><strong>Code:</strong> {detail.code}</p>
                                <p><strong>Name:</strong> {detail.name}</p>
                                <p><strong>Max Count:</strong> {detail.max_count}</p>
                                <p><strong>Course Type:</strong> {detail.type}</p>
                                <p><strong>Registered Count:</strong> {detail.registered_count}</p>
                            </div>
                            <div className="checkbox-container">
                                <input type="checkbox" id={`course-${detail.id}`} />
                                <label htmlFor={`course-${detail.id}`}>Register</label>
                            </div>
                        </div>
                    ))}
                    <button className="register-button">Register</button>
                </div>
            )}
        </div>
    );
}

export default Register;
