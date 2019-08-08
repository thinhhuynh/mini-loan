import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';

import api from '../../api/fakeApi';
import { useForm } from '../../utils/validator';


const LoanAddModal = ({
  open, 
  onClose, 
  onFetchLoans
}) => {
  const defaultLoan = {
    customerName: '',
    amount: '',
    repayAmount: '',
    paidAmount: 0,
    term: 1,
    status: 'pending',
    createdAt: moment().format(),
    repaid: false,
    repayHistory: []  
  }
  const [fullWidth] = useState(true);
  const [maxWidth] = useState('sm');
  const { values, setValues, useInput, isValid } = useForm(defaultLoan);

  /**
   * Hanlde input change
   * @param {object} e 
   */
  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
  }

  /**
   * Hanle create new loan
   * @param {object} e 
   */
  const handleSubmit = e => {
    e.preventDefault();
    
    api.post('loans', values)
    .then((res) => {
        if(res.request.statusText === "Created") {
          onFetchLoans();
          setValues({...values, ...defaultLoan});
          // show successful message
          console.log('Create loan successful');
        }
    })
    .catch((error) => {
      // show error message;
      console.log('Create loan error', error);
    })
    onClose(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <Dialog 
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open} 
        onClose={onClose} 
        aria-labelledby="form-dialog-title" 
      >
        <DialogTitle id="form-dialog-title">New Loan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="customerName"
            label="Customer Name *"
            type="text"
            fullWidth
            onChange={handleInputChange}
            value={values.customerName}
            {...useInput('customerName', 'isRequired')}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            id="amount"
            name="amount"
            label="Loan Amount (USD) *"
            type="number"
            fullWidth
            onChange={handleInputChange}
            value={values.amount}
            {...useInput('amount', 'isRequired')}

          />
        </DialogContent>
        
        <DialogContent>
          <TextField
            margin="dense"
            id="repayAmount"
            name="repayAmount"
            label="Weekly Repay Amount (USD) *"
            type="number"
            fullWidth
            onChange={handleInputChange}
            value={values.repayAmount}
            {...useInput('repayAmount', 'isRequired')}
          />
        </DialogContent>
        <DialogContent>
          <TextField
            margin="dense"
            id="term"
            name="term"
            label="Loan Term (Year) *"
            type="number"
            fullWidth
            onChange={handleInputChange}
            value={values.term}
            {...useInput('term', {isRequired: true})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="outlined" disabled={!isValid}>
            Create Loan
          </Button>
        </DialogActions>
      </Dialog>
      </form>
    </div>
  );
};

export default LoanAddModal;