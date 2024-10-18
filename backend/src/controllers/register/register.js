const { get_database, post_database } = require("../../config/db_utils");

exports.CourseRegister = async (req, res) => {
    const { student, course } = req.body;
    if (!student || !course) {
        return res.status(400).json({ error: "student and course are required..." });
    }

    try {
        const checkQuery = `
        SELECT c.max_count, IFNULL(SUM(cr.status = '1'), 0) AS registered_count
        FROM courses c
        LEFT JOIN course_register cr ON cr.course = c.id AND cr.status = '1'
        WHERE c.id = ?
        GROUP BY c.id
        `;

        const [courseInfo] = await get_database(checkQuery, [course]);

        if (!courseInfo) {
            return res.status(400).json({ error: "Invalid course." });
        }

        const { max_count, registered_count } = courseInfo;
        if (max_count !== null && registered_count >= max_count) {
            return res.status(400).json({ error: "Course registration limit reached." });
        }

        const insertQuery = `
        INSERT INTO course_register (student, course) VALUES (?, ?)
        `;
        const insertCourse = await post_database(insertQuery, [student, course]);
        res.json(insertCourse);
    } catch (err) {
        console.error("Error Inserting Course", err);
        res.status(500).json({ error: "Error Inserting Course" });
    }
};


exports.get_RegisteredCourse = async(req, res)=>{
    const {dept} = req.body
    if(!dept){
        return res.status(400).json({error:"Department id is required..."})
    }

}