import express from "express";
import Guard from "../middleware/Guard.js";
import getAdmin from "../middleware/admin.js";
import upload from "../middleware/multer.js";
import {
    adminDashboard,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminSettings,
    updateAdminSettings,
    getLogs
} from "../controller/admin-panel.js";

const adminPanel = express.Router();

// Dashboard
adminPanel.get("/admin", Guard, getAdmin, adminDashboard);

// Categories
adminPanel.get("/admin/categories", Guard, getAdmin, getCategories);
adminPanel.post("/admin/categories", Guard, getAdmin, upload.single('icon'), createCategory);
adminPanel.post("/admin/categories/:id", Guard, getAdmin, upload.single('icon'), updateCategory);
adminPanel.get("/admin/categories/:id/delete", Guard, getAdmin, deleteCategory);

// Products
adminPanel.get("/admin/products", Guard, getAdmin, getProducts);
adminPanel.post("/admin/products", Guard, getAdmin, upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'rankImage', maxCount: 1 },
    { name: 'chatImage', maxCount: 1 },
    { name: 'playerPreview', maxCount: 1 }
]), createProduct);
adminPanel.post("/admin/products/:id", Guard, getAdmin, upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'rankImage', maxCount: 1 },
    { name: 'chatImage', maxCount: 1 },
    { name: 'playerPreview', maxCount: 1 }
]), updateProduct);
adminPanel.get("/admin/products/:id/delete", Guard, getAdmin, deleteProduct);

// Settings
adminPanel.get("/admin/settings", Guard, getAdmin, getAdminSettings);
adminPanel.post("/admin/settings", Guard, getAdmin, upload.single('discord_banner'), updateAdminSettings);

// Logs
adminPanel.get("/admin/logs", Guard, getAdmin, getLogs);

export default adminPanel;