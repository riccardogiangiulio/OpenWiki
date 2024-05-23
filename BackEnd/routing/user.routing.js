import  prisma  from  "../db/prisma.js";



app.get("/users", async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});