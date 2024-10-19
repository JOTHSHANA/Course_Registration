import React, { useState, useEffect } from 'react';
import requestApi from '../../components/utils/axios';
import RegistrationsTable from './RegistrationsTable'; // Import the table component
import './Registrations.css';

function Registrations() {
    const [registeredStudents, setRegisteredStudents] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [depts, setDepts] = useState([]);

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value); // Set the selected department ID
    };

    useEffect(() => {
        const fetchDepts = async () => {
            const result = await requestApi('GET', `/dept`);
            if (result.success) {
                setDepts(result.data);
                console.log(result.data);
            } else {
                console.error('Error fetching departments:', result.error);
            }
        };
        fetchDepts();
    }, []);

    useEffect(() => {
        const fetchRegistered = async () => {
            try {
                const result = await requestApi('POST', `/registered`, {
                    dept: selectedDepartment,
                });

                if (result.success) {
                    setRegisteredStudents(result.data.result); // Update state with fetched students
                    console.log(result.data.result);
                } else {
                    console.error('Error fetching registered students', result.error);
                }
            } catch (error) {
                console.error('Error during fetch registered students', error);
            }
        };
        fetchRegistered();
    }, [selectedDepartment]);

    return (
        <div>
            <h2>Select Department</h2>
            <select value={selectedDepartment} onChange={handleDepartmentChange}>
                <option value="" disabled>
                    Select a department
                </option>
                {depts.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                        {dept.department}
                    </option>
                ))}
            </select>

            <h3>Registered Students:</h3>
            {registeredStudents.length > 0 ? (
                <RegistrationsTable students={registeredStudents} />
            ) : (
                <p>No students registered for the selected department.</p>
            )}
        </div>
    );
}

export default Registrations;
