import { useState } from 'react';
import axiosBackend from '../../configs/axiosBackend';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';  
import IconButton from '@mui/material/IconButton';
import PaidIcon from '@mui/icons-material/Paid';
import Tooltip from '@mui/material/Tooltip';

const columns = [
    { 
        id: 'title', 
        label: 'Expense Title', 
        minWidth: 250,
        align: 'left',
        numeric: false, 
    },
    { 
        id: 'status', 
        label: 'Status', 
        minWidth: 150,
        numeric: false,
        align: 'left',
        format: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    { 
        id: 'createdBy', 
        label: 'Requester', 
        minWidth: 150,
        numeric: false,
        align: 'left',
        format: (value) => `${value.firstName} ${value.lastName}`
    },
    { 
        id: 'approver', 
        label: 'Approver', 
        minWidth: 100,
        numeric: false,
        align: 'left',
        format: (value) => `${value.firstName} ${value.lastName}`
    },
    { 
        id: 'expenseItems', 
        label: 'Total Amount (RM)', 
        minWidth: 50,
        numeric: true,
        align: 'right',
        paddingRight: 5,
        format: (value) => value.reduce((t, c) => t + c.amount, 0)
    },
]

export default function ExpenseTable(props) {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    function handleChangePage(e, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(e) {
        setRowsPerPage(+e.target.value);
        setPage(0);
    }

    async function handleMarkAsPaid(expenseId) {
        const reqBody ={
            id: expenseId,
            data: {
                status: 'paid'
            },
        }
        try {
            await axiosBackend.put('/expense', reqBody, {
                headers: {
                    authorization: `Bearer ${props.token}`
                }
            })
            props.onExpenseUpdate()
        } catch (err) {
            console.log(err)
        }
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
                                    sx={{ backgroundColor: "#1976d2", color: "#fff", paddingRight: column.paddingRight }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                sx={{ backgroundColor: "#1976d2", color: "#fff", minWidth: 150 }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.expenses
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((expense) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={expense._id}>
                                        {columns.map((column) => {
                                            const value = expense[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{paddingRight: column.paddingRight}}>
                                                    {column.format
                                                    ? column.format(value)
                                                    : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            {expense.status === 'approved' 
                                                ? <Tooltip title="Mark as paid">
                                                    <IconButton 
                                                        aria-label="edit user"
                                                        onClick={() => handleMarkAsPaid(expense._id)}
                                                    >
                                                        <PaidIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                : null}
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
                count={props.expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}



// For try to implement sort and filter
// import { useState, useMemo } from 'react';

// import PropTypes from 'prop-types';
// import { alpha } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { visuallyHidden } from '@mui/utils';

// const columns = [
//     { 
//         id: 'title', 
//         label: 'Expense Title', 
//         minWidth: 200,
//         numeric: false, 
//     },
//     { 
//         id: 'status', 
//         label: 'Status', 
//         minWidth: 100,
//         numeric: false,
//         format: (value) => value.charAt(0).toUpperCase() + value.slice(1),
//     },
//     { 
//         id: 'createdBy', 
//         label: 'Requester', 
//         minWidth: 200,
//         numeric: false,
//     },
//     { 
//         id: 'approver', 
//         label: 'Approver', 
//         minWidth: 200,
//         numeric: false,
//     },
//     { 
//         id: 'expenseItems', 
//         label: 'Amount', 
//         minWidth: 100,
//         numeric: true,
//     },
// ]

// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }

// function getComparator(order, orderBy) {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//         return order;
//     }
//     return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }

// function EnhancedTableHead(props) {
//     const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
//     const createSortHandler = (property) => (event) => {
//         onRequestSort(event, property);
//     };

//     return (
//         <TableHead>
//             <TableRow>
//             <TableCell padding="checkbox">
//                 <Checkbox
//                     color="primary"
//                     indeterminate={numSelected > 0 && numSelected < rowCount}
//                     checked={rowCount > 0 && numSelected === rowCount}
//                     onChange={onSelectAllClick}
//                     inputProps={{
//                         'aria-label': 'select all expenses',
//                     }}
//                 />
//             </TableCell>
//                 {columns.map((column) => (
//                     <TableCell
//                         key={column.id}
//                         align={column.numeric ? 'right' : 'left'}
//                         padding={'normal'}
//                         style={{ minWidth: column.minWidth }}
//                         sortDirection={orderBy === column.id ? order : false}
//                     >
//                         <TableSortLabel
//                             active={orderBy === column.id}
//                             direction={orderBy === column.id ? order : 'asc'}
//                             onClick={createSortHandler(column.id)}
//                         >
//                             {column.label}
//                             {orderBy === column.id 
//                             ? (
//                                 <Box component="span" sx={visuallyHidden}>
//                                     {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                                 </Box>
//                             ) : null}
//                         </TableSortLabel>
//                     </TableCell>
//                 ))}
//                 <TableCell
//                     style={{ minWidth: 50 }}
//                 >
//                     Action
//                 </TableCell>
//             </TableRow>
//         </TableHead>
//     );
// }

// EnhancedTableHead.propTypes = {
//     numSelected: PropTypes.number.isRequired,
//     onRequestSort: PropTypes.func.isRequired,
//     onSelectAllClick: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     rowCount: PropTypes.number.isRequired,
// };

// function EnhancedTableToolbar(props) {
//     const { numSelected } = props;

//     return (
//         <Toolbar
//             sx={{
//             pl: { sm: 2 },
//             pr: { xs: 1, sm: 1 },
//             ...(numSelected > 0 && {
//                 bgcolor: (theme) =>
//                 alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//             }),
//             }}
//         >
//             {numSelected > 0 ? (
//             <Typography
//                 sx={{ flex: '1 1 100%' }}
//                 color="inherit"
//                 variant="subtitle1"
//                 component="div"
//             >
//                 {numSelected} selected
//             </Typography>
//             ) : null}

//             {numSelected > 0 
//             ? (
//                 <Tooltip title="Delete">
//                     <IconButton>
//                         <DeleteIcon />
//                     </IconButton>
//                 </Tooltip>
//             ) : (
//                 <Tooltip title="Filter list">
//                     <IconButton>
//                         <FilterListIcon />
//                     </IconButton>
//                 </Tooltip>
//             )}
//         </Toolbar>
//     );
// }

// EnhancedTableToolbar.propTypes = {
//     numSelected: PropTypes.number.isRequired,
// };

// export default function ExpenseTable(props) {
//     const [order, setOrder] = useState('asc');
//     const [orderBy, setOrderBy] = useState('calories');
//     const [selected, setSelected] = useState([]);
//     const [page, setPage] = useState(0);
//     const [dense, setDense] = useState(false);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
  
//     function handleRequestSort(e, property) {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };
  
//     function handleSelectAllClick(e) {
//         if (e.target.checked) {
//             const newSelected = props.expenses.map((n) => n._id);
//             setSelected(newSelected);
//             return;
//         }
//         setSelected([]);
//     };
  
//     function handleClick(e, name) {
//         const selectedIndex = selected.indexOf(name);
//         let newSelected = [];
    
//         if (selectedIndex === -1) {
//             newSelected = newSelected.concat(selected, name);
//         } else if (selectedIndex === 0) {
//             newSelected = newSelected.concat(selected.slice(1));
//         } else if (selectedIndex === selected.length - 1) {
//             newSelected = newSelected.concat(selected.slice(0, -1));
//         } else if (selectedIndex > 0) {
//             newSelected = newSelected.concat(
//             selected.slice(0, selectedIndex),
//             selected.slice(selectedIndex + 1),
//             );
//         }
    
//         setSelected(newSelected);
//     };
  
//     const handleChangePage = (event, newPage) => {
//       setPage(newPage);
//     };
  
//     const handleChangeRowsPerPage = (event) => {
//       setRowsPerPage(parseInt(event.target.value, 10));
//       setPage(0);
//     };
  
//     const handleChangeDense = (event) => {
//       setDense(event.target.checked);
//     };
  
//     const isSelected = (name) => selected.indexOf(name) !== -1;
  
//     // Avoid a layout jump when reaching the last page with empty rows.
//     const emptyRows =
//       page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.expenses.length) : 0;
  
//     const visibleRows = useMemo(
//       () =>
//         stableSort(props.expenses, getComparator(order, orderBy)).slice(
//           page * rowsPerPage,
//           page * rowsPerPage + rowsPerPage,
//         ),
//       [order, orderBy, page, rowsPerPage],
//     );
  
//     return (
//         <Box sx={{ width: '100%' }}>
//             <Paper sx={{ width: '100%', mb: 2 }}>
//             <EnhancedTableToolbar numSelected={selected.length} />
//             <TableContainer>
//                 <Table
//                 sx={{ minWidth: 750 }}
//                 aria-labelledby="tableTitle"
//                 size={dense ? 'small' : 'medium'}
//                 >
//                 <EnhancedTableHead
//                     numSelected={selected.length}
//                     order={order}
//                     orderBy={orderBy}
//                     onSelectAllClick={handleSelectAllClick}
//                     onRequestSort={handleRequestSort}
//                     rowCount={props.expenses.length}
//                 />
//                 <TableBody>
//                     {visibleRows.map((row, index) => {
//                         const isItemSelected = isSelected(row.name);
//                         const labelId = `enhanced-table-checkbox-${index}`;
        
//                         return (
//                             <TableRow
//                                 hover
//                                 onClick={(event) => handleClick(event, row.name)}
//                                 role="checkbox"
//                                 aria-checked={isItemSelected}
//                                 tabIndex={-1}
//                                 key={row.name}
//                                 selected={isItemSelected}
//                                 sx={{ cursor: 'pointer' }}
//                             >
//                             <TableCell padding="checkbox">
//                                 <Checkbox
//                                 color="primary"
//                                 checked={isItemSelected}
//                                 inputProps={{
//                                     'aria-labelledby': labelId,
//                                 }}
//                                 />
//                             </TableCell>
//                             <TableCell
//                                 component="th"
//                                 id={labelId}
//                                 scope="row"
//                                 padding="none"
//                             >
//                                 {row.name}
//                             </TableCell>
//                             <TableCell align="right">{row.calories}</TableCell>
//                             <TableCell align="right">{row.fat}</TableCell>
//                             <TableCell align="right">{row.carbs}</TableCell>
//                             <TableCell align="right">{row.protein}</TableCell>
//                             </TableRow>
//                         );
//                     })}
//                     {emptyRows > 0 && (
//                     <TableRow
//                         style={{
//                         height: (dense ? 33 : 53) * emptyRows,
//                         }}
//                     >
//                         <TableCell colSpan={6} />
//                     </TableRow>
//                     )}
//                 </TableBody>
//                 </Table>
//             </TableContainer>
//             <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={props.expenses.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//             </Paper>
//         </Box>
//     );
// }