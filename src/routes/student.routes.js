import express from 'express';
import StudentController from '../controllers/student.controller.js';

//Initialize Express router.
const studentRouter = express.Router();


const studentController = new StudentController(); 


// All the paths to controller methods.
studentRouter.get('/students',  studentController.getAllStudents);
studentRouter.get('/addStudent', studentController.renderAddStudentForm);
studentRouter.post('/students/create',studentController.addStudent);
studentRouter.get('/updateStudent/:id', studentController.renderUpdateStudentForm);
studentRouter.post('/updateStudent/:id', studentController.updateStudent);
studentRouter.get('/deleteStudent/:id',studentController.deleteStudent);
studentRouter.get('/downloadReport', studentController.downloadCsv)

export default studentRouter;
