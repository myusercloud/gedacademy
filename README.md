# 🎒 School Management System

A full-stack production-ready School Management System built with Node.js, Express.js, MongoDB, React, and Tailwind CSS.

## 📋 Features

### Backend (Node.js/Express)
- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ Role-Based Access Control (Admin, Teacher, Student, Parent)
- ✅ Password Reset via Email
- ✅ Student, Teacher, Parent Management
- ✅ Class & Subject Management
- ✅ Timetable System
- ✅ Attendance Tracking
- ✅ Exam & Results Management
- ✅ Report Card Generation (JSON + PDF)
- ✅ Fees Management with MPesa STK Push Integration
- ✅ School Announcements (Noticeboard)
- ✅ Teacher ↔ Parent Messaging
- ✅ CMS for Website Content (Homepage, About, News, Gallery, Staff)
- ✅ Dashboard Analytics
- ✅ Security: Helmet, CORS, Rate Limiting, Input Validation

### Frontend (React + Tailwind)
- ✅ Modern UI with Tailwind CSS
- ✅ Role-Based Dashboards
- ✅ Protected Routes
- ✅ JWT Token Refresh Interceptors
- ✅ Responsive Design
- ✅ React Query for Data Fetching

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd edu
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**

Copy `.env.example` to `.env` in the root directory:
```bash
cd ..
cp .env.example .env
```

Edit `.env` and configure:
- MongoDB connection string
- JWT secrets
- Email SMTP settings (for password reset)
- MPesa credentials (optional, for payment integration)
- Admin user credentials

5. **Seed Admin User**
```bash
cd server
npm run seed:admin
```

This creates the initial admin user. Default credentials (if not set in `.env`):
- Email: `admin@example.com`
- Password: `ChangeThisAdminPassword123`

6. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
edu/
├── server/                 # Backend (Node.js/Express)
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, error handling
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utilities (JWT, email, PDF, etc.)
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   └── package.json
│
├── frontend/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/          # Axios instance
│   │   ├── components/  # Reusable components
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Auth context
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── vite.config.mjs
│
├── .env.example          # Environment variables template
└── README.md
```

## 🔐 User Roles & Permissions

### Admin
- Full system access
- Manage students, teachers, parents
- Create classes, subjects, timetables
- Manage attendance, exams, fees
- CMS management
- View analytics dashboard

### Teacher
- Mark attendance for assigned classes
- Enter exam marks
- View class timetables
- Message parents
- View class performance

### Student
- View own attendance
- View own results/report cards
- View timetable
- View fees statement
- View notices

### Parent
- View children's performance
- View children's attendance
- View fees
- Message teachers

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - List students (Admin)
- `POST /api/students` - Create student (Admin)
- `GET /api/students/:id` - Get student (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)

### Teachers
- `GET /api/teachers` - List teachers (Admin)
- `POST /api/teachers` - Create teacher (Admin)
- Similar CRUD operations...

### Attendance
- `POST /api/attendance` - Mark attendance (Teacher/Admin)
- `GET /api/attendance/student/:studentId` - Get student attendance
- `GET /api/attendance/class/:classId/summary` - Class attendance summary

### Exams & Results
- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam (Admin/Teacher)
- `POST /api/results` - Enter marks (Teacher/Admin)
- `GET /api/results/student/:studentId` - Student results

### Fees
- `GET /api/fees/student/:studentId` - Student fees
- `POST /api/fees` - Create fee record (Admin)
- `POST /api/fees/mpesa/initiate` - Initiate MPesa payment
- `POST /api/fees/mpesa/callback` - MPesa callback (public)

### Reports
- `GET /api/reports/students/:studentId/exams/:examId/json` - Report card JSON
- `GET /api/reports/students/:studentId/exams/:examId/pdf` - Report card PDF
- `GET /api/reports/students/:studentId/attendance` - Attendance summary
- `GET /api/reports/students/:studentId/fees` - Fees statement

### Dashboard
- `GET /api/dashboard` - Admin dashboard analytics

### CMS
- `GET /api/cms/public` - Public CMS content
- `PUT /api/cms` - Update CMS (Admin)
- `POST /api/cms/gallery` - Upload gallery image (Admin)

### Settings
- `GET /api/settings/public` - Public settings
- `PUT /api/settings` - Update settings (Admin)

## 🛠️ Scripts

### Backend
```bash
npm run dev      # Start development server (nodemon)
npm start        # Start production server
npm run seed:admin  # Seed admin user
```

### Frontend
```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm start        # Preview production build
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Token blacklist for logout
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- MongoDB injection prevention (express-mongo-sanitize)

## 📧 Email Configuration

For password reset functionality, configure SMTP in `.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="School Admin" <no-reply@yourschool.com>
```

## 💳 MPesa Integration

To enable MPesa STK Push payments, configure in `.env`:
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/fees/mpesa/callback
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🐛 Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGO_URI` in `.env`

2. **JWT Errors**
   - Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
   - Use strong, random secrets in production

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall/network settings
   - For Gmail, use App Password instead of regular password

4. **Frontend Not Connecting to Backend**
   - Check `VITE_API_BASE_URL` in `.env`
   - Ensure backend is running on port 5000
   - Check CORS settings in `server/app.js`

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, MongoDB, React, and Tailwind CSS**
