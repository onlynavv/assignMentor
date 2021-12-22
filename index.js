import express from "express"
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import cors from "cors"
import { getMentorByMentorname,assignUserToMentor,assignMentorToUsers,getUserByUsername,changeUsertoMentor,changeMentor } from "./helper.js";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL

async function createConnection(){
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("mongodb connected")
    return client
}

export const client = await createConnection()

app.get("/", (request, response)=>{
    response.send("hai from assign mentor")
})

// create mentor list
// to create a mentor to the mentor collection in mentorship database
app.post("/createMentor", async(request, response)=>{
    const data = request.body
    const result = await client.db("mentorship").collection("mentor").insertOne(data)
    response.send(result)
})

// get mentor list
// this will help to get all the mentors
app.get("/mentor", async(request, response)=>{
    const result = await client.db("mentorship").collection("mentor").find({}).toArray()
    response.send(result)
})

// create users list
// to create a user to the users collection in mentorship database
app.post("/createUser", async(request, response)=>{
    const data = request.body
    const result = await client.db("mentorship").collection("users").insertOne(data)
    const availableUsers = await client.db("mentorship").collection("availableUsers").insertOne(data)
    console.log(availableUsers)
    response.send(result)
})

// get users list
// this will help to get all the users who have not been assigned to a mentor yet, the users who have got the mentors wont appear here
app.get("/users", async(request, response)=>{
    const result = await client.db("mentorship").collection("users").find({}).toArray()
    const availableUsers = result.filter((user)=>{
        if(!user.mentor){
            return user
        }
    })
    response.send(availableUsers)
})

// get users from the available users to assign to a mentor

app.get("/availableUsers", async(request, response)=>{
    const result = await client.db("mentorship").collection("availableUsers").find({}).toArray()
    const availableUsers = result.filter((user)=>{
        if(!user.mentor){
            return user
        }
    })
    response.send(availableUsers)
})

// find a particular mentor
app.get("/mentor/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    response.send(result)
})

// assign students to a mentor
app.put("/assignMentor", async(request, response)=>{
    console.log(request.body)
    const {mentorName, userName} = request.body
    
    //const result = await client.db("mentorship").collection("mentor").updateOne({_id:ObjectId(id)}, {$set:{usersList: data}})
    
    //const mentor = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    //const {name, usersList} = mentor
    
    // const assignedUsers = usersList.map((item)=>{
    //     return ObjectId(item._id)
    // })
    
    // await client.db("mentorship").collection("users").updateMany({_id:{$in:assignedUsers}}, {$set:{mentor:name}}, {upsert:true})
    // response.send(mentor)

    const mentorFromDB = await getMentorByMentorname(mentorName)

    if(!mentorFromDB){
        response.send({msg:"mentor not found"})
    }

    const result = await assignUserToMentor(mentorName, userName)

    const updateUsers = await assignMentorToUsers(userName, mentorName)

    await client.db("mentorship").collection("availableUsers").deleteMany({name:{$in:userName}})

    console.log(mentorFromDB)
    response.send({msg:"mentor assigned"})
})

// find a particular user
app.get("/users/:id", async(request, response)=>{
    const {id} = request.params
    console.log(id)
    const result = await client.db("mentorship").collection("users").findOne({_id:ObjectId(id)})
    response.send(result)
})

// a student assign / change the mentor
// if the student already have a mentor, it will upsert the key value in the database, if not it will add that document with the new key value
app.put("/changeMentor", async(request, response)=>{
    // const {id} = request.params
    // const data = request.body
    // const result = await client.db("mentorship").collection("users").updateOne({_id:ObjectId(id)}, {$set:data}, {upsert:true})
    // const mentor = await client.db("mentorship").collection("users").find({}).toArray()
    // response.send(mentor)

    const {userName, mentorName} = request.body

    const userFromDB = await getUserByUsername(userName)

    console.log(userFromDB)

    if(!userFromDB){
        response.send({msg:"user not found"})
    }

    // change to the new mentor / add mentor to the list of users
    const result = await changeMentor(userName, mentorName)

    // pull the user from the old mentor
    const oldMentor = await userFromDB[0].mentor
    console.log(oldMentor,"line 140")
    const mentorChange = await changeUsertoMentor(userName, oldMentor)

    // add the user to that new mentor
    await client.db("mentorship").collection("mentor").updateOne({name:mentorName},{$push:{userList:userName}})

    // remove from the available users
    await client.db("mentorship").collection("availableUsers").deleteOne({name:userName})
})

// students assigned for a particular mentor
// will get only the assigned users list, from that document, for that projection is used with the value
// "1" which means to include in the resultant
app.get("/getStudents/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)}, {projection: {usersList:1}})
    response.send(result)
})

app.listen(PORT, ()=>{
    console.log("app connected at ", PORT)
})