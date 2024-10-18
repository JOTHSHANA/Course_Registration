const { get_database, post_database } = require("../../config/db_utils");

exports.get_s_r_count = async(req,res) => {
    const {student} = req.body
    if(!student){
        return res.status(400).json({error:"Student id is required..."})
    }
    try{
        const query = `
         select s.id as stu_id, s.name, s.reg_no, s.gmail ,d.department, 
ye.year, st.type,c.id as c_id, c.code, c.name AS course_name, c.max_count, ct.type as course_type from course_register cr
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
        const [studentDept] = await post_database(studentDeptQuery, [student]);

        if (!studentDept) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const availableCoursesQuery = `
            SELECT c.id, c.code, c.name, c.max_count 
            FROM courses c
            LEFT JOIN course_register cr ON cr.course = c.id AND cr.student = ? AND cr.status = '1'
            WHERE c.department = ? AND c.status = '1' AND cr.course IS NULL
        `;
        const availableCourses = await post_database(availableCoursesQuery, [student, studentDept.department]);

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

        res.status(200).json({ message: "Posted Successfully", request: { student, f_course, t_course, count: reqCount + 1 } });
    } catch (err) {
        console.error("Error Inserting Request", err);
        res.status(500).json({ error: "Error Inserting Request" });
    }
};
