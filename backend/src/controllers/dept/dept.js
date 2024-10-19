const { get_database, post_database } = require("../../config/db_utils");

exports.get_dept = async(req, res)=> {
    try{
        const query = `
        SELECT * FROM departments WHERE status = '1'
        `
        const dept = await get_database(query)
        res.json(dept)
    }
    catch(err){
        console.error("Error updating course", err);
        res.status(500).json({ error: "Error updating course" });
    }
}

exports.get_year = async(req, res)=>{
    try{
        const query = `
        SELECT * FROM years
        `
        const year = await get_database(query)
        res.json(year)
    }
    catch(err){
        console.error("Error Fetching years", err);
        res.status(500).json({ error: "Error Fetching years" });
    }
}