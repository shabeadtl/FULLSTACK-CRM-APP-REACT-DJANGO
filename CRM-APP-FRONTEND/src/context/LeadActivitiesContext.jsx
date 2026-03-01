import React, { createContext, useContext, useState, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "../services/api";

const LeadActivitiesContext = createContext();

export const useLeadActivities = () => {
    const context = useContext(LeadActivitiesContext);
    if (!context) {
        throw new Error("useLeadActivities must be used within LeadActivitiesProvider");
    }
    return context;
};

export const LeadActivitiesProvider = ({ children }) => {
    const [activities, setActivities] = useState([]);
    const [loadedLeads, setLoadedLeads] = useState(new Set());

    const getActivitiesByLead = useCallback(async (leadId) => {
        const id = parseInt(leadId);
        if (!loadedLeads.has(id)) {
            try {
                const res = await apiGet(`/leads/${id}/activities/`);
                if (res && res.ok) {
                    const data = await res.json();
                    const parsed = data.map(a => ({
                        ...a,
                        leadId: id,
                        date: a.date ? new Date(a.date) : null,
                        dueDate: a.due_date ? new Date(a.due_date) : null,
                        startDate: a.start_date ? new Date(a.start_date) : null,
                        createdAt: a.created_at ? new Date(a.created_at) : new Date(),
                        createdBy: a.created_by || "You",
                    }));
                    setActivities(prev => {
                        const filtered = prev.filter(a => a.leadId !== id);
                        return [...filtered, ...parsed];
                    });
                    setLoadedLeads(prev => new Set([...prev, id]));
                    return parsed;
                }
            } catch (err) {
                console.error("Error fetching activities:", err);
            }
        }
        return activities.filter(a => a.leadId === id);
    }, [activities, loadedLeads]);

    const getActivitiesByType = useCallback((leadId, type) => {
        return activities.filter(a =>
            a.leadId === parseInt(leadId) && a.type === type
        );
    }, [activities]);
    const refreshActivities = useCallback(async (leadId) => {
        const id = parseInt(leadId);
        try {
            const res = await apiGet(`/leads/${id}/activities/`);
            if (res && res.ok) {
                const data = await res.json();
                const parsed = data.map(a => ({
                    ...a,
                    leadId: id,
                    date: a.date ? new Date(a.date) : null,
                    dueDate: a.due_date ? new Date(a.due_date) : null,
                    startDate: a.start_date ? new Date(a.start_date) : null,
                    createdAt: a.created_at ? new Date(a.created_at) : new Date(),
                    createdBy: a.created_by || "You",
                }));
                setActivities(prev => {
                    const filtered = prev.filter(a => a.leadId !== id);
                    return [...filtered, ...parsed];
                });
                return parsed;
            }
        } catch (err) {
            console.error("Error refreshing activities:", err);
        }
        return activities.filter(a => a.leadId === id);
    }, [activities]);

    const addActivity = useCallback(async (leadId, activityData) => {
        try {
            const payload = {
                type: activityData.type,
                title: activityData.title,
                description: activityData.description || activityData.content || "",
                date: activityData.date ? activityData.date.toISOString() : null,
                due_date: activityData.dueDate ? activityData.dueDate.toISOString() : null,
                start_date: activityData.startDate ? activityData.startDate.toISOString() : null,
                completed: activityData.completed || false,
                created_by: activityData.createdBy || "You",
            };
            const res = await apiPost(`/leads/${leadId}/activities/`, payload);
            if (res && res.ok) {
                const data = await res.json();
                const newActivity = {
                    ...data,
                    leadId: parseInt(leadId),
                    date: data.date ? new Date(data.date) : null,
                    dueDate: data.due_date ? new Date(data.due_date) : null,
                    startDate: data.start_date ? new Date(data.start_date) : null,
                    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
                    createdBy: data.created_by || "You",
                };
                setActivities(prev => [newActivity, ...prev]);
                return newActivity;
            }
        } catch (err) {
            console.error("Error adding activity:", err);
        }
    }, []);

    const updateActivity = useCallback(async (activityId, updatedData) => {
        const existing = activities.find(a => a.id === activityId);
        if (!existing) return;
        try {
            const payload = {
                type: updatedData.type || existing.type,
                title: updatedData.title || existing.title,
                description: updatedData.description !== undefined ? updatedData.description : existing.description,
                date: updatedData.date ? updatedData.date.toISOString() : null,
                due_date: updatedData.dueDate ? updatedData.dueDate.toISOString() : null,
                start_date: updatedData.startDate ? updatedData.startDate.toISOString() : null,
                completed: updatedData.completed !== undefined ? updatedData.completed : existing.completed,
                created_by: updatedData.createdBy || existing.createdBy,
            };
            const res = await apiPut(`/leads/${existing.leadId}/activities/${activityId}/`, payload);
            if (res && res.ok) {
                const data = await res.json();
                setActivities(prev =>
                    prev.map(a =>
                        a.id === activityId ? {
                            ...data,
                            leadId: existing.leadId,
                            date: data.date ? new Date(data.date) : null,
                            dueDate: data.due_date ? new Date(data.due_date) : null,
                            startDate: data.start_date ? new Date(data.start_date) : null,
                            createdAt: data.created_at ? new Date(data.created_at) : new Date(),
                            createdBy: data.created_by || "You",
                        } : a
                    )
                );
            }
        } catch (err) {
            console.error("Error updating activity:", err);
        }
    }, [activities]);

    const deleteActivity = useCallback(async (activityId) => {
        const existing = activities.find(a => a.id === activityId);
        if (!existing) return;
        try {
            const res = await apiDelete(`/leads/${existing.leadId}/activities/${activityId}/`);
            if (res && (res.ok || res.status === 204)) {
                setActivities(prev => prev.filter(a => a.id !== activityId));
            }
        } catch (err) {
            console.error("Error deleting activity:", err);
        }
    }, [activities]);

    const toggleTaskComplete = useCallback(async (activityId) => {
        const existing = activities.find(a => a.id === activityId);
        if (!existing) return;
        try {
            const res = await apiPatch(`/leads/${existing.leadId}/activities/${activityId}/toggle/`);
            if (res && res.ok) {
                const data = await res.json();
                setActivities(prev =>
                    prev.map(a =>
                        a.id === activityId
                            ? { ...a, completed: data.completed }
                            : a
                    )
                );
            }
        } catch (err) {
            console.error("Error toggling activity:", err);
        }
    }, [activities]);

    const getUpcomingActivities = useCallback((leadId) => {
        return activities.filter(a =>
            a.leadId === parseInt(leadId) &&
            a.type === "task" &&
            !a.completed
        ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }, [activities]);

    const getHistoryActivities = useCallback((leadId) => {
        return activities.filter(a =>
            a.leadId === parseInt(leadId) &&
            (a.type !== "task" || a.completed)
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [activities]);

    const isOverdue = useCallback((activity) => {
        if (activity.type !== "task" || activity.completed) return false;
        const now = new Date();
        const dueDate = new Date(activity.dueDate);
        return dueDate < now;
    }, []);

    const value = {
        activities,
        getActivitiesByLead,
        getActivitiesByType,
        addActivity,
        refreshActivities,
        updateActivity,
        deleteActivity,
        toggleTaskComplete,
        getUpcomingActivities,
        getHistoryActivities,
        isOverdue
    };

    return (
        <LeadActivitiesContext.Provider value={value}>
            {children}
        </LeadActivitiesContext.Provider>
    );
};

export default LeadActivitiesContext;
