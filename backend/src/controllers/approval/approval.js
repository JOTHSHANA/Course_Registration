const { get_database, post_database } = require("../../config/db_utils");

exports.approval = async (req, res) => {
    const { student, f_course, t_course } = req.body;
    if (!student || !f_course || !t_course) {
        return res.status(400).json({ error: "Student, f_course, and t_course are required..." });
    }
    try {
        const query = `
        SELECT id, student, course FROM course_register 
        WHERE student = ? AND course = ? AND status = '1'
        `;
        const pastRecords = await post_database(query, [student, f_course]);

        if (pastRecords.result && pastRecords.result.length > 0) {
            const id = pastRecords.result[0].id;

            const updateRecords = `
            UPDATE course_register SET course = ? 
            WHERE student = ? AND id = ?
            `;
            const updateCourse = await post_database(updateRecords, [t_course, student, id]);

            const updateStatus = `
            UPDATE request SET status = '2' 
            WHERE student = ? AND status = '1'
            `;
            const Ustatus = await post_database(updateStatus, [student]);

            res.json({
                updateCourse,
                updateStatus: Ustatus,
                message: "Course and request status updated successfully"
            });
        } else {
            res.status(400).json({ error: "Student not registered for the specified f_course" });
        }
    } catch (err) {
        console.error("Error updating course", err);
        res.status(500).json({ error: "Error updating course" });
    }
};

exports.rejectRequest = async(req, res) =>{
    const { student, f_course, t_course,reason } = req.body;
    if (!student || !f_course || !t_course || !reason) {
        return res.status(400).json({ error: "Student, reason, f_course, and t_course are required..." });
    }
    try{
        const query = `
        UPDATE request 
        SET status = '3', reason = ? 
        WHERE student = ? AND f_course = ? AND t_course = ? `
        const rejCourse = await post_database(query, [reason, student, f_course, t_course])
        res.json(rejCourse)
    }catch(err){
        console.error("Error Rejecting Request", err);
        res.status(500).json({ error: "Error Rejecting Request" });
    }
}
