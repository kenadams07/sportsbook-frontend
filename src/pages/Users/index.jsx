import React from 'react';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import PlaceholderPage from '../../components/PlaceholderPage';
import useApi from '../../hooks/useApi';
import { api } from '../../services/api';
import '../Users.css';

export const AddUser = () => <PlaceholderPage title="Add User" />;

export const UserList = () => {
  const { data, loading, error } = useApi(api.getAdminUsers, []);

  const users = Array.isArray(data) ? data : [];

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (user) =>
        user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      render: (user) =>
        user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '',
    },
  ];

  const renderContent = () => {
    if (loading) {
      return <p>Loading users...</p>;
    }

    if (error) {
      if (error.response && error.response.status === 401) {
        return (
          <p>
            Unauthorized. Check the admin API token configuration.
          </p>
        );
      }

      return <p>Failed to load users.</p>;
    }

    return <DataTable columns={columns} data={users} />;
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
