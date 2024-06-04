import validate from "validate.js";
import fs from 'fs'
import prisma from "../../db/prisma.js";


const DB_PATH = './db/prisma.js'; 

validate.validators.userExists = function (value, options, key, attributes) {
    return new Promise(async(res,rej) => {
        const user =  await prisma.user.findFirst({
           where: {
            email: value,
            id: {
                not: options.id
            }
           } 
        })
        if (user) {
            res('utente già registrato')
        }
        else {
            res();
        }
        
    })
};

export function createUserValidation(req, res, next) {
    validate.async(req.body, {
        firstName: {
            presence: { allowEmpty: false },
            length: { minimum: 5 }
        },
        lastName: {
            presence: { allowEmpty: false },
            length: { minimum: 5 }
        },
        password: {
            presence: { allowEmpty: false },
        },
        passwordConfirmation: {
            equality: 'password',
        },
        email: {
            userExists: {},
        }
    })
    .then(() => {
        console.log('next');
        next(); // Passa al middleware successivo se la validazione ha successo
    }, errors => {
        console.log(errors);
        res.status(400).json({ errors }); // Invia gli errori di validazione al client
    });
};

