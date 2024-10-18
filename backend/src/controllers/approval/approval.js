const { get_database, post_database } = require("../../config/db_utils");

exports.postReq = async(req, res)=>{
    const {student, f_course, t_course} = req.body
    if(!student || !f_course || !t_course){
        return res.status(400).json({error:"Student,f_course, t_course are required..."})
    }
    try{
        const query = `
        `
    }
    catch(err){
        
    }
}