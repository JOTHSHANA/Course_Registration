const { get_database, post_database } = require("../../config/db_utils");

exports.get_courseType = async(req, res)=>{
    try{
        const query = `
        SELECT * FROM course_type WHERE status = '1'
        `
        const CourseType = await get_database(query)
        res.json(CourseType)
    }
    catch(err){
        console.error("Error fetching resources", err);
        res.status(500).json({ error: "Error fetching resources" });
    }
}

