# assignMentor task

### create mentor

click [https://mentorship-api-app.herokuapp.com/createMentor](https://mentorship-api-app.herokuapp.com/createMentor)

in post method, inside body give it like this,

```
{
    "name":"maran",
    "course": "data structure"
}
```

![image](https://user-images.githubusercontent.com/77113035/146376208-1852d7cd-be52-43ec-8694-e9a7796f5f9a.png)

### create user

click [https://mentorship-api-app.herokuapp.com/createUser](https://mentorship-api-app.herokuapp.com/createUser)

in post method, inside body give it like this,

```
{
    "name":"karen",
    "dept": "it"
}
```

![image](https://user-images.githubusercontent.com/77113035/146376361-93d465dd-3121-4b71-9b37-9e0cca1836a6.png)

### assign mentor

to assign multiple users to a mentor, we need to provide that mentor's id in the api endpoint, it follows,

ex: https://mentorship-api-app.herokuapp.com/assignMentor/mentor_id

click [https://mentorship-api-app.herokuapp.com/assignMentor/61bb05771469be448abce4a8](https://mentorship-api-app.herokuapp.com/assignMentor/61bb05771469be448abce4a8)

in put method, inside body give it like this,

```
[
    {
        "_id": "61bb080db1e82fdac1cac157",
        "name": "prashanth",
        "dept": "cse"
    },
    {
        "_id": "61bb081ab1e82fdac1cac158",
        "name": "kabilan",
        "dept": "ece"
    },
    {
        "_id": "61bb0824b1e82fdac1cac159",
        "name": "arul",
        "dept": "eee"
    }
]
```

![image](https://user-images.githubusercontent.com/77113035/146376546-b0387b2b-6b49-467b-8c2e-a92ebb93f444.png)

### change the mentor

the user to change their mentor, we have to provide the users id to the endpoint, it follows,

ex: https://mentorship-api-app.herokuapp.com/changeMentor/user_id

click [https://mentorship-api-app.herokuapp.com/changeMentor/61bb080db1e82fdac1cac157](https://mentorship-api-app.herokuapp.com/changeMentor/61bb080db1e82fdac1cac157)

in put method, inside body give it like this

```
{
    "mentor":"lego"
}
```

![image](https://user-images.githubusercontent.com/77113035/146376665-7cb42b06-5a2d-4bac-bb71-28193db01312.png)

### users for a particular mentor

to get the users assigned for a particular mentor, we have to give them the id, so it follows like,
ex: https://mentorship-api-app.herokuapp.com/getStudents/mentor_id

click [https://mentorship-api-app.herokuapp.com/getStudents/61bb05771469be448abce4a8](https://mentorship-api-app.herokuapp.com/getStudents/61bb05771469be448abce4a8)

![image](https://user-images.githubusercontent.com/77113035/146377039-b6c358d7-1d97-4cce-b669-56a3057c81f7.png)

### get the users list, user's name wont be included in this list if he is already assigned to a mentor

click [https://mentorship-api-app.herokuapp.com/users](https://mentorship-api-app.herokuapp.com/users)

### get individual mentor

click [https://mentorship-api-app.herokuapp.com/mentor/61bb05771469be448abce4a8](https://mentorship-api-app.herokuapp.com/mentor/61bb05771469be448abce4a8)

### get individual user

click [https://mentorship-api-app.herokuapp.com/users/61bb081ab1e82fdac1cac158](https://mentorship-api-app.herokuapp.com/users/61bb081ab1e82fdac1cac158)

### get all the mentors list

click [https://mentorship-api-app.herokuapp.com/mentor](https://mentorship-api-app.herokuapp.com/mentor)

