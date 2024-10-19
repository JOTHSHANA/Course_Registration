import React, { useState, useEffect } from 'react';
import { School, People, AddCircle, Star, Book } from '@mui/icons-material'; // Importing icons
import './Register.css';
import requestApi from '../../components/utils/axios';
import { jwtDecode } from 'jwt-decode';
import { getDecryptedCookie } from '../../components/utils/encrypt';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {

    const [courseTypes, setCourseTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const encryptedAuthToken = getDecryptedCookie("authToken");

    if (!encryptedAuthToken) {
        throw new Error("Auth token not found");
    }

    const decodedToken = jwtDecode(encryptedAuthToken);
    const { dept } = decodedToken;
    const { id } = decodedToken;
    

    const formatCourseType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };

    const getIconForCourse = (type) => {
        switch (type) {
            case 'OPEN ELECTIVE':
                return <School style={{ color: 'white', backgroundColor: "#4CAF50", padding: "7px", fontSize: "35px", borderRadius: "5px" }} />;
            case 'PROFESSIONAL ELECTIVE':
                return <People style={{ color: 'white', backgroundColor: "#2196F3", padding: "7px", fontSize: "35px", borderRadius: "5px" }} />;
            case 'ADD ON':
                return <AddCircle style={{ color: 'white', backgroundColor: "#FF9800", padding: "7px", fontSize: "35px", borderRadius: "5px" }} />;
            case 'HONOUR':
                return <Star style={{ color: 'white', backgroundColor: "#FFC107", padding: "7px", fontSize: "35px", borderRadius: "5px" }} />;
            case 'MINOR':
                return <Book style={{ color: 'white', backgroundColor: "#9C27B0", padding: "7px", fontSize: "35px", borderRadius: "5px" }} />;
            default:
                return null;
        }
    };

    const fetchCourses = async (CourseTypeid, dept) => {
        try {
            const result = await requestApi("POST", `/course`, {
                type: CourseTypeid,
                dept: dept
            });

            if (result.success) {
                setCourses(result.data.result); 
            } else {
                console.error("Error fetching available courses", result.error);
            }
        } catch (error) {
            console.error("Error during fetch operation", error);
        }
    };

    const handleCourseClick = (id) => {
        setSelectedCourse(id);
        fetchCourses(id, dept);
    };

    const fetchCourseTypes = async () => {
        try {
            const result = await requestApi("POST", `/c-type`,{
                student: id
            });
            if (result.success) {
                setCourseTypes(result.data);
            } else {
                console.error("Error fetching course types:", result.error);
            }
        } catch (error) {
            console.error("Error during fetchCourseTypes:", error);
        }
    };

    useEffect(() => {
        fetchCourseTypes();
    }, []);

    const registerCourse = async () => {
        try {
            const result = await requestApi("POST", `/c-register`, {
                course: selectedCourseId,
                student: id
            });

            if (result.success) {
                toast.success("Registration successful");

                fetchCourseTypes();
                setSelectedCourse(null); 
            } else {
                console.error("Error registering course", result.error);
            }
        } catch (error) {
            console.error("Error during course registering", error);
        }
    };

    return (
        <div>
            <ToastContainer />
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

            {selectedCourse && courses.length > 0 && (
                <div className="course-details">
                    <p className='course-type-topic'>{courses[0].type}</p>
                    {courses.map(detail => (
                        <div key={detail.id} className="course-detail-card">
                            <div className="radio-container">
                                <input
                                    type="radio"
                                    id={`course-${detail.id}`}
                                    name="courseSelection"
                                    value={detail.id}
                                    onChange={() => setSelectedCourseId(detail.id)} // Update selected course ID
                                    className="large-radio"
                                />
                                <label htmlFor={`course-${detail.id}`}></label>
                            </div>
                            <p style={{ paddingTop: "2px" }}>{detail.code} - {detail.name}</p>
                        </div>
                    ))}
                    <button className="register-button" onClick={registerCourse}>
                        Register
                    </button>
                </div>
            )}
        </div>
    );
}

export default Register;
