
import { apiGet, apiPost, apiPut, apiDelete } from "./api";


export const getCompanies = async () => {
    try {
        const res = await apiGet("/companies/");
        if (res && res.ok) {
            return await res.json();
        }
        return [];
    } catch (error) {
        console.error("Error getting companies:", error);
        return [];
    }
};


export const getCompanyById = async (id) => {
    try {
        const res = await apiGet(`/companies/${id}/`);
        if (res && res.ok) {
            return await res.json();
        }
        return null;
    } catch (error) {
        console.error("Error getting company by ID:", error);
        return null;
    }
};


export const addCompany = async (companyData) => {
    try {
        const res = await apiPost("/companies/", companyData);
        if (res && res.ok) {
            return await res.json();
        }
        throw new Error("Failed to add company");
    } catch (error) {
        console.error("Error adding company:", error);
        throw new Error("Failed to add company");
    }
};


export const updateCompany = async (id, updatedData) => {
    try {
        const res = await apiPut(`/companies/${id}/`, updatedData);
        if (res && res.ok) {
            return await res.json();
        }
        return null;
    } catch (error) {
        console.error("Error updating company:", error);
        throw new Error("Failed to update company");
    }
};


export const deleteCompany = async (id) => {
    try {
        const res = await apiDelete(`/companies/${id}/`);
        return res && (res.ok || res.status === 204);
    } catch (error) {
        console.error("Error deleting company:", error);
        throw new Error("Failed to delete company");
    }
};


export const updateCompanyStatus = async (id, status) => {
    return updateCompany(id, { status });
};


export const searchCompanies = async (query) => {
    try {
        const res = await apiGet(`/companies/search/?q=${encodeURIComponent(query)}`);
        if (res && res.ok) {
            return await res.json();
        }
        return [];
    } catch (error) {
        console.error("Error searching companies:", error);
        return [];
    }
};


export default {
    getCompanies,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany,
    updateCompanyStatus,
    searchCompanies,
};
