/**
 * Custom Hook - useAttendance
 * Provides attendance data fetching and management
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../services/firebase.config';

export const useAttendance = (userId) => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalDaysMarked: 0,
        attendancePercentage: 0,
        lastMarked: null
    });

    const fetchAttendanceRecords = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const constraints = [where('userId', '==', userId)];
            const q = query(collection(db, 'attendance'), ...constraints);
            const querySnapshot = await getDocs(q);

            const records = [];
            querySnapshot.forEach((doc) => {
                records.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Sort by timestamp in descending order
            records.sort((a, b) => {
                const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp.seconds * 1000);
                const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp.seconds * 1000);
                return timeB - timeA;
            });

            setAttendanceRecords(records);

            // Calculate stats
            if (records.length > 0) {
                const uniqueDates = new Set();
                records.forEach((record) => {
                    const date = record.timestamp instanceof Date
                        ? record.timestamp
                        : new Date(record.timestamp.seconds * 1000);
                    uniqueDates.add(date.toISOString().split('T')[0]);
                });

                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const daysSinceStart = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

                setStats({
                    totalDaysMarked: uniqueDates.size,
                    attendancePercentage: daysSinceStart > 0 ? ((uniqueDates.size / daysSinceStart) * 100).toFixed(1) : 0,
                    lastMarked: records[0].timestamp
                });
            } else {
                setStats({
                    totalDaysMarked: 0,
                    attendancePercentage: 0,
                    lastMarked: null
                });
            }
        } catch (err) {
            console.error('Error fetching attendance records:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, [fetchAttendanceRecords]);

    return {
        attendanceRecords,
        isLoading,
        error,
        stats,
        refetch: fetchAttendanceRecords
    };
};

export default useAttendance;
