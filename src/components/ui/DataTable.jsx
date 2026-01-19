import React from 'react';

const DataTable = ({ columns, data, keyField = 'id' }) => {
  const getRowKey = (row, index) => {
    if (row[keyField] !== undefined && row[keyField] !== null) {
      return row[keyField];
    }
    if (row.id !== undefined && row.id !== null) {
      return row.id;
    }
    return index;
  };

  if (!Array.isArray(columns) || columns.length === 0) {
    return null;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length}>No records to display</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key || column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={getRowKey(row, rowIndex)}>
            {columns.map((column) => (
              <td key={column.key || column.header}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;