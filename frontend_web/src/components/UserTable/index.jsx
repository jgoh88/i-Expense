import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';  
import UserEditModal from '../UserEditModal';

const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 150, align: 'left', },
    { id: 'lastName', label: 'Last Name', minWidth: 150, align: 'left', },
    { id: 'email', label: 'Email', minWidth: 170, align: 'left', },
    { id: 'contactNo', label: 'Contact No', minWidth: 150, align: 'left', },
    { 
        id: 'role', 
        label: 'Role', 
        minWidth: 100,
        align: 'left',
        format: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
]

export default function UserTable(props) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    function handleChangePage(e, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(e) {
        setRowsPerPage(+e.target.value);
        setPage(0);
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: "80vh" }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                                        {columns.map((column) => {
                                            const value = user[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format
                                                    ? column.format(value)
                                                    : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <UserEditModal user={user} users={props.users} onUserEdit={props.onUserEdit} token={props.token} />
                                        </TableCell>
                                    </TableRow>
                                );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={props.users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}