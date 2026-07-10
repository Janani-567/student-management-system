const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');
const Notification = require('./models/Notification');
const ActivityLog = require('./models/ActivityLog');
const QRCode = require('qrcode');

dotenv.config();

const cleanAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear all tables
    await User.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Subject.deleteMany();
    await Attendance.deleteMany();
    await Notification.deleteMany();
    await ActivityLog.deleteMany();

    console.log('Existing database cleaned.');

    // 1. Create Admins
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@edusphere.com',
      password: 'adminpassword',
      role: 'admin',
    });
    console.log('Admin user seeded (admin@edusphere.com / adminpassword)');

    // 2. Create Faculty
    const facultyUser1 = await User.create({
      username: 'johndoe',
      email: 'john.doe@edusphere.com',
      password: 'facultypassword',
      role: 'faculty',
    });

    const facultyUser2 = await User.create({
      username: 'sarahconnor',
      email: 'sarah.connor@edusphere.com',
      password: 'facultypassword',
      role: 'faculty',
    });

    const fac1 = await Faculty.create({
      user: facultyUser1._id,
      fullName: 'Dr. John Doe',
      email: 'john.doe@edusphere.com',
      phoneNumber: '+1987654321',
      department: 'Computer Science',
      designation: 'Professor',
    });

    const fac2 = await Faculty.create({
      user: facultyUser2._id,
      fullName: 'Dr. Sarah Connor',
      email: 'sarah.connor@edusphere.com',
      phoneNumber: '+1987654322',
      department: 'Information Technology',
      designation: 'Associate Professor',
    });

    console.log('Faculty accounts seeded.');

    // 3. Create Subjects
    const sub1 = await Subject.create({
      subjectName: 'Artificial Intelligence & Neural Networks',
      subjectCode: 'CS801',
      department: 'Computer Science',
      semester: 8,
      credits: 4,
      faculty: fac1._id,
      facultyNameText: 'Dr. John Doe',
    });

    const sub2 = await Subject.create({
      subjectName: 'Cloud Infrastructure & Microservices',
      subjectCode: 'IT802',
      department: 'Information Technology',
      semester: 8,
      credits: 3,
      faculty: fac2._id,
      facultyNameText: 'Dr. Sarah Connor',
    });

    const sub3 = await Subject.create({
      subjectName: 'Advanced Web Engineering (MERN)',
      subjectCode: 'CS702',
      department: 'Computer Science',
      semester: 7,
      credits: 4,
      faculty: fac1._id,
      facultyNameText: 'Dr. John Doe',
    });

    // Update assigned subjects to faculties
    fac1.assignedSubjects.push(sub1._id, sub3._id);
    await fac1.save();
    fac2.assignedSubjects.push(sub2._id);
    await fac2.save();

    console.log('Subjects seeded and mapped.');

    // Helper function to create QR
    const getQR = async (id) => {
      const qrData = JSON.stringify({ studentId: id.toString(), domain: 'edusphere-pro.system' });
      return await QRCode.toDataURL(qrData);
    };

    // 4. Create Students
    const studentUser1 = await User.create({
      username: 'alexmercer',
      email: 'alex.mercer@edusphere.com',
      password: 'studentpassword',
      role: 'student',
    });

    const student1 = new Student({
      user: studentUser1._id,
      fullName: 'Alex Mercer',
      rollNumber: 'CS2026001',
      email: 'alex.mercer@edusphere.com',
      phoneNumber: '+1122334455',
      department: 'Computer Science',
      batchYear: 2026,
      semester: 8,
      gender: 'Male',
      cgpa: 9.25,
      address: '742 Evergreen Terrace, Sector 4, tech hub',
    });
    student1.qrCode = await getQR(student1._id);
    await student1.save();

    const studentUser2 = await User.create({
      username: 'emilyrose',
      email: 'emily.rose@edusphere.com',
      password: 'studentpassword',
      role: 'student',
    });

    const student2 = new Student({
      user: studentUser2._id,
      fullName: 'Emily Rose',
      rollNumber: 'IT2026002',
      email: 'emily.rose@edusphere.com',
      phoneNumber: '+1122334456',
      department: 'Information Technology',
      batchYear: 2026,
      semester: 8,
      gender: 'Female',
      cgpa: 8.75,
      address: '221B Baker St, London, Cloud Zone',
    });
    student2.qrCode = await getQR(student2._id);
    await student2.save();

    const studentUser3 = await User.create({
      username: 'tonystark',
      email: 'tony.stark@edusphere.com',
      password: 'studentpassword',
      role: 'student',
    });

    const student3 = new Student({
      user: studentUser3._id,
      fullName: 'Tony Stark',
      rollNumber: 'CS2026003',
      email: 'tony.stark@edusphere.com',
      phoneNumber: '+1122334457',
      department: 'Computer Science',
      batchYear: 2026,
      semester: 8,
      gender: 'Male',
      cgpa: 9.85,
      address: 'Malibu Point 10880, CA, Stark Tech tower',
    });
    student3.qrCode = await getQR(student3._id);
    await student3.save();

    const studentUser4 = await User.create({
      username: 'brucepanner',
      email: 'bruce.banner@edusphere.com',
      password: 'studentpassword',
      role: 'student',
    });

    const student4 = new Student({
      user: studentUser4._id,
      fullName: 'Bruce Banner',
      rollNumber: 'CS2026004',
      email: 'bruce.banner@edusphere.com',
      phoneNumber: '+1122334458',
      department: 'Computer Science',
      batchYear: 2026,
      semester: 8,
      gender: 'Male',
      cgpa: 7.95,
      address: 'Gamma Radiation Lab Suite A, CS Zone',
    });
    student4.qrCode = await getQR(student4._id);
    await student4.save();

    console.log('Students seeded (student email / studentpassword)');

    // 5. Create Attendance logs
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Attendance.create([
      { student: student1._id, subject: sub1._id, date: today, status: 'Present', recordedBy: facultyUser1._id },
      { student: student3._id, subject: sub1._id, date: today, status: 'Present', recordedBy: facultyUser1._id },
      { student: student4._id, subject: sub1._id, date: today, status: 'Absent', recordedBy: facultyUser1._id },

      { student: student1._id, subject: sub1._id, date: yesterday, status: 'Present', recordedBy: facultyUser1._id },
      { student: student3._id, subject: sub1._id, date: yesterday, status: 'Present', recordedBy: facultyUser1._id },
      { student: student4._id, subject: sub1._id, date: yesterday, status: 'Present', recordedBy: facultyUser1._id },

      { student: student2._id, subject: sub2._id, date: today, status: 'Present', recordedBy: facultyUser2._id },
      { student: student2._id, subject: sub2._id, date: yesterday, status: 'Absent', recordedBy: facultyUser2._id },
    ]);

    console.log('Attendance metrics seeded.');

    // 6. Notifications
    await Notification.create([
      {
        title: 'End Semester Project Submission Deadline',
        message: 'All final year CS & IT students must submit their capstone projects on the EduSphere Portal before June 30th, 2026.',
        type: 'Academic',
        targetRole: 'student',
        department: 'all',
        createdBy: adminUser._id,
      },
      {
        title: 'Special Guest Lecture on Generative AI',
        message: 'Join us for a tech talk on LLMs & Agentic flows in the Main Auditorium at 10 AM, June 25th.',
        type: 'General',
        targetRole: 'all',
        department: 'all',
        createdBy: facultyUser1._id,
      },
      {
        title: 'URGENT: Server Maintenance Downtime Alert',
        message: 'EduSphere portals will be offline for hardware upgrades from 2 AM to 4 AM on June 28th.',
        type: 'Alert',
        targetRole: 'all',
        department: 'all',
        createdBy: adminUser._id,
      },
    ]);

    console.log('Notifications announcements seeded.');

    // 7. Activity Logs
    await ActivityLog.create({
      user: adminUser._id,
      username: 'admin',
      role: 'admin',
      action: 'DB_SEED',
      details: 'Cleaned and fully seeded initial academic records database.',
      ipAddress: '127.0.0.1',
    });

    console.log('Activity log entry written.');
    console.log('Database Seeding Successful! Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

cleanAndSeed();
