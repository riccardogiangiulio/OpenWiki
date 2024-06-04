import  prisma  from  "../db/prisma.js";
import fs from "fs";
import { createUserValidation } from "../src/validations/user.validations.js";

export default function userRouting(app) {
  // create
  app.post("/signIn", createUserValidation, async (req, res) => {
      try {
          const newUser = await prisma.user.create({
              data: {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: req.body.password,
              },
          });
          res.status(201).json({ newUser });
      }catch(error) {
        console.log(error);
          res.status(500).json({ error: "Errore durante la creazione dell'utente." });
      }
  });
}



