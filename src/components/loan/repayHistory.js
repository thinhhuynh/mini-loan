import React, { useState, useEffect } from 'react';

import Divider from '@material-ui/core/Divider';

import api from '../../api/fakeApi';
import moment from 'moment';
// import swal from 'sweetalert';

function RepayHistory() {
  const [loans, setLoans] = useState([]);

  // Fetch all loand with existing repay history
  const fetchLoans = async () => {
    const result = await api.get('loans')
    const responseLoans = result.data;
    const approvedLoans = responseLoans.filter((loan) => loan.status === "approved")
    setLoans(approvedLoans);
  };

  useEffect(() => {
    fetchLoans();
  }, []);
    
  return ( 
    <div>
      {
        loans.length === 0 ?  <h4>There are no loans.</h4> :
        loans.map((loan) => {
        return (
          <div className="col s12">
          <h4>{loan.customerName} <span style={{fontWeight: 'normal'}}>loaned ${loan.amount}</span></h4>
            <ul style={{textAlign: 'left'}}>
              {
                loan.repayHistory.map((repayHistory) => {
                  return (
                    <li>Repaid ${repayHistory.repayAmount} on {moment(repayHistory.createdAt).format("Do MMM YY, h:mm a")}</li>
                  )
                })
              }
            </ul>
            <Divider variant="middle" />
          </div>
        )
    })}
    </div>
  )
}

export default RepayHistory;