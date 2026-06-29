export const dashboardStats = {
  totalBookings: 247,
  pendingRequests: 18,
  completedServices: 892,
  revenue: 1845000,
};

export const recentBookings = [
  { id: 1, customer: 'Ramesh Babu', service: 'CCTV Installation', date: '2025-06-14', status: 'Pending', phone: '+91 94401 23456', amount: 25000 },
  { id: 2, customer: 'Sita Devi', service: 'Camera Upgrade', date: '2025-06-13', status: 'Confirmed', phone: '+91 98765 43210', amount: 15000 },
  { id: 3, customer: 'Venkat Rao', service: 'AMC Renewal', date: '2025-06-12', status: 'Completed', phone: '+91 90001 12345', amount: 12000 },
  { id: 4, customer: 'Priya Reddy', service: 'IP Camera Setup', date: '2025-06-11', status: 'In Progress', phone: '+91 87654 32100', amount: 35000 },
  { id: 5, customer: 'Naveen Kumar', service: 'Networking', date: '2025-06-10', status: 'Pending', phone: '+91 99887 76655', amount: 18000 },
];

export const activityTimeline = [
  { id: 1, type: 'booking', title: 'New Booking Received', description: 'Ramesh Babu booked CCTV Installation for Jubilee Hills residence', time: '2 hours ago' },
  { id: 2, type: 'completed', title: 'Service Completed', description: 'Venkat Rao — AMC renewal visit completed successfully', time: '5 hours ago' },
  { id: 3, type: 'payment', title: 'Payment Received', description: '₹35,000 received from Priya Reddy for IP Camera Setup', time: '1 day ago' },
  { id: 4, type: 'booking', title: 'New Booking Received', description: 'Kavitha Sharma requested CCTV maintenance at Begumpet office', time: '1 day ago' },
  { id: 5, type: 'alert', title: 'System Alert', description: 'Monthly backup completed. All client records synced.', time: '2 days ago' },
  { id: 6, type: 'completed', title: 'Installation Completed', description: '16-camera setup at Deccan InfoTech completed ahead of schedule', time: '3 days ago' },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 145000, bookings: 18 },
  { month: 'Feb', revenue: 178000, bookings: 22 },
  { month: 'Mar', revenue: 162000, bookings: 20 },
  { month: 'Apr', revenue: 198000, bookings: 25 },
  { month: 'May', revenue: 215000, bookings: 28 },
  { month: 'Jun', revenue: 185000, bookings: 24 },
  { month: 'Jul', revenue: 232000, bookings: 30 },
  { month: 'Aug', revenue: 195000, bookings: 26 },
  { month: 'Sep', revenue: 210000, bookings: 27 },
  { month: 'Oct', revenue: 248000, bookings: 32 },
  { month: 'Nov', revenue: 220000, bookings: 29 },
  { month: 'Dec', revenue: 256000, bookings: 34 },
];
