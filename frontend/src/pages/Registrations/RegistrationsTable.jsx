import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

function RegistrationsTable({ students }) {
    const [pageSize, setPageSize] = useState(10);

    const columns = [
        { field: 'NAME', headerName: 'Student Name', width: 180 },
        { field: 'REGISTER NUMBER', headerName: 'Registration No.', width: 180 },
        { field: 'GMAIL', headerName: 'Gmail', width: 250 },
        { field: 'DEPARTMENT', headerName: 'Department', width: 150 },
        { field: 'YEAR', headerName: 'Year', width: 100 },
        { field: 'OPEN ELECTIVE', headerName: 'Open Elective', width: 150 },
        { field: 'PROFESSIONAL ELECTIVE', headerName: 'Professional Elective', width: 180 },
        { field: 'ADD-ON COURSE', headerName: 'Add-On Course', width: 150 },
        { field: 'HONOUR COURSE', headerName: 'Honour Course', width: 150 },
        { field: 'MINOR COURSE', headerName: 'Minor Course', width: 150 },
    ];

    const formattedStudents = students.map(student => ({
        ...student,
        NAME: student.NAME || '--',
        'REGISTER NUMBER': student['REGISTER NUMBER'] || '--',
        GMAIL: student.GMAIL || '--',
        DEPARTMENT: student.DEPARTMENT || '--',
        YEAR: student.YEAR || '--',
        'OPEN ELECTIVE': student['OPEN ELECTIVE'] || '--',
        'PROFESSIONAL ELECTIVE': student['PROFESSIONAL ELECTIVE'] || '--',
        'ADD-ON COURSE': student['ADD-ON COURSE'] || '--',
        'HONOUR COURSE': student['HONOUR COURSE'] || '--',
        'MINOR COURSE': student['MINOR COURSE'] || '--',
    }));

    return (
        <div style={{ height: 400, width: '100%' }}>
            {formattedStudents.length > 0 ? (
                <DataGrid
                    rows={formattedStudents}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    disableSelectionOnClick
                    getRowId={(row) => row.student_id}
                />
            ) : (
                <p>No students registered for the selected filters.</p>
            )}
        </div>
    );
}

export default RegistrationsTable;
