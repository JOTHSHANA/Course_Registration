import React, { useState, useEffect } from 'react';
import requestApi from '../../components/utils/axios'
import { getDecryptedCookie } from '../../components/utils/encrypt'
import { jwtDecode } from 'jwt-decode';


function Registrations() {

    const [registeredStudents, setRegisteredStudents] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState()

    const departments = [
        { id: '1', dept: 'Computer Science', status: 'Active' },
        { id: '2', dept: 'Mechanical Engineering', status: 'Active' },
        { id: '3', dept: 'Electrical Engineering', status: 'Inactive' },
        { id: '4', dept: 'Civil Engineering', status: 'Active' }
    ];

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value); // Set the selected department ID
    };

    useEffect(() => {
        const fetchRegistered = async () => {
            try {
                const result = await requestApi("POST", `/registered`, {
                    dept: selectedDepartment
                });

                if (result.success) {
                    setRegisteredStudents(result.data.result); // Update state with fetched courses
                    console.log(result.data.result);
                } else {
                    console.error("Error fetching registered students", result.error);
                }
            } catch (error) {
                console.error("Error during fetch registered students", error);
            }
        };
        fetchRegistered();
    }, [selectedDepartment]);

    return (
        <div>
            <h2>Select Department</h2>
            <select value={selectedDepartment} onChange={handleDepartmentChange}>
                <option value="" disabled>Select a department</option>
                {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                        {dept.dept} ({dept.status})
                    </option>
                ))}
            </select>

            <h3>Registered Students:</h3>
            <ul>
                {registeredStudents.map((student, index) => (
                    <div>
                        <li key={index}>{student.name}</li>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default Registrations
