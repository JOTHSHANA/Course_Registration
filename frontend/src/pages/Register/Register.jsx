import React, { useState } from 'react';
import { School, People, AddCircle, Star, Book } from '@mui/icons-material'; // Importing icons
import './Register.css';

function Register() {
    const courses = [
        { id: 1, type: 'OPEN ELECTIVE', status: 1 },
        { id: 2, type: 'PROFESSIONAL ELECTIVE', status: 1 },
        { id: 3, type: 'ADD ON', status: 1 },
        { id: 4, type: 'HONOUR', status: 1 },
        { id: 5, type: 'MINOR', status: 1 }
    ];

    // Sample data to simulate the backend response
    const courseDetailsData = {
        1: [
            { id: 1, department: 'CSE', code: '22CS509', name: 'OE - I', max_count: 5, course_type: 'OPEN ELECTIVE', status: 1 },
            { id: 2, department: 'CSE', code: '22CS508', name: 'OE - II', max_count: 5, course_type: 'OPEN ELECTIVE', status: 1 },
            { id: 3, department: 'CSE', code: '22CS507', name: 'OE - III', max_count: 5, course_type: 'OPEN ELECTIVE', status: 1 }
        ],
        2: [
            { id: 4, department: 'CSE', code: '22PE101', name: 'PE - I', max_count: 10, course_type: 'PROFESSIONAL ELECTIVE', status: 1 },
            { id: 5, department: 'CSE', code: '22PE102', name: 'PE - II', max_count: 10, course_type: 'PROFESSIONAL ELECTIVE', status: 1 }
        ],
        3: [
            { id: 6, department: 'CSE', code: '22AO101', name: 'Add-on - I', max_count: 5, course_type: 'ADD ON', status: 1 }
        ],
        4: [
            { id: 7, department: 'CSE', code: '22HN101', name: 'Honour - I', max_count: 3, course_type: 'HONOUR', status: 1 }
        ],
        5: [
            { id: 8, department: 'CSE', code: '22MN101', name: 'Minor - I', max_count: 5, course_type: 'MINOR', status: 1 }
        ]
        // You can add similar entries for other course types if needed
    };

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

    const handleCourseClick = (id) => {
        // Simulate fetching data from backend based on course id
        const courseDetails = courseDetailsData[id] || [];
        setSelectedCourse(courseDetails);
    };

    return (
        <div>
            {/* Render course cards only if no course is selected */}
            {!selectedCourse && (
                <div className="course-cards">
                    {courses.map(course => (
                        <div key={course.id} className="course-card" onClick={() => handleCourseClick(course.id)}>
                            <div className="icon-container">{getIconForCourse(course.type)}</div>
                            <p className='c_name'>{formatCourseType(course.type)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Render the course details if a course is selected */}
            {selectedCourse && (
                <div className="course-details">
                    <h2>Course Details</h2>
                    {selectedCourse.map(detail => (
                        <div key={detail.id} className="course-detail-card">
                            <div className="course-detail-info">
                                <p><strong>Department:</strong> {detail.department}</p>
                                <p><strong>Code:</strong> {detail.code}</p>
                                <p><strong>Name:</strong> {detail.name}</p>
                                <p><strong>Max Count:</strong> {detail.max_count}</p>
                                <p><strong>Course Type:</strong> {detail.course_type}</p>
                                <p><strong>Status:</strong> {detail.status === 1 ? 'Available' : 'Unavailable'}</p>
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
