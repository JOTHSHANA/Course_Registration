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
    const {dept, year} = req.body
    if(!dept || !year){
        return res.status(400).json({error:"Department and year id is required..."})
    }
   try {const query = `
    SELECT 
    s.id AS student_id,
    s.name AS NAME,
    s.reg_no AS "REGISTER NUMBER",
    s.gmail AS GMAIL,
    d.department AS "DEPARTMENT",
    ye.year AS YEAR,
    
    MAX(CASE WHEN ct.type = 'OPEN ELECTIVE' THEN c.name ELSE NULL END) AS "OPEN ELECTIVE",
    MAX(CASE WHEN ct.type = 'PROFESSIONAL ELECTIVE' THEN c.name ELSE NULL END) AS "PROFESSIONAL ELECTIVE",
    MAX(CASE WHEN ct.type = 'ADD ON' THEN c.name ELSE NULL END) AS "ADD-ON COURSE",
    MAX(CASE WHEN ct.type = 'HONOUR' THEN c.name ELSE NULL END) AS "HONOUR COURSE",
    MAX(CASE WHEN ct.type = 'MINOR' THEN c.name ELSE NULL END) AS "MINOR COURSE"

FROM students s
LEFT JOIN course_register cr ON s.id = cr.student
LEFT JOIN courses c ON cr.course = c.id
LEFT JOIN course_type ct ON c.course_type = ct.id
LEFT JOIN departments d ON s.department = d.id
LEFT JOIN years ye ON s.year = ye.id
WHERE s.department = ? AND s.year = ?

GROUP BY s.id, s.name, s.reg_no, s.gmail, d.department, ye.year

    `
    const RegisterCourse = await post_database(query, [dept, year])
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

exports.getStuRegister = async(req, res)=>{
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
        SELECT s.id AS stu_id,s.name, s.reg_no, c.id AS course_id, 
        c.code,c.name AS course_name FROM course_register cr
        LEFT JOIN students s ON s.id = cr.student
        LEFT JOIN courses c ON c.id = cr.course
        WHERE cr.status = '1'
        `
        const StuRegister = await post_database(query, [student])
        res.json(StuRegister)
    }
    catch(err){
        console.error("Error fetching stu Registered Course", err);
        res.status(500).json({ error: "Error fetching Stu Registered Course" }); 
    }
}