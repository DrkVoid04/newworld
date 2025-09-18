import Category from "../model/category.js";
import rank from "../model/ranks.js";
import Admin from "../model/admin.js";
import Log from "../model/logs.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// Helper function to log actions
async function logAction(action, entity, adminEmail, description, entityId = null, oldData = null, newData = null, req = null) {
    try {
        await Log.create({
            action,
            entity,
            entityId,
            adminEmail,
            description,
            oldData,
            newData,
            ipAddress: req ? req.ip : null
        });
    } catch (error) {
        console.error('Error logging action:', error);
    }
}

// Admin Panel Dashboard
export async function adminDashboard(req, res) {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        const products = await rank.find().sort({ createdAt: -1 });
        const recentLogs = await Log.find().sort({ timestamp: -1 }).limit(10);
        
        res.render("admin/dashboard", {
            categories,
            products: products.length,
            logs: recentLogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading admin dashboard");
    }
}

// Category Management
export async function getCategories(req, res) {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.render("admin/categories", { categories });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading categories");
    }
}

export async function createCategory(req, res) {
    try {
        const { name, displayName, description } = req.body;
        const adminEmail = jwt.decode(req.cookies.uid).email;
        
        const categoryData = {
            name: name.toLowerCase(),
            displayName,
            description,
            icon: req.file ? `/uploads/categories/${req.file.filename}` : null
        };
        
        const category = await Category.create(categoryData);
        
        await logAction('CREATE', 'CATEGORY', adminEmail, `Created category: ${displayName}`, category._id, null, categoryData, req);
        
        res.redirect('/admin/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating category");
    }
}

export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, displayName, description, isActive } = req.body;
        const adminEmail = jwt.decode(req.cookies.uid).email;
        
        const oldCategory = await Category.findById(id);
        
        const updateData = {
            name: name.toLowerCase(),
            displayName,
            description,
            isActive: isActive === 'on',
            updatedAt: new Date()
        };
        
        if (req.file) {
            // Delete old icon if exists
            if (oldCategory.icon) {
                const oldPath = path.join(process.cwd(), 'public', oldCategory.icon);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateData.icon = `/uploads/categories/${req.file.filename}`;
        }
        
        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
        
        await logAction('UPDATE', 'CATEGORY', adminEmail, `Updated category: ${displayName}`, id, oldCategory.toObject(), updateData, req);
        
        res.redirect('/admin/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating category");
    }
}

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        const adminEmail = jwt.decode(req.cookies.uid).email;
        
        const category = await Category.findById(id);
        
        // Delete associated icon
        if (category.icon) {
            const iconPath = path.join(process.cwd(), 'public', category.icon);
            if (fs.existsSync(iconPath)) {
                fs.unlinkSync(iconPath);
            }
        }
        
        await Category.findByIdAndDelete(id);
        
        await logAction('DELETE', 'CATEGORY', adminEmail, `Deleted category: ${category.displayName}`, id, category.toObject(), null, req);
        
        res.redirect('/admin/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting category");
    }
}

