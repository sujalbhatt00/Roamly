### Step 1: Create Admin Routes

Create a new file for admin routes, e.g., `routes/admin.js`.

```javascript
// filepath: c:\Users\sujal\Desktop\Roamly\routes\admin.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controller/admin");

// Admin Dashboard
router.get("/", isLoggedIn, isAdmin, wrapAsync(adminController.dashboard));

// Manage Listings
router.get("/listings", isLoggedIn, isAdmin, wrapAsync(adminController.listListings));
router.delete("/listings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));

// Manage Users
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.listUsers));
router.delete("/users/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteUser));

// Manage Bookings
router.get("/bookings", isLoggedIn, isAdmin, wrapAsync(adminController.listBookings));

module.exports = router;
```

### Step 2: Create Admin Controller

Create a new file for the admin controller, e.g., `controller/admin.js`.

```javascript
// filepath: c:\Users\sujal\Desktop\Roamly\controller\admin.js
const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
    res.render("admin/dashboard");
};

module.exports.listListings = async (req, res) => {
    const listings = await Listing.find({});
    res.render("admin/listings", { listings });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully.");
    res.redirect("/admin/listings");
};

module.exports.listUsers = async (req, res) => {
    const users = await User.find({});
    res.render("admin/users", { users });
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "User deleted successfully.");
    res.redirect("/admin/users");
};

module.exports.listBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate("listing").populate("user");
    res.render("admin/bookings", { bookings });
};
```

### Step 3: Create Admin Views

Create a new folder for admin views, e.g., `views/admin`.

1. **Dashboard View** (`dashboard.ejs`)

```html
<!-- filepath: c:\Users\sujal\Desktop\Roamly\views\admin\dashboard.ejs -->
<% layout("/layouts/boilerplate") %>
<h1>Admin Dashboard</h1>
<p>Welcome to the admin panel!</p>
<a href="/admin/listings">Manage Listings</a>
<a href="/admin/users">Manage Users</a>
<a href="/admin/bookings">Manage Bookings</a>
```

2. **Listings View** (`listings.ejs`)

```html
<!-- filepath: c:\Users\sujal\Desktop\Roamly\views\admin\listings.ejs -->
<% layout("/layouts/boilerplate") %>
<h1>Manage Listings</h1>
<table>
    <thead>
        <tr>
            <th>Title</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <% listings.forEach(listing => { %>
            <tr>
                <td><%= listing.title %></td>
                <td>
                    <form action="/admin/listings/<%= listing._id %>?_method=DELETE" method="POST">
                        <button type="submit">Delete</button>
                    </form>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

3. **Users View** (`users.ejs`)

```html
<!-- filepath: c:\Users\sujal\Desktop\Roamly\views\admin\users.ejs -->
<% layout("/layouts/boilerplate") %>
<h1>Manage Users</h1>
<table>
    <thead>
        <tr>
            <th>Username</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <% users.forEach(user => { %>
            <tr>
                <td><%= user.username %></td>
                <td>
                    <form action="/admin/users/<%= user._id %>?_method=DELETE" method="POST">
                        <button type="submit">Delete</button>
                    </form>
                </td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

4. **Bookings View** (`bookings.ejs`)

```html
<!-- filepath: c:\Users\sujal\Desktop\Roamly\views\admin\bookings.ejs -->
<% layout("/layouts/boilerplate") %>
<h1>Manage Bookings</h1>
<table>
    <thead>
        <tr>
            <th>User</th>
            <th>Listing</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <% bookings.forEach(booking => { %>
            <tr>
                <td><%= booking.user.username %></td>
                <td><%= booking.listing.title %></td>
                <td><%= booking.status %></td>
            </tr>
        <% }) %>
    </tbody>
</table>
```

### Step 4: Update Middleware

Update your middleware to include an `isAdmin` function to check if the user is an admin.

```javascript
// filepath: c:\Users\sujal\Desktop\Roamly\middleware.js
module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "You do not have permission to perform this action.");
    return res.redirect("/");
};
```

### Step 5: Update Your App

Make sure to include the admin routes in your main app file.

```javascript
// filepath: c:\Users\sujal\Desktop\Roamly\app.js
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);
```

### Step 6: Add Admin Role to Users

Ensure your User model has an `isAdmin` field to differentiate between regular users and admin users.

```javascript
// filepath: c:\Users\sujal\Desktop\Roamly\models\user.js
const userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false } // Add this line
});
```

### Step 7: Testing

1. Create an admin user in your database (you can do this through MongoDB shell or a script).
2. Start your server and navigate to `/admin` to access the admin panel.

### Conclusion

This is a basic implementation of an admin panel. You can expand it further by adding features like user roles, detailed booking management, and more sophisticated listing management options.