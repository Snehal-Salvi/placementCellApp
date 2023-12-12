import express from 'express';
import InterviewController from '../controllers/interviews.controller.js';

//Initialize Express router
const interviewRouter = express.Router();


const interviewController = new InterviewController(); 

// All the paths to controller methods.
interviewRouter.get('/scheduledInterviewList', interviewController.getScheduledInterviewList);
interviewRouter.get('/scheduledInterview', interviewController.getInterviewSchedulePage);
interviewRouter.post('/scheduledInterviewList',interviewController.scheduleInterview);
interviewRouter.post('/updateResult/:interviewId', interviewController.updateInterviewResult);
interviewRouter.get('/deleteInterview/:interviewId', interviewController.deleteInterview);

export default interviewRouter;
