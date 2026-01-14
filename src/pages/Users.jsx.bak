import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Users.css';

const Users = () => {
  return (
    <div className="users-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage user accounts and permissions</p>
      </div>
      
      <div className="page-actions">
        <Button variant="primary">Add New User</Button>
      </div>
      
      <div className="users-table">
        <Card>
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>001</td>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td>Active</td>
                <td>
                  <Button variant="secondary" size="small">Edit</Button>
                </td>
              </tr>
              <tr>
                <td>002</td>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>User</td>
                <td>Active</td>
                <td>
                  <Button variant="secondary" size="small">Edit</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Users;