import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { DataGrid } from '@mui/x-data-grid';
import requestApi from '../../components/utils/axios';
import DButton from '../../components/Button/DownloadButton';
import customStyles from '../../components/applayout/selectTheme';
import * as XLSX from 'xlsx'; 

function Export() {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCourseType, setSelectedCourseType] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [years, setYears] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courseTypes, setCourseTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [rCount, setRCount] = useState([]);

    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [yearResult, deptResult, courseTypeResult] = await Promise.all([
                    requestApi('GET', '/year'),
                    requestApi('GET', '/dept'),
                    requestApi('GET', '/course-type')
                ]);

                if (yearResult.success) {
                    const yearOptions = yearResult.data.map(year => ({
                        value: year.id,
                        label: year.year
                    }));
                    setYears(yearOptions);
                }

                if (deptResult.success) {
                    const deptOptions = deptResult.data.map(dept => ({
                        value: dept.id,
                        label: dept.department
                    }));
                    setDepartments(deptOptions);
                }

                if (courseTypeResult.success) {
                    const courseTypeOptions = courseTypeResult.data.map(courseType => ({
                        value: courseType.id,
                        label: courseType.type
                    }));
                    setCourseTypes(courseTypeOptions);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (selectedCourseType) {
                try {
                    const coursesResult = await requestApi('POST', '/course-all', { type: selectedCourseType.value });

                    if (coursesResult.success) {
                        const courseOptions = coursesResult.data.result.map(course => ({
                            value: course.id,
                            label: `${course.code} - ${course.name}`
                        }));
                        console.log(courseOptions)
                        setCourses(courseOptions);
                    }
                } catch (error) {
                    console.error('Error fetching courses:', error);
                }
            } else {
                setCourses([]);
            }
        };

        fetchCourses();
    }, [selectedCourseType]);

    useEffect(() => {
        const fetchCourseReport = async () => {
            if (selectedCourse) {
                try {
                    const reportResult = await requestApi('POST', '/c-report', { course: selectedCourse.value });

                    if (reportResult.success) {
                        setStudents(reportResult.data.students.result);
                        setRCount(reportResult.data.student_count);
                    }
                } catch (error) {
                    console.error('Error fetching course report:', error);
                }
            } else {
                setStudents([]);
            }
        };

        fetchCourseReport();
    }, [selectedCourse]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'reg_no', headerName: 'Register Number', width: 150 },
        { field: 'gmail', headerName: 'Gmail', width: 250 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'code', headerName: 'Course Code', width: 150 },
        { field: 'course_name', headerName: 'Course Name', width: 200 },
    ];

    const exportToExcel = () => {
        if (students.length === 0) {
            alert('No data to export!');
            return;
        }

        const wb = XLSX.utils.book_new();

        const wsData = [];

        wsData.push([`Student Count: ${rCount}`]);

        wsData.push(["S.No", "Name", "Register Number", "Gmail", "Department", "Year", "Course Code", "Course Name"]);

        students.forEach((student, index) => {
            wsData.push([
                index + 1,
                student.name,
                student.reg_no,
                student.gmail,
                student.department,
                student.year,
                student.code,
                student.course_name
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        XLSX.utils.book_append_sheet(wb, ws, "Course Report");

        XLSX.writeFile(wb, `${selectedCourse.label}.xlsx`);
    };

    return (
        <div>
            <h3>Courses</h3>
            <br />
            <div className="select-container">
                <div className="r-select">
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={years}
                        placeholder="Select Year"
                        isClearable
                        styles={customStyles}
                        isDisabled={false} // Year dropdown is always enabled
                    />
                </div>
                <div className="r-select">
                    <Select
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        options={departments}
                        placeholder="Select Department"
                        isClearable
                        styles={customStyles}
                        isDisabled={!selectedYear} // Disabled until a year is selected
                    />
                </div>
                <div className="r-select">
                    <Select
                        value={selectedCourseType}
                        onChange={setSelectedCourseType}
                        options={courseTypes}
                        placeholder="Select Course Type"
                        isClearable
                        styles={customStyles}
                        isDisabled={!selectedYear || !selectedDepartment} // Disabled until both year and department are selected
                    />
                </div>
                <div className="r-select">
                    <Select
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        options={courses}
                        placeholder="Select Course"
                        isClearable
                        styles={customStyles}
                        isDisabled={!selectedCourseType} // Disabled until a course type is selected
                    />
                </div>
            </div>
            <br />
            <h3>Course Report:</h3>
            {students.length > 0 ? (
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p>Registered Count: {rCount}</p>
                        <DButton onClick={exportToExcel} label= "Export to Excel"/>
                    </div>
                    <br />
                    <div style={{ height: 400 }}>
                        <DataGrid
                            rows={students}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            getRowId={(row) => row.reg_no}
                        />
                    </div>
                </div>
            ) : (
                <p className='no-records'>No students registered for the selected course.</p>
            )}
        </div>
    );
}

export default Export;
