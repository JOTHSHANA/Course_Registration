import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import requestApi from '../../components/utils/axios';
import RegistrationsTable from './RegistrationsTable'; 
import customStyles from '../../components/applayout/selectTheme';
import * as XLSX from 'xlsx';
import DButton from '../../components/Button/DownloadButton';
import './Registrations.css';

function Registrations() {
    const [registeredStudents, setRegisteredStudents] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [depts, setDepts] = useState([]);
    const [years, setYears] = useState([]);

    const fetchOptions = async () => {
        try {
            const [deptResult, yearResult] = await Promise.all([
                requestApi('GET', '/dept'),
                requestApi('GET', '/year')
            ]);

            if (deptResult.success) {
                const deptOptions = deptResult.data.map(dept => ({
                    value: dept.id,
                    label: dept.department
                }));
                setDepts(deptOptions);
            } else {
                console.error('Error fetching departments:', deptResult.error);
            }

            if (yearResult.success) {
                const yearOptions = yearResult.data.map(year => ({
                    value: year.id,
                    label: year.year
                }));
                setYears(yearOptions);
            } else {
                console.error('Error fetching years:', yearResult.error);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchRegistered = async () => {
        if (selectedDepartment && selectedYear) {
            try {
                const result = await requestApi('POST', '/registered', {
                    dept: selectedDepartment.value,
                    year: selectedYear.value
                });

                if (result.success) {
                    setRegisteredStudents(result.data.result);
                } else {
                    console.error('Error fetching registered students', result.error);
                }
            } catch (error) {
                console.error('Error during fetch registered students', error);
            }
        } else {
            setRegisteredStudents([]);
        }
    };

    useEffect(() => {
        fetchRegistered();
    }, [selectedDepartment, selectedYear]);

    const downloadExcel = () => {
        const data = registeredStudents.map((student, index) => ({
            'S.No': index + 1,
            'Student Name': student.NAME,
            'Registration Number.': student['REGISTER NUMBER'],
            'Gmail': student.GMAIL,
            'Department': student.DEPARTMENT,
            'Year': student.YEAR,
            'Open Elective': student['OPEN ELECTIVE'] || '--',
            'Professional Elective': student['PROFESSIONAL ELECTIVE'] || '--',
            'Add-On Course': student['ADD-ON COURSE'] || '--',
            'Honour Course': student['HONOUR COURSE'] || '--',
            'Minor Course': student['MINOR COURSE'] || '--'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Students');

        XLSX.writeFile(workbook, `Registered_Students ${selectedYear.label}-${selectedDepartment.label}.xlsx`);
    };

    return (
        <div>
            <h2>Select Department and Year</h2>
            <div className="select-container">
                <div className='r-select'>
                    <Select
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        options={depts}
                        placeholder="Select Department"
                        className="react-select"
                        isClearable
                        styles={customStyles}
                    />
                </div>
                <div className='r-select'>
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={years}
                        placeholder="Select Year"
                        className="react-select"
                        isClearable
                        styles={customStyles}
                    />
                </div>
            </div>
            <br />
           
            <h3>Registered Students</h3>
            {registeredStudents.length > 0 ? (
                 <div>
                    
                     <RegistrationsTable students={registeredStudents} />
                     <br />

                     <DButton onClick={downloadExcel} disabled={registeredStudents.length === 0}
                     label="Download Excel"
                     />
                 </div>
            ) : (
                <p>No students registered for the selected department and year.</p>
            )}
        </div>
    );
}

export default Registrations;
