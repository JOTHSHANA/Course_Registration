const { get_database, post_database } = require("../../config/db_utils");

exports.get_courseType = async (req, res) => {
    const { student } = req.body;
    if(!student){
        return res.status(400).json({error:"Student id is required.."})
    }
    try {
      const availableQuery = `
        SELECT DISTINCT ct.id, ct.type
        FROM course_type ct
        JOIN students s ON s.id = ?
        WHERE (
          (s.type = 1 AND ct.id IN (1, 2, 3, 4)) OR
          (s.type = 2 AND ct.id IN (1, 2, 3, 5)) OR
          (s.type = 3 AND ct.id IN (1, 2, 3))
        ) AND ct.status = '1';
      `;
      const availableCourseTypes = await get_database(availableQuery, [student]);
  
      const registeredQuery = `
        SELECT DISTINCT ct.id
        FROM course_type ct
        JOIN courses c ON c.course_type = ct.id
        JOIN course_register cr ON cr.course = c.id
        WHERE cr.student = ?;
      `;
      const registeredCourseTypes = await get_database(registeredQuery, [student]);
  
      const registeredIds = registeredCourseTypes.map(row => row.id);
  
      const remainingCourseTypes = availableCourseTypes.filter(ct => !registeredIds.includes(ct.id));
  
      res.json(remainingCourseTypes);
    } catch (err) {
      console.error("Error fetching resources", err);
      res.status(500).json({ error: "Error fetching resources" });
    }
  };
  
  exports.getAllType = async(req, res)=>{
    try{
        const query = `
        SELECT * FROM course_type;
        `
        const cType = await get_database(query)
        res.json(cType)
    }
    catch(err){
        console.error("Error fetching Course Type", err);
        res.status(500).json({ error: "Error fetching Course Type" });
    }
  }