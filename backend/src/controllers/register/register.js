const { query } = require("express");
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
   try {const query = `
    select s.id as stu_id, s.name, s.reg_no, s.gmail ,d.department, 
ye.year, st.type,c.id as c_id, c.code, c.name AS course_name, c.max_count, ct.type as course_type from course_register cr
left join students s on s.id = cr.student
left join courses c on c.id = cr.course 
left join departments d on d.id = s.department
left join years ye on ye.id = s.year
left join student_type st on st.id = s.type
left join course_type ct on ct.id = c.course_type
where cr.status = '1' and s.department = ?
    `
    const RegisterCourse = await post_database(query, [dept])
    res.json(RegisterCourse)}
    catch(err){
        console.error("Error fetching Registered Course", err);
        res.status(500).json({ error: "Error fetching Registered Course" });
    }
}

exports.getRegisteredCount = async(req, res)=>{
    const {dept} = req.body
    try{
        const query = `
        SELECT c.id AS c_id, c.max_count,c.code, c.name, IFNULL(SUM(cr.status = '1'), 0) AS registered_count
        FROM courses c
        LEFT JOIN course_register cr ON cr.course = c.id AND cr.status = '1'
        WHERE c.department = ?
        GROUP BY c.id
        `
        const RCount = await post_database(query, [dept])
        res.json(RCount)
    }
    catch(err){
        console.error("Error fetching Registered Count", err);
        res.status(500).json({ error: "Error fetching Registered Count" });  
    }
}