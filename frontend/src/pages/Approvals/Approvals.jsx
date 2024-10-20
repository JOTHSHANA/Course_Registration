import React, { useState, useEffect } from 'react';
import requestApi from "../../components/utils/axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import RButton from '../../components/Button/RejectButton';
import AButton from '../../components/Button/ApproveButton';
import './Approvals.css';

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const result = await requestApi("GET", "/approvals");
        if (result.success) {
          setApprovals(result.data);
        } else {
          console.error("Error fetching approvals", result.error);
        }
      } catch (error) {
        console.error("Error during fetch approvals", error);
      }
    };

    fetchApprovals();
  }, []);

  const handleApprove = (approval) => {
    setSelectedApproval(approval);
    setOpenApproveDialog(true);
  };

  const handleReject = (approval) => {
    setSelectedApproval(approval);
    setOpenRejectDialog(true);
  };

  const confirmApprove = async () => {
    try {
      const { student_id, f_course_id, t_course_id } = selectedApproval;
      const result = await requestApi("POST", "/approval-req", {
        student: student_id,
        f_course: f_course_id,
        t_course: t_course_id
      });

      if (result.success) {
        console.log("Approval successful");
        setOpenApproveDialog(false);
        setApprovals(approvals.filter(a => a.student_id !== student_id));
      } else {
        console.error("Error approving course change", result.error);
      }
    } catch (error) {
      console.error("Error during course approval", error);
    }
  };

  const confirmReject = async () => {
    try {
      const { student_id, f_course_id, t_course_id } = selectedApproval;
      const result = await requestApi("POST", "/reject", {
        student: student_id,
        f_course: f_course_id,
        t_course: t_course_id,
        reason: reason
      });

      if (result.success) {
        console.log("Rejection successful");
        setOpenRejectDialog(false);
        setApprovals(approvals.filter(a => a.student_id !== student_id));
      } else {
        console.error("Error rejecting course change", result.error);
      }
    } catch (error) {
      console.error("Error during course rejection", error);
    }
  };

  return (
    <div className="approvals-container">
      {approvals.length === 0 && <p>No approval requests available.</p>}

      <div className="approval-grid">
        {approvals.map((approval) => (
          <div key={approval.student_id} className="approval-card">
            <div className="card-content">
              <h4>{approval.student_name} ({approval.student_reg_no})</h4>
              <hr />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p><strong>Registered Course:</strong> {approval.f_course_code} - {approval.f_course_name} ({approval.f_course_type})</p>
                <p><strong>Requested Course:</strong> {approval.t_course_code} - {approval.t_course_name} ({approval.t_course_type})</p>
                <p><strong>Requested Count:</strong> {approval.count}</p>
                <div className="button-group">
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <RButton onClick={() => handleReject(approval)} label="Reject" />
                  <AButton onClick={() => handleApprove(approval)} label="Approve" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openApproveDialog} fullWidth onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          Are you sure you want to approve this course change?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={confirmApprove} color="primary">Approve</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRejectDialog} fullWidth onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Course Change</DialogTitle>
        <div></div>
        <DialogContent>
          <TextField
            label="Reason for Rejection"
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={confirmReject} color="secondary">Reject</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Approvals;
