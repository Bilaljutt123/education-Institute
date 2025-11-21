// src/components/ApplicationList.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Application } from '@/types';

interface ApplicationListProps {
  // We will pass the user's applications as a prop
  applications: Application[];
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  if (!applications || applications.length === 0) {
    return <p>No applications found.</p>;
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app._id} className="mb-4">
          <CardHeader>
            <CardTitle>{app.desiredCourse}</CardTitle>
              <CardDescription>
                Status: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  app.status === 'pending'
                    ? 'bg-yellow-600'
                    : app.status === 'accepted'
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}>
                  {app.status}
                </span>
                - Submitted on: {new Date(app.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* You can add more details here if you want */}
            </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationList;