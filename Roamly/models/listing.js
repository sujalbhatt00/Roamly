// routes/admin.js
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAdmin } = require('../middleware'); // Ensure you have an isAdmin middleware
const adminController = require('../controller/admin');

// Admin Dashboard
router.get('/', isLoggedIn, isAdmin, wrapAsync(adminController.dashboard));

// Manage Listings
router.get('/listings', isLoggedIn, isAdmin, wrapAsync(adminController.listListings));
router.delete('/listings/:id', isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));

// Manage Users
router.get('/users', isLoggedIn, isAdmin, wrapAsync(adminController.listUsers));
router.delete('/users/:id', isLoggedIn, isAdmin, wrapAsync(adminController.deleteUser));

// Manage Bookings
router.get('/bookings', isLoggedIn, isAdmin, wrapAsync(adminController.listBookings));

module.exports = router;