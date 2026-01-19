import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import PlaceholderPage from '../../components/PlaceholderPage';
import { useNotification } from '../../components/Notification/NotificationProvider';
import { fetchAdminUsersRequest, addUserBalanceRequest, withdrawUserBalanceRequest, updateUserPasswordRequest, fetchUserMarketReportsRequest } from '../../redux/actions/usersActions';
import '../Users.css';

export const AddUser = () => <PlaceholderPage title="Add User" />;

export const UserList = () => {
  const dispatch = useDispatch();
  const { showSuccess, showError } = useNotification();
  
  // Get users data from Redux store
  const { users, loading, error, updatingBalance, updateBalanceError, updateBalanceSuccess, withdrawingBalance, withdrawBalanceError, withdrawBalanceSuccess, updatingPassword, updatePasswordError, updatePasswordSuccess, fetchingMarketReports, marketReports, marketReportsError } = useSelector(state => state.users);
  
  // State for deposit modal
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMarketReportsModal, setShowMarketReportsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Fetch users on component mount
  React.useEffect(() => {
    dispatch(fetchAdminUsersRequest());
  }, [dispatch]);

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (user) => user.name || '-'
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (user) => user.email || '-'
    },
    { 
      key: 'username', 
      header: 'Username',
      render: (user) => user.username || '-'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (user) => user.status === '1' ? 'Active' : 'Inactive'
    },
    { 
      key: 'balance', 
      header: 'Balance',
      render: (user) => user.balance?.toFixed(2) || '0.00'
    },
    { 
      key: 'currency', 
      header: 'Currency',
      render: (user) => user.currency?.code || '-'
    },
    { 
      key: 'browser_ip', 
      header: 'Browser IP',
      render: (user) => user.browser_ip || '-'
    },
    { 
      key: 'system_ip', 
      header: 'System IP',
      render: (user) => user.system_ip || '-'
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (user) =>
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="actions-container">
          <span 
            className="action-badge deposit"
            title="D - Deposit"
            onClick={() => {
              setSelectedUser(user);
              setDepositAmount('');
              setShowDepositModal(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            D
          </span>
          <span 
            className="action-badge withdrawal" 
            title="W - Withdrawal"
            onClick={() => {
              setSelectedUser(user);
              setWithdrawAmount('');
              setShowWithdrawModal(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            W
          </span>
          <span 
            className="action-badge update-password"
            title="UP - Update Password"
            onClick={() => {
              setSelectedUser(user);
              setNewPassword('');
              setShowPasswordModal(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            UP
          </span>
          <span 
            className="action-badge market-report"
            title="MR - Market Report"
            onClick={() => {
              handleFetchMarketReports(user);
            }}
            style={{ cursor: 'pointer' }}
          >
            MR
          </span>
        </div>
      ),
    },
  ];

  // Handle deposit submission
  const handleDepositSubmit = () => {
    if (!selectedUser) {
      showError('No user selected');
      return;
    }
    
    if (!depositAmount) {
      showError('Please enter an amount');
      return;
    }
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid positive amount');
      return;
    }

    dispatch(addUserBalanceRequest(selectedUser.id, amount));
  };

  const handleWithdrawSubmit = () => {
    if (!selectedUser) {
      showError('No user selected');
      return;
    }
    
    if (!withdrawAmount) {
      showError('Please enter an amount');
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid positive amount');
      return;
    }
    
    if (amount > (selectedUser.balance || 0)) {
      showError('Withdrawal amount exceeds current balance');
      return;
    }

    dispatch(withdrawUserBalanceRequest(selectedUser.id, amount));
  };

  // Helper function to mask password
  const maskPassword = (password) => {
    if (!password || password.length <= 4) {
      return password;
    }
    
    const firstTwo = password.substring(0, 2);
    const lastTwo = password.substring(password.length - 2);
    const masked = '*'.repeat(password.length - 4);
    
    return `${firstTwo}${masked}${lastTwo}`;
  };

  const handlePasswordSubmit = () => {
    if (!selectedUser) {
      showError('No user selected');
      return;
    }
    
    if (!newPassword) {
      showError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    dispatch(updateUserPasswordRequest(selectedUser.id, newPassword));
  };

  const handleFetchMarketReports = (user) => {
    setSelectedUser(user);
    dispatch(fetchUserMarketReportsRequest(user.id));
    setShowMarketReportsModal(true); // Open modal when fetching
  };

  // Handle deposit success and error messages
  React.useEffect(() => {
    if (updateBalanceError) {
      showError(updateBalanceError);
    }
  }, [updateBalanceError, showError]);

  React.useEffect(() => {
    if (updateBalanceSuccess) {
      showSuccess('Balance updated successfully');
      setShowDepositModal(false);
      setDepositAmount('');
    }
  }, [updateBalanceSuccess, showSuccess]);

  // Handle withdrawal success and error messages
  React.useEffect(() => {
    if (withdrawBalanceError) {
      showError(withdrawBalanceError);
    }
  }, [withdrawBalanceError, showError]);

  React.useEffect(() => {
    if (withdrawBalanceSuccess) {
      showSuccess('Balance withdrawn successfully');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    }
  }, [withdrawBalanceSuccess, showSuccess]);

  // Handle password update success and error messages
  React.useEffect(() => {
    if (updatePasswordError) {
      showError(updatePasswordError);
    }
  }, [updatePasswordError, showError]);

  React.useEffect(() => {
    if (updatePasswordSuccess) {
      showSuccess('Password updated successfully');
      setShowPasswordModal(false);
      setNewPassword('');
    }
  }, [updatePasswordSuccess, showSuccess]);

  // Handle market reports success and error messages
  React.useEffect(() => {
    if (marketReportsError) {
      showError(marketReportsError);
    }
  }, [marketReportsError, showError]);

  // Handle market reports fetch success
  React.useEffect(() => {
    if (marketReports && showMarketReportsModal) {
      showSuccess('Market reports fetched successfully');
    }
  }, [marketReports, showMarketReportsModal, showSuccess]);

  const renderContent = () => {
    if (loading) {
      return <p>Loading users...</p>;
    }

    if (error) {
      return <p>Failed to load users: {typeof error === 'string' ? error : error.message || 'Unknown error'}</p>;
    }



    return (
      <div>
        <div style={{ marginBottom: '1rem', color: '#666' }}>
          Showing {users.length} users
        </div>
        <DataTable columns={columns} data={users} />
        
        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="modal-overlay" onClick={() => {
            if (!updatingBalance) {
              setShowDepositModal(false);
              setDepositAmount('');
            }
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Deposit to User</h3>
                <button 
                  className="modal-close" 
                  onClick={() => {
                    if (!updatingBalance) {
                      setShowDepositModal(false);
                      setDepositAmount('');
                    }
                  }}
                  disabled={updatingBalance}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>User:</label>
                  <input 
                    type="text" 
                    value={`${selectedUser?.name || ''} (${selectedUser?.email || ''})`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  <label>Current Balance:</label>
                  <input 
                    type="text" 
                    value={`$${parseFloat(selectedUser?.balance || 0).toFixed(2)}`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  <label>Amount to Add:</label>
                  <input 
                    type="number" 
                    placeholder="Enter deposit amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={updatingBalance}
                  />
                </div>
                <div className="modal-form-group">
                  <label>New Balance:</label>
                  <input 
                    type="text" 
                    value={`$${(parseFloat(selectedUser?.balance || 0) + parseFloat(depositAmount || 0)).toFixed(2)}`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleDepositSubmit}
                    disabled={updatingBalance}
                  >
                    {updatingBalance ? 'Processing...' : 'Submit Deposit'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      if (!updatingBalance) {
                        setShowDepositModal(false);
                        setDepositAmount('');
                      }
                    }}
                    disabled={updatingBalance}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="modal-overlay" onClick={() => {
            if (!withdrawingBalance) {
              setShowWithdrawModal(false);
              setWithdrawAmount('');
            }
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Withdraw from User</h3>
                <button 
                  className="modal-close" 
                  onClick={() => {
                    if (!withdrawingBalance) {
                      setShowWithdrawModal(false);
                      setWithdrawAmount('');
                    }
                  }}
                  disabled={withdrawingBalance}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>User:</label>
                  <input 
                    type="text" 
                    value={`${selectedUser?.name || ''} (${selectedUser?.email || ''})`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  <label>Current Balance:</label>
                  <input 
                    type="text" 
                    value={`$${parseFloat(selectedUser?.balance || 0).toFixed(2)}`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  <label>Amount to Withdraw:</label>
                  <input 
                    type="number" 
                    placeholder="Enter withdrawal amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={withdrawingBalance}
                  />
                </div>
                <div className="modal-form-group">
                  <label>Final Balance:</label>
                  <input 
                    type="text" 
                    value={`$${(parseFloat(selectedUser?.balance || 0) - parseFloat(withdrawAmount || 0)).toFixed(2)}`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleWithdrawSubmit}
                    disabled={withdrawingBalance}
                  >
                    {withdrawingBalance ? 'Processing...' : 'Submit Withdrawal'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      if (!withdrawingBalance) {
                        setShowWithdrawModal(false);
                        setWithdrawAmount('');
                      }
                    }}
                    disabled={withdrawingBalance}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Password Update Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => {
            if (!updatingPassword) {
              setShowPasswordModal(false);
              setNewPassword('');
            }
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Update User Password</h3>
                <button 
                  className="modal-close" 
                  onClick={() => {
                    if (!updatingPassword) {
                      setShowPasswordModal(false);
                      setNewPassword('');
                    }
                  }}
                  disabled={updatingPassword}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>User:</label>
                  <input 
                    type="text" 
                    value={`${selectedUser?.name || ''} (${selectedUser?.email || ''})`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  <label>Current Password:</label>
                  <div className="password-field">
                    <input 
                      type="text" 
                      value={showCurrentPassword ? (selectedUser?.passwordText || '') : maskPassword(selectedUser?.passwordText || '')} 
                      readOnly 
                      disabled
                    />
                    <span 
                      className="password-toggle-icon"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      title={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                    </span>
                  </div>
                </div>
                <div className="modal-form-group">
                  <label>New Password:</label>
                  <div className="password-field">
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={updatingPassword}
                    />
                    <span 
                      className="password-toggle-icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handlePasswordSubmit}
                    disabled={updatingPassword}
                  >
                    {updatingPassword ? 'Processing...' : 'Update Password'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      if (!updatingPassword) {
                        setShowPasswordModal(false);
                        setNewPassword('');
                      }
                    }}
                    disabled={updatingPassword}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Market Reports Modal */}
        {showMarketReportsModal && (
          <div className="modal-overlay" onClick={() => {
            setShowMarketReportsModal(false);
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Market Reports for {selectedUser?.name || ''}</h3>
                <button 
                  className="modal-close" 
                  onClick={() => {
                    setShowMarketReportsModal(false);
                  }}
                  disabled={false}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-form-group">
                  <label>User:</label>
                  <input 
                    type="text" 
                    value={`${selectedUser?.name || ''} (${selectedUser?.email || ''})`} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="modal-form-group">
                  {fetchingMarketReports ? (
                    <div className="loading-indicator">Fetching market reports...</div>
                  ) : marketReports ? (
                    <div className="market-reports-content">
                      <pre>{JSON.stringify(marketReports, null, 2)}</pre>
                    </div>
                  ) : (
                    <div>No market reports available</div>
                  )}
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowMarketReportsModal(false);
                    }}
                    disabled={false}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        <p>View all registered users</p>
      </div>
      <div className="users-table">
        <Card>{renderContent()}</Card>
      </div>
    </div>
  );
};

export const InactiveUsers = () => (
  <PlaceholderPage title="Inactive Users" />
);
