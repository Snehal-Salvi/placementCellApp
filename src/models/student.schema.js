//Student Schema
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        college: {
            type: String,
            required: true,
        },
        batch: {
            type: String,
            required: true,
        },
        contactNo: {
            type: String,
            required: true,
        },
        score: {
            dsa: {
                type: Number,
                required: true,
            },
            webD: {
                type: Number,
                required: true,
            },
            react: {
                type: Number,
                required: true,
            },
        },

        interviews: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Interview',
            },
          ],

          status: {
            type: String,
            default: "Not Placed",
           
        },

    },
    { timestamps: true }
);


const StudentModel = mongoose.model("Student", studentSchema);

export default StudentModel;
