import InterviewModel from "../models/interview.schema.js";
import StudentModel from "../models/student.schema.js";

export default class InterviewController {

    /**
     * Get the list of scheduled interviews with student details.
     * Renders the 'scheduled-interview-list' view.
     */
    async getScheduledInterviewList(req, res) {
        try {
            const interviews = await InterviewModel.find().populate({
                path: 'student',
                select: 'name email contactNo batch',
            });
            res.render('scheduled-interview-list', { interviews, userEmail: req.session.userEmail, userName: req.session.userName });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Get the interview scheduling page.
     * Retrieves the list of students for selection.
     * Renders the 'scheduledInterview' view.
     */
    async getInterviewSchedulePage(req, res) {
        try {
            const students = await StudentModel.find({}, 'name');
            res.render('scheduled-interview-form', { students, userEmail: req.session.userEmail, userName: req.session.userName });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Schedule a new interview.
     * Validates the student, creates a new interview, and updates the student's interviews array.
     * Redirects to the scheduled interview list page.
     */
    async scheduleInterview(req, res) {
        try {
            const { studentName, companyName, interviewDate } = req.body;

            // Find the student by name
            const student = await StudentModel.findOne({ name: studentName });
            if (!student) {
                return res.status(400).json({ error: 'Student not found' });
            }

            // Create a new interview with the student reference and set the result to "Pending"
            const interview = new InterviewModel({
                student: student._id,
                companyName,
                interviewDate,
                result: 'Pending', 
            });

            await interview.save();

            // Save the reference to the interview in the student's interviews array
            student.interviews.push(interview._id);
            await student.save();

            res.redirect('/scheduledInterviewList');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Update the result of an interview.
     * Takes the interview ID and result from the request body.
     * Redirects to the scheduled interview list page after updating.
     */
    async updateInterviewResult(req, res) {
        try {
            const interviewId = req.params.interviewId;
            const { result } = req.body;

            // Find the interview by ID and update the result
            const updatedInterview = await InterviewModel.findByIdAndUpdate(
                interviewId,
                { result },
                { new: true } // Return the updated document
            );

            res.redirect('/scheduledInterviewList');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Delete a scheduled interview.
     * Takes the interview ID from the request parameters.
     * Redirects to the scheduled interview list page after deletion.
     */
    async deleteInterview(req, res) {
        try {
            const interviewId = req.params.interviewId;

            // Find the interview by ID and remove it from the database
            await InterviewModel.findByIdAndDelete(interviewId);

            // Redirect to the scheduled interview list page after deletion
            res.redirect('/scheduledInterviewList');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
