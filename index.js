import express from "express"
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL

async function createConnection(){
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("mongodb connected")
    return client
}

const client = await createConnection()

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

// find a particular mentor
app.get("/mentor/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    response.send(result)
})

// assign students to a mentor
app.put("/assignMentor/:id", async(request, response)=>{
    const {id} = request.params
    const data = request.body
    // to that mentor, update his document with the users list which has been assigned to him
    const result = await client.db("mentorship").collection("mentor").updateOne({_id:ObjectId(id)}, {$set:{usersList: data}})
    // get that mentor document
    const mentor = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    const {name, usersList} = mentor
    // get all the assigned user's id to his document in an array
    const assignedUsers = usersList.map((item)=>{
        return ObjectId(item._id)
    })
    // and then update the users list with their assigned mentors respectively, it will affect the users collection, only
    // to the assigned users document, so that next time when mentors have to be allocated for users, these already 
    // assigned users name wont show up
    await client.db("mentorship").collection("users").updateMany({_id:{$in:assignedUsers}}, {$set:{mentor:name}}, {upsert:true})
    response.send(mentor)
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
app.put("/changeMentor/:id", async(request, response)=>{
    const {id} = request.params
    const data = request.body
    const result = await client.db("mentorship").collection("users").updateOne({_id:ObjectId(id)}, {$set:data}, {upsert:true})
    const mentor = await client.db("mentorship").collection("users").find({}).toArray()
    response.send(mentor)
})

// students assigned for a particular mentor

app.get("/getStudents/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)}, {projection: {usersList:1}})
    response.send(result)
})

app.listen(PORT, ()=>{
    console.log("app connected at ", PORT)
})