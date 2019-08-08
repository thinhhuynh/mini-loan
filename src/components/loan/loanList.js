import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import moment from 'moment';

import LoanAddModal from './loanAddModal';
import useModal from './useModal';
import api from '../../api/fakeApi';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'customerName', numeric: false, disablePadding: true, label: 'Customer Name' },
  { id: 'amount', numeric: false, disablePadding: false, label: 'Loaned' },
  { id: 'repayAmount', numeric: false, disablePadding: false, label: 'Repay' },
  { id: 'paid', numeric: false, disablePadding: false, label: 'Paid' },
  { id: 'remaining', numeric: false, disablePadding: false, label: 'Remaning' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'term', numeric: false, disablePadding: false, label: 'Term (Year)' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'paidStatus', numeric: false, disablePadding: false, label: 'Paid Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
              {orderBy === row.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            <Button
                fullWidth
                color="primary"
                variant="outlined"
                onClick={props.onOpenCreate}
              >
                <AddIcon>                
                </AddIcon>
                Loan
              </Button>          
            </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {/* {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="New loan">
            <IconButton aria-label="new loan">
              <AddIcon></AddIcon>
              
            </IconButton>
          </Tooltip>
        )} */}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const isFinalRepay = (repayAmount, paidAmount, amount) => {
  repayAmount = amount - paidAmount;
}

function LoanList() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loans, setLoans] = useState([]);
  const {open, handleOpen, handleClose} = useModal();

  const fetchLoans = async () => {
    const result = await api.get('loans')
    setLoans(result.data);
  };
  useEffect(() => {
    fetchLoans();
  }, []);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = loans.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  
  /**
   * Hanldle repay with weeekly repay amount
   * @param {object} event 
   * @param {object} loan 
   */
  function handleRepay(event, loan) {
    let { id, amount, repayAmount, paidAmount, repayHistory } = loan;
    if(isFinalRepay(repayAmount, paidAmount, amount)) {
      repayAmount = amount - paidAmount;
    }
    const repay = {repayAmount: repayAmount, createdAt: moment().format()}
    const newRepayHistory = repayHistory.concat(repay);

    api.patch(`loan/${id}/`, {
        repayHistory: newRepayHistory,
        paidAmount: paidAmount + repayAmount
    })
    .then((res) => {
      // show successful message here
      fetchLoans();
    })
    .catch((error) => {
      // show error message here
      console.log(error);
    })
  }

  /**
   * Hanlde approve loan with 'pending' status
   * @param {object} event 
   * @param {object} loan 
   */
  function handleApprove(event, loan) {
    const {id} = loan;

    api.patch(`loan/${id}/`, {
      status: "approved"
    })
    .then((res) => {
      fetchLoans();
    })
    .catch((err) => {
        console.log(err);
    })  
  }

  /**
   * Hanlde deny load from 'pending' status
   * @param {object} event 
   * @param {object} loan 
   */
  function handleDeny(event, loan) {
    const {id} = loan;

    api.patch(`loan/${id}/`, {
      status: "denied"
    })
    .then((res) => {
      // getLoans();
    })
    .catch((err) => {
        console.log(err);
    })
  }

  function handleDelete(event, loan) {
    const {id} = loan;

    api.delete(`loan/${id}/`, {
      status: "denied"
    })
    .then((res) => {
      fetchLoans();
    })
    .catch((err) => {
        console.log(err);
    })
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, loans.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} 
          onOpenCreate={handleOpen}
        />
        
        <LoanAddModal
          open={open}
          onClose={handleClose}
          onFetchLoans={fetchLoans}
        >
        </LoanAddModal>
        <div className={classes.tableWrapper}>
        
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={loans.length}
            />
            <TableBody>
              {stableSort(loans, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.customerName}
                      </TableCell>
                      <TableCell align="left">$ {row.amount}</TableCell>
                      <TableCell align="left">$ {row.repayAmount}</TableCell>
                      <TableCell align="left">$ {row.paidAmount}</TableCell>
                      <TableCell align="left">$ {(row.amount - row.paidAmount).toFixed(2)}</TableCell>
                      <TableCell align="left">{moment(row.createdAt).format("Do MMM YY, h:mm a")}</TableCell>
                      <TableCell align="left">{row.term}</TableCell>
                      <TableCell align="left">
                      <Button variant="outlined" size="small" 
                        color={row.status === 'pending' ? 'default' : row.status === 'approved' ? 'primary' : 'secondary'}
                        className={classes.margin}>
                        {row.status}
                      </Button>
                      </TableCell>
                      <TableCell align="left">
                        { row.amount === row.paidAmount ? 'Fully Paid' : 'Not Paid' }
                      </TableCell>
                      <TableCell>
                        <Button 
                          color="primary"
                          disabled={row.status !== 'approved'} 
                          className={classes.button}
                          onClick={event => handleRepay(event, row)}
                        >
                          Pay
                        </Button>

                        <Button 
                          color="primary"
                          disabled={row.status !== 'pending'} 
                          className={classes.button}
                          onClick={event => handleApprove(event, row)}
                        >
                          Approve
                        </Button>

                        <Button 
                          color="secondary"
                          disabled={row.status !== 'pending'} 
                          className={classes.button}
                          onClick={event => handleDeny(event, row)}
                        >
                          Deny
                        </Button>
                        <Button 
                          color="secondary"
                          className={classes.button}
                          onClick={event => handleDelete(event, row)}
                        >
                          Delete
                        </Button>
                      </TableCell>  
                    </TableRow>                    
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={loans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>      
    </div>
  );
}

export default LoanList;
