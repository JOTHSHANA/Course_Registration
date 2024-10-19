import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

function RegistrationsTable({ students }) {
    const [filterModel, setFilterModel] = useState({
        items: [],
    });

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'code', headerName: 'Code', width: 150 },
        { field: 'course_name', headerName: 'Course Name', width: 200 },
        { field: 'reg_no', headerName: 'Registration No.', width: 150 },
        { field: 'year', headerName: 'Year', width: 100 },
        { field: 'course_type', headerName: 'Course Type', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'gmail', headerName: 'Gmail', width: 200 },
        { field: 'type', headerName: 'Type', width: 150 }
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={students}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                filterModel={filterModel}
                onFilterModelChange={(model) => setFilterModel(model)}
                getRowId={(row) => row.reg_no} // Assuming reg_no is unique for each student
            />
        </div>
    );
}

export default RegistrationsTable;
