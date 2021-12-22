import { client } from "./index.js";

async function getMentorByMentorname(mentorname){
    return await client.db("mentorship").collection("mentor").find({name:mentorname}).toArray()
}

async function getUserByUsername(username){
    return await client.db("mentorship").collection("users").find({name:username}).toArray()
}

async function assignUserToMentor(mentorname, userlist){
    return await client.db("mentorship").collection("mentor").updateOne({name:mentorname},{$set:{userList:userlist}},{upsert:true})
}

async function assignMentorToUsers(username, mentorname){
    return await client.db("mentorship").collection("users").updateMany({name:{$in:username}},{$set:{mentor:mentorname}},{upsert:true})
}

async function changeMentor(username, mentorname){
    return await client.db("mentorship").collection("users").updateOne({name:username},{$set:{mentor:mentorname}},{upsert:true})
}

async function changeUsertoMentor(username, oldmentor){
    return await client.db("mentorship").collection("mentor").updateOne({name:oldmentor},{$pull:{userList:username}})
}

export {getMentorByMentorname,assignUserToMentor,assignMentorToUsers,getUserByUsername,changeUsertoMentor,changeMentor}