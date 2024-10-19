const { get_database, post_database } = require("../../config/db_utils");

exports.get_courseAvailable = async (req, res) => {
    const { dept, type } = req.body;
    if (!dept || !type) {
        return res.status(400).json({ error: "department and course type are required..." });
    }

    try {
        const query = `
        SELECT c.code, c.name, c.max_count, ct.type, ct.id, d.department,
               IFNULL(SUM(cr.status = '1'), 0) AS registered_count
        FROM courses c
        LEFT JOIN departments d ON d.id = c.department
        LEFT JOIN course_type ct ON c.course_type = ct.id
        LEFT JOIN course_register cr ON cr.course = c.id AND cr.status = '1'
        WHERE c.department = ? AND c.course_type = ? AND c.status = '1'
        GROUP BY c.id
        HAVING (c.max_count IS NULL OR registered_count < c.max_count)
        `;

        const cAvailable = await post_database(query, [dept, type]);
        res.json(cAvailable);
    } catch (err) {
        console.error("Error fetching Course", err);
        res.status(500).json({ error: "Error fetching Course" });
    }
};

exports.getAllCourse = async(req, res)=>{
    const {type}= req.body
    if(!type){
        return res.status(400).json({error:"Course type is required..."})
    }
    try{
        const query = `
        SELECT * FROM courses WHERE course_type = ?
        `
        const Course = await post_database(query, [type])
        res.json(Course)
    }
    catch(err){
        console.error("Error fetching All Course", err);
        res.status(500).json({ error: "Error fetching All Course" });
    }
}