// Product Management
export async function getProducts(req, res) {
    try {
        const { category } = req.query;
        const categories = await Category.find({ isActive: true });
        
        let products = [];
        let selectedCategory = null;
        
        if (category) {
            products = await rank.find({ type: category }).sort({ createdAt: -1 });
            selectedCategory = await Category.findOne({ name: category });
        }
        
        res.render("admin/products", { 
            categories, 
            products, 
            selectedCategory: selectedCategory || { name: category }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading products");
    }
}

export async function createProduct(req, res) {
    try {
        const {
            name, short_desc, desc, type, value, perks, 
            amount, off, redirect, product_id
        } = req.body;
        
        const adminEmail = jwt.decode(req.cookies.uid).email;
        
        const productData = {
            name,
            short_desc,
            desc,
            type,
            value,
            perks: Array.isArray(perks) ? perks : [perks].filter(Boolean),
            price: {
                amount: parseInt(amount),
                off: parseInt(off) || 0
            },
            redirect,
            product_id,
            preview: {
                RankImage: req.files?.rankImage ? `/uploads/products/${req.files.rankImage[0].filename}` : '',
                ChatImage: req.files?.chatImage ? `/uploads/products/${req.files.chatImage[0].filename}` : '',
                PlayerPreview: req.files?.playerPreview ? `/uploads/products/${req.files.playerPreview[0].filename}` : '',
                banner: req.files?.banner ? `/uploads/products/${req.files.banner[0].filename}` : ''
            }
        };
        
        const product = await rank.create(productData);
        
        await logAction('CREATE', 'PRODUCT', adminEmail, `Created product: ${name}`, product._id, null, productData, req);
        
        res.redirect(`/admin/products?category=${type}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating product");
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            name, short_desc, desc, type, value, perks,
            amount, off, redirect
        } = req.body;
        
        const adminEmail = jwt.decode(req.cookies.uid).email;
        const oldProduct = await rank.findById(id);
        
        const updateData = {
            name,
            short_desc,
            desc,
            type,
            value,
            perks: Array.isArray(perks) ? perks : [perks].filter(Boolean),
            price: {
                amount: parseInt(amount),
                off: parseInt(off) || 0
            },
            redirect,
            preview: { ...oldProduct.preview }
        };
        
        // Handle file uploads
        if (req.files) {
            Object.keys(req.files).forEach(fieldName => {
                if (req.files[fieldName] && req.files[fieldName][0]) {
                    // Delete old file if exists
                    const oldFile = oldProduct.preview[fieldName];
                    if (oldFile) {
                        const oldPath = path.join(process.cwd(), 'public', oldFile);
                        if (fs.existsSync(oldPath)) {
                            fs.unlinkSync(oldPath);
                        }
                    }
                    updateData.preview[fieldName] = `/uploads/products/${req.files[fieldName][0].filename}`;
                }
            });
        }
        
        const product = await rank.findByIdAndUpdate(id, updateData, { new: true });
        
        await logAction('UPDATE', 'PRODUCT', adminEmail, `Updated product: ${name}`, id, oldProduct.toObject(), updateData, req);
        
        res.redirect(`/admin/products?category=${type}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating product");
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const adminEmail = jwt.decode(req.cookies.uid).email;
        
        const product = await rank.findById(id);
        
        // Delete associated files
        Object.values(product.preview).forEach(filePath => {
            if (filePath) {
                const fullPath = path.join(process.cwd(), 'public', filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
        });
        
        await rank.findByIdAndDelete(id);
        
        await logAction('DELETE', 'PRODUCT', adminEmail, `Deleted product: ${product.name}`, id, product.toObject(), null, req);
        
        res.redirect(`/admin/products?category=${product.type}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting product");
    }
}

// Admin Settings
export async function getAdminSettings(req, res) {
    try {
        const settings = await Admin.findOne();
        res.render("admin/settings", { settings });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading admin settings");
    }
}

export async function updateAdminSettings(req, res) {
    try {
        const {
            upi, rcon_ip, rcon_port, rcon_pass, website_link,
            discord_link, mail, ip, port
        } = req.body;
        
        const adminEmail = jwt.decode(req.cookies.uid).email;
        const oldSettings = await Admin.findOne();
        
        const updateData = {
            upi, rcon_ip, rcon_port, rcon_pass, website_link,
            discord_link, mail, ip, port
        };
        
        if (req.file) {
            // Delete old banner if exists
            if (oldSettings.discord_banner) {
                const oldPath = path.join(process.cwd(), 'public', oldSettings.discord_banner);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateData.discord_banner = `/uploads/admin/${req.file.filename}`;
        }
        
        await Admin.findOneAndUpdate({}, updateData, { upsert: true });
        
        await logAction('UPDATE', 'ADMIN_SETTINGS', adminEmail, 'Updated admin settings', null, oldSettings?.toObject(), updateData, req);
        
        res.redirect('/admin/settings');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating admin settings");
    }
}

// Logs
export async function getLogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        
        const logs = await Log.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Log.countDocuments();
        const totalPages = Math.ceil(total / limit);
        
        res.render("admin/logs", {
            logs,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading logs");
    }
}