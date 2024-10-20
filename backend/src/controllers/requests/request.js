const { get_database, post_database } = require("../../config/db_utils");

exports.get_s_r_count = async(req,res) => {
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
         select s.id as stu_id, s.name, s.reg_no, s.gmail ,d.department, 
ye.year, st.type,c.id as c_id, c.code, c.name AS course_name, c.max_count,
ct.type as course_type,cr.edit_status as edit from course_register cr
left join students s on s.id = cr.student
left join courses c on c.id = cr.course 
left join departments d on d.id = s.department
left join years ye on ye.id = s.year
left join student_type st on st.id = s.type
left join course_type ct on ct.id = c.course_type
where cr.status = '1' and s.id = ? 
        `
        const StudentCourse = await post_database(query, [student])
        res.json(StudentCourse)
    }
    catch(err){
        console.error("Error fetching Stu Registered Course", err);
        res.status(500).json({ error: "Error fetching Stu Registered Course" });  
    }
}

exports.stuAvailable = async (req, res) => {
    const { student } = req.body;
    if (!student) {
        return res.status(400).json({ error: "Student id required..." });
    }

    try {
        const studentDeptQuery = `
            SELECT department 
            FROM students 
            WHERE id = ?
        `;
        const studentDept = await post_database(studentDeptQuery, [student]);
        console.log(studentDept)

        if (!studentDept) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const availableCoursesQuery = `
            SELECT c.id, c.code, c.name, c.max_count 
            FROM courses c
            LEFT JOIN course_register cr ON cr.course = c.id AND cr.student = ? AND cr.status = '1'
            WHERE c.department = ? AND c.status = '1' AND cr.course IS NULL
        `;
        const availableCourses = await post_database(availableCoursesQuery, [student, studentDept.result[0].department]);

        res.json(availableCourses);
    } catch (err) {
        console.error("Error fetching available courses", err);
        res.status(500).json({ error: "Error fetching available courses" });
    }
};

exports.request = async (req, res) => {
    const { student, f_course, t_course } = req.body;
    
    if (!student || !f_course || !t_course) {
        return res.status(400).json({ error: "Student, f_course, and t_course are required..." });
    }

    try {
        
        const getCount = `
        SELECT count FROM request WHERE student = ?
        `;
        const CountResult = await post_database(getCount, [student]);
        console.log(CountResult);

        let reqCount = 0;

        if (CountResult.length > 0 && CountResult[0].count !== null) {
            reqCount = CountResult[0].count;
        }

        const insertRequest = `
        INSERT INTO request (student, f_course, t_course, count) VALUES (?, ?, ?, ?)
        `;
        await post_database(insertRequest, [student, f_course, t_course, reqCount + 1]);
        
        const updateEditStatus = `
        UPDATE course_register SET edit_status = '0'
        WHERE student = ? AND course = ?
        `
        await post_database(updateEditStatus, [student, f_course])
        res.status(200).json({ message: "Posted Successfully", request: { student, f_course, t_course, count: reqCount + 1 } });
    } catch (err) {
        console.error("Error Inserting Request", err);
        res.status(500).json({ error: "Error Inserting Request" });
    }
};

exports.getRequestedCourse = async(req, res) =>{
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
         SELECT 
    s.id AS student_id, 
    s.name AS student_name, 
    s.reg_no AS student_reg_no,
    f.id AS f_course_id, 
    f.code AS f_course_code, 
    f.name AS f_course_name, 
    f.max_count AS f_course_max_count, 
    f_type.type AS f_course_type,
    t.id AS t_course_id, 
    t.code AS t_course_code, 
    t.name AS t_course_name, 
    t.max_count AS t_course_max_count, 
    t_type.type AS t_course_type,
    r.count

FROM 
    request r
JOIN students s ON r.student = s.id
JOIN courses f ON r.f_course = f.id
JOIN courses t ON r.t_course = t.id
JOIN course_type f_type ON f.course_type = f_type.id
JOIN course_type t_type ON t.course_type = t_type.id
WHERE r.status = '1' AND s.id =? ;
        `
        const Requested = await post_database(query ,[student])
        res.json(Requested)
    }
    catch(err){
        console.error("Error Fetching Requested course", err);
        res.status(500).json({ error: "Error Fetching Requested course" });
    }
}

exports.RejectedCourse = async(req, res)=>{
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
         SELECT 
    s.id AS student_id, 
    s.name AS student_name, 
    s.reg_no AS student_reg_no,
    f.id AS f_course_id, 
    f.code AS f_course_code, 
    f.name AS f_course_name, 
    f.max_count AS f_course_max_count, 
    f_type.type AS f_course_type,
    t.id AS t_course_id, 
    t.code AS t_course_code, 
    t.name AS t_course_name, 
    t.max_count AS t_course_max_count, 
    t_type.type AS t_course_type,
    r.count,
    r.reason

FROM 
    request r
JOIN students s ON r.student = s.id
JOIN courses f ON r.f_course = f.id
JOIN courses t ON r.t_course = t.id
JOIN course_type f_type ON f.course_type = f_type.id
JOIN course_type t_type ON t.course_type = t_type.id
WHERE r.status = '3' AND s.id =? ;
        `
        const Rejected = await post_database(query ,[student])
        res.json(Rejected)
    }
    catch(err){
        console.error("Error Fetching Rejected course", err);
        res.status(500).json({ error: "Error Fetching Rejected course" });
    }
}

exports.ApprovedCourse = async(req, res)=>{
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
         SELECT 
    s.id AS student_id, 
    s.name AS student_name, 
    s.reg_no AS student_reg_no,
    f.id AS f_course_id, 
    f.code AS f_course_code, 
    f.name AS f_course_name, 
    f.max_count AS f_course_max_count, 
    f_type.type AS f_course_type,
    t.id AS t_course_id, 
    t.code AS t_course_code, 
    t.name AS t_course_name, 
    t.max_count AS t_course_max_count, 
    t_type.type AS t_course_type,
    r.count

FROM 
    request r
JOIN students s ON r.student = s.id
JOIN courses f ON r.f_course = f.id
JOIN courses t ON r.t_course = t.id
JOIN course_type f_type ON f.course_type = f_type.id
JOIN course_type t_type ON t.course_type = t_type.id
WHERE r.status = '2' AND s.id =? ;
        `
        const Approved = await post_database(query ,[student])
        res.json(Approved)
    }
    catch(err){
        console.error("Error Fetching Approved course", err);
        res.status(500).json({ error: "Error Fetching Approved course" });
    }
}