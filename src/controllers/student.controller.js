import fs from 'fs';
import ExcelJS from 'exceljs';
import StudentModel from '../models/student.schema.js';

export default class StudentController {

    // Get all students and render the student list page
    async getAllStudents(req, res) {
        try {
            const students = await StudentModel.find().populate('interviews');
            res.render("student", { students, userEmail: req.session.userEmail, userName: req.session.userName});
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Render the form to add a new student
    async renderAddStudentForm(req, res) {
        try {
            const students = await StudentModel.find().populate('interviews');
            res.render("addStudent", { students, userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: null});
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Add a new student
    async addStudent (req, res) {
        try {
            // Extract student details from the request body
            const { name, email, college, batch, contactNo, dsaScore, webDScore, reactScore } = req.body;

            // Create a new student instance
            const newStudent = new StudentModel({
                name,
                email,
                college,
                batch,
                contactNo,
                score: {
                    dsa: dsaScore,
                    webD: webDScore,
                    react: reactScore,
                },
            });

            // Save the new student to the database
            await newStudent.save();

            // Redirect to the students list page
            res.redirect('/students');
        } catch (error) {
            // Handle errors
            console.error('Error adding student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Render the form to update a student
    async renderUpdateStudentForm (req, res)  {
        try {
            const studentId = req.params.id;
            const student = await StudentModel.findById(studentId);
            res.render('updateStudent', { student, userEmail: req.session.userEmail, userName: req.session.userName, errorMessage: null});
        } catch (error) {
            // Handle errors
            console.error('Error rendering update form:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Handle the form submission to update a student
    async updateStudent(req, res) {
        try {
            const studentId = req.params.id;
            const { name, email, college, batch, contactNo, dsaScore, webDScore, reactScore, status } = req.body;

            // Find the student by ID and update the details
            const updatedStudent = await StudentModel.findByIdAndUpdate(studentId, {
                name,
                email,
                college,
                batch,
                contactNo,
                score: {
                    dsa: dsaScore,
                    webD: webDScore,
                    react: reactScore,
                },
                status
            }, { new: true }); // { new: true } ensures that the updated document is returned

            // Redirect to the students list page with the updated data
            res.redirect('/students');
        } catch (error) {
            // Handle errors
            console.error('Error updating student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Handle the request to delete a student
    async  deleteStudent (req, res) {
        try {
            const studentId = req.params.id;
            // Find the student by ID and remove it from the database
            await StudentModel.findOneAndDelete({ _id: studentId });

            // Redirect to the students list page after deletion
            res.redirect('/students');
        } catch (error) {
            // Handle errors
            console.error('Error deleting student:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

   // Download a report in Excel format with student and interview details
async downloadCsv(req, res) {
    try {
        const students = await StudentModel.find({}).populate('interviews');

        let data = '';
        let no = 1;
        let csv = 'S.No, Name, Email, College, Batch, Contact No, DSA Score, WebD Score, React Score, Status, Company Name, Interview Date, Result';

        for (let student of students) {
            data =
                no +
                ',' +
                student.name +
                ',' +
                student.email +
                ',' +
                student.college +
                ',' +
                student.batch +
                ',' +
                student.contactNo +
                ',' +
                student.score.dsa +
                ',' +
                student.score.webD +
                ',' +
                student.score.react +
                ',' +
                (student.status || 'N/A');

            if (student.interviews.length > 0) {
                const interview = student.interviews[0]; // Assuming you want data from the first interview
                data += ',' + (interview.companyName || 'N/A') + ',' + (interview.interviewDate || 'N/A') + ',' + (interview.result || 'N/A');
            } else {
                data += ',N/A,N/A,N/A';
            }

            no++;
            csv += '\n' + data;
        }

        const filePath = 'report/data.csv';
        fs.writeFile(filePath, csv, function (error, data) {
            if (error) {
                console.log(error);
                return res.redirect('back');
            }
            console.log('Report generated successfully');
            return res.download(filePath);
        });
    } catch (error) {
        console.log(`Error in downloading file: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
}
