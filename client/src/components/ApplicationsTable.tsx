// src/components/ApplicationsTable.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// import { Application } from '@/types';
import { getApplications, updateApplicationStatus } from '@/utils/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Application } from '@/types';

const ApplicationsTable = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Only fetch if user is an admin
    if (user?.role === 'admin') {
      const fetchApplications = async () => {
        try {
          const res = await getApplications(); // Use the new typed function
          setApplications(res.data);
        } catch (err) {
          console.error('Could not fetch applications:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchApplications();
    }
  }, [user]);

  const handleAccept = async (id: string) => {
    try {
      await updateApplicationStatus(id, { status: 'accepted' });
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'accepted' } : app));
    } catch (err) {
      console.error('Could not accept application:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateApplicationStatus(id, { status: 'rejected' });
      setApplications(prev => prev.map(app => app._id === id ? { ...app, status: 'rejected' } : app));
    } catch (err) {
      console.error('Could not reject application:', err);
    }
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div>Access denied. Admin role required.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Applications</CardTitle>
          <CardDescription>
            View and manage student applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Desired Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.student.name}</TableCell>
                    <TableCell>{app.student.email}</TableCell>
                    <TableCell>{app.desiredCourse}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleAccept(app._id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                        variant="ghost"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleReject(app._id)}
                        className="text-red-600 hover:text-red-800 mr-2"
                        variant="ghost"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No applications found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsTable;