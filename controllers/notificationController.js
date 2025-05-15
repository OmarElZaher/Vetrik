const Notification = require("../models/SystemModels/notificationModel");
const asyncHandler = require("express-async-handler");

// Get notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
	const notifications = await Notification.find({ user: req.user._id }).sort({
		createdAt: -1,
	});
	res.json(notifications);
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
	await Notification.findByIdAndUpdate(req.params.id, { read: true });
	res.json({ message: "Notification marked as read" });
});

module.exports = { getNotifications, markAsRead };
