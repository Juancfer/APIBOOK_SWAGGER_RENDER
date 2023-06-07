/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - pages
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the book (sample Book Title)
 *         author:
 *           type: string
 *           description: ID of the author associated with the book
 *         pages:
 *           type: integer
 *           description: Number of pages in the book
 *         publisher:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the publisher (sample Publisher Name)
 *             country:
 *               type: string
 *               description: Country of the publisher (sample SPAIN)
 */

import mongoose, { type ObjectId } from "mongoose";
const Schema = mongoose.Schema;
const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE"];

export interface IBook {
  title: string;
  author?: ObjectId;
  pages: number;
  publisher?:
  {
    name: string;
    country: string;
  };
}

// Creamos el schema del usuario
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Dame algo más de detalle, al menos 3 letras para el título."],
      maxLength: [50, "Tampoco te pases... intenta resumir un poco el título, máximo 50 letras."],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: false,
    },
    pages: {
      type: Number,
      required: false,
      min: [1, "Entiendo que el libro tendrá al menos una página ¿No?"],
      max: [10000, "Como tenga más de 10.000 páginas nadie se lo va a leer..."],
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          minLength: [3, "Dame algo más de detalle, al menos 3 letras para el nombre de la editorial."],
          maxLength: [25, "Tampoco te pases... ¿la editorial no tiene un nombre más corto? Máximo 25 letras."],
          trim: true,
        },
        country: {
          type: String,
          required: true,
          enum: allowedCountries,
          uppercase: true,
          trim: true,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<IBook>("Book", bookSchema);
