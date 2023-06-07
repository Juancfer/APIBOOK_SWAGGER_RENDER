import mongoose from "mongoose";
import { mongoConnect } from "../databases/mongo-db.js";
import { Author, type IAuthor } from "../models/mongo/Author.js";

const authorList: IAuthor[] = [
  {
    email: "gabriel@gmail.com",
    password: "12345678",
    name: "Gabriel García Márquez",
    country: "Colombia",
  },
  {
    email: "jane@gmail.com",
    password: "abcdefgh",
    name: "Jane Austen",
    country: "England",
  },
  {
    email: "leo@gmail.com",
    password: "999888777666",
    name: "Leo Tolstoy",
    country: "Russia",
  },
];

const authorSeed = async (): Promise<void> => {
  try {
    await mongoConnect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Author.collection.drop();
    console.log("Authors eliminados");

    // Añadimos usuarios
    const documents = authorList.map((author) => new Author(author));
    // await Author.insertMany(documents);
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];
      await document.save();
    }

    console.log("Authors creados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

void authorSeed();
