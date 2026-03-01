
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";


const STATUS_COLORS = {
    "New": { bg: "#dbeafe", color: "#2563eb" },
    "Open": { bg: "#f0fdf4", color: "#16a34a" },
    "In Progress": { bg: "#fef3c7", color: "#d97706" },
    "Qualified Lead": { bg: "#ede9fe", color: "#7c3aed" },
    "Lost": { bg: "#fee2e2", color: "#dc2626" },
    "Bad Info": { bg: "#f3f4f6", color: "#6b7280" },
};


const LeadsContext = createContext();


export function LeadsProvider({ children }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiGet("/leads/");
            if (res && res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (err) {
            console.error("Error fetching leads:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const getLead = (id) => {
        return leads.find((lead) => lead.id === parseInt(id));
    };

    const addLead = async (leadData) => {
        try {
            const res = await apiPost("/leads/", leadData);
            if (res && res.ok) {
                const newLead = await res.json();
                setLeads((prev) => [...prev, newLead]);
                return newLead;
            }
        } catch (err) {
            console.error("Error adding lead:", err);
        }
    };

    const updateLead = async (id, updatedData) => {
        try {
            const res = await apiPut(`/leads/${id}/`, updatedData);
            if (res && res.ok) {
                const updated = await res.json();
                setLeads((prev) =>
                    prev.map((lead) =>
                        lead.id === parseInt(id) ? updated : lead
                    )
                );
                return updated;
            }
        } catch (err) {
            console.error("Error updating lead:", err);
        }
    };

    const deleteLead = async (id) => {
        try {
            const res = await apiDelete(`/leads/${id}/`);
            if (res && (res.ok || res.status === 204)) {
                setLeads((prev) => prev.filter((lead) => lead.id !== parseInt(id)));
            }
        } catch (err) {
            console.error("Error deleting lead:", err);
        }
    };

    const value = {
        leads,
        loading,
        getLead,
        addLead,
        updateLead,
        deleteLead,
        fetchLeads,
        STATUS_COLORS,
    };

    return (
        <LeadsContext.Provider value={value}>
            {children}
        </LeadsContext.Provider>
    );
}


export function useLeads() {
    const context = useContext(LeadsContext);
    if (!context) {
        throw new Error("useLeads must be used within a LeadsProvider");
    }
    return context;
}

export default LeadsContext;
