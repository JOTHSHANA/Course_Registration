const { get_database, post_database } = require("../../config/db_utils");

exports.getCourseReport = async (req, res) => {
    const { course } = req.body;
    
    if (!course) {
        return res.status(400).json({ error: "course is required..." });
    }

    try {
        const dataQuery = `
            SELECT 
                s.name, 
                s.reg_no, 
                s.gmail, 
                d.department, 
                ye.year, 
                c.code, 
                c.name AS course_name
            FROM 
                course_register cr
            LEFT JOIN students s ON s.id = cr.student
            LEFT JOIN courses c ON c.id = cr.course
            LEFT JOIN departments d ON d.id = s.department
            LEFT JOIN years ye ON ye.id = s.year
            WHERE 
                cr.course = ? 
                AND cr.status = '1';
        `;

        const countQuery = `
            SELECT COUNT(*) AS student_count
            FROM course_register cr2
            WHERE cr2.course = ? AND cr2.status = '1';
        `;

        const studentData = await post_database(dataQuery, [course]);
        const studentCountResult = await post_database(countQuery, [course]);
        console.log(studentCountResult)

        const studentCount = studentCountResult?.result[0].student_count || 0;

        res.json({
            student_count: studentCount,
            students: studentData
        });

    } catch (err) {
        console.error("Error fetching Student Registered Course reports", err);
        res.status(500).json({ error: "Error fetching Student Registered Course reports" });
    }
};
