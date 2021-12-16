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
app.post("/createMentor", async(request, response)=>{
    const data = request.body
    const result = await client.db("mentorship").collection("mentor").insertOne(data)
    response.send(result)
})

// get mentor list
app.get("/mentor", async(request, response)=>{
    const result = await client.db("mentorship").collection("mentor").find({}).toArray()
    response.send(result)
})

// create users list
app.post("/createUser", async(request, response)=>{
    const data = request.body
    const result = await client.db("mentorship").collection("users").insertOne(data)
    response.send(result)
})

// get users list
app.get("/users", async(request, response)=>{
    const result = await client.db("mentorship").collection("users").find({}).toArray()
    const availableUsers = result.filter((user)=>{
        if(!user.mentor){
            return user
        }
    })
    response.send(availableUsers)
})

// find a  mentor
app.get("/mentor/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    response.send(result)
})

// assign students to mentor
app.put("/assignMentor/:id", async(request, response)=>{
    const {id} = request.params
    const data = request.body
    const result = await client.db("mentorship").collection("mentor").updateOne({_id:ObjectId(id)}, {$set:{usersList: data}})
    const mentor = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)})
    const {name, usersList} = mentor
    const assignedUsers = usersList.map((item)=>{
        return ObjectId(item._id)
    })
    await client.db("mentorship").collection("users").updateMany({_id:{$in:assignedUsers}}, {$set:{mentor:name}}, {upsert:true})
    response.send(mentor)
})

// find a  user
app.get("/users/:id", async(request, response)=>{
    const {id} = request.params
    console.log(id)
    const result = await client.db("mentorship").collection("users").findOne({_id:ObjectId(id)})
    response.send(result)
})

// a student assign / change the mentor

app.put("/changeMentor/:id", async(request, response)=>{
    const {id} = request.params
    const data = request.body
    const result = await client.db("mentorship").collection("users").updateOne({_id:ObjectId(id)}, {$set:data}, {upsert:true})
    const mentor = await client.db("mentorship").collection("users").find({}).toArray()
    response.send(mentor)
})

// students assigned for a mentor

app.get("/getStudents/:id", async(request, response)=>{
    const {id} = request.params
    const result = await client.db("mentorship").collection("mentor").findOne({_id:ObjectId(id)}, {projection: {usersList:1}})
    response.send(result)
})

app.listen(PORT, ()=>{
    console.log("app connected at ", PORT)
})