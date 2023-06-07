import mongoose from "mongoose";
import { mongoConnect } from "../databases/mongo-db.js";
import { Book, type IBook } from "../models/mongo/Book.js";
import { faker } from "@faker-js/faker";

const bookList: IBook[] = [
  { title: "Harry Potter", pages: 543 },
  { title: "1984", pages: 328 },
  { title: "To Kill a Mockingbird", pages: 281 },
  { title: "The Great Gatsby", pages: 180 },
  { title: "Pride and Prejudice", pages: 279 },
];

// Creamos libros adicionales
for (let i = 0; i < 50; i++) {
  const newBook: IBook = {
    title: faker.lorem.words(4),
    pages: faker.number.int({ min: 200, max: 700 }),
  };
  bookList.push(newBook);
}

const bookWithPublisher: IBook = {
  title: "El guardían entre el centeno",
  pages: 231,
  publisher: {
    name: "Alianza",
    country: "Spain",
  },
};

bookList.push(bookWithPublisher);

const bookSeed = async (): Promise<void> => {
  try {
    const database = await mongoConnect();
    console.log(`Tenemos conexión: ${database?.connection?.name as string}`);

    // Borrar datos
    await Book.collection.drop();
    console.log("Libros eliminados");

    // Añadimos libros
    const documents = bookList.map((book) => new Book(book));
    await Book.insertMany(documents);
    console.log("Libros creados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

void bookSeed();
