const PDFDocument = require('pdfkit');
const exceljs = require('exceljs');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// @desc    Export student profile as PDF ID Card / Report Sheet
// @route   GET /api/reports/pdf/student/:id
// @access  Private
exports.exportStudentPDF = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Stream PDF directly to client response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=EduSphere_Report_${student.rollNumber}.pdf`);
    doc.pipe(res);

    // Decorative Header bar
    doc
      .rect(0, 0, 595.28, 120)
      .fill('#0f172a'); // slate-900 color

    doc
      .fillColor('#38bdf8') // light sky blue color
      .fontSize(24)
      .text('EDUSPHERE PRO', 50, 40, { align: 'left' });

    doc
      .fillColor('#ffffff')
      .fontSize(12)
      .text('Official Academic Profile Record', 50, 70, { align: 'left' });

    // User details container
    doc.fillColor('#1e293b').fontSize(14).text('STUDENT INFORMATION', 50, 150);
    doc.moveTo(50, 170).lineTo(545, 170).stroke('#cbd5e1');

    doc.fontSize(11).fillColor('#334155');
    doc.text(`Full Name:      ${student.fullName}`, 50, 190);
    doc.text(`Roll Number:    ${student.rollNumber}`, 50, 210);
    doc.text(`Email Address:  ${student.email}`, 50, 230);
    doc.text(`Phone:          ${student.phoneNumber}`, 50, 250);
    doc.text(`Department:     ${student.department}`, 50, 270);
    doc.text(`Semester:       Semester ${student.semester}`, 50, 290);
    doc.text(`Batch Year:     Class of ${student.batchYear}`, 50, 310);
    doc.text(`CGPA:           ${student.cgpa} / 10.0`, 50, 330);
    doc.text(`Gender:         ${student.gender}`, 50, 350);
    doc.text(`Address:        ${student.address}`, 50, 370);

    // Generate Badge evaluation on PDF
    let badge = 'No Badge';
    if (student.cgpa >= 9.0) badge = 'GOLD BADGE (Elite Performance)';
    else if (student.cgpa >= 8.0) badge = 'SILVER BADGE (Excellent performance)';
    else if (student.cgpa >= 7.0) badge = 'BRONZE BADGE (Honorable performance)';

    doc.fillColor('#1e293b').fontSize(14).text('ACADEMIC STANDARDS & QR CARD', 50, 410);
    doc.moveTo(50, 430).lineTo(545, 430).stroke('#cbd5e1');

    doc.fontSize(11).fillColor('#334155');
    doc.text(`Honors Level:  ${badge}`, 50, 450);

    // Embedded QR Code (Base64 dataURI needs parsing for embedding)
    if (student.qrCode) {
      const qrImageBuffer = Buffer.from(student.qrCode.split(',')[1], 'base64');
      doc.image(qrImageBuffer, 400, 190, { width: 120, height: 120 });
      doc.text('Scan profile QR for instant verification', 400, 320, { width: 120, align: 'center' });
    }

    // Add footer signature
    doc
      .fontSize(9)
      .fillColor('#94a3b8')
      .text('EduSphere System Certificate • Digitally generated copy.', 50, 750, { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Export student directory list as Excel File
// @route   GET /api/reports/excel/students
// @access  Private (Admin, Faculty)
exports.exportStudentsExcel = async (req, res) => {
  try {
    const students = await Student.find().sort({ department: 1, rollNumber: 1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Students Database');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Email Address', key: 'email', width: 30 },
      { header: 'Phone Number', key: 'phoneNumber', width: 15 },
      { header: 'Department', key: 'department', width: 25 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Batch Year', key: 'batchYear', width: 12 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'Address', key: 'address', width: 35 },
    ];

    // Style Header Row
    worksheet.getRow(1).font = { name: 'Segoe UI', family: 4, size: 12, bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0F172A' },
    };

    students.forEach((student) => {
      worksheet.addRow({
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        email: student.email,
        phoneNumber: student.phoneNumber,
        department: student.department,
        semester: student.semester,
        batchYear: student.batchYear,
        cgpa: student.cgpa,
        gender: student.gender,
        address: student.address,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=EduSphere_Students.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
