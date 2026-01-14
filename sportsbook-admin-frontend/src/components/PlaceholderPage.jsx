import React from 'react';
import Card from './ui/Card';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="p-4">
      <Card>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
          <p className="text-gray-500 mt-2">This page is under construction.</p>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderPage;