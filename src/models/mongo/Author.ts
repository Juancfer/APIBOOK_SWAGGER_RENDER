/**
 * @swagger
 * components:
 *  schemas:
 *    Author:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the Author (sample Ford)
 *        email:
 *          type: string
 *          description: Email of the author (sample author@mail.com)
 *        password:
 *          type: string
 *          description: Password of the author (sample 12345678)
 *        country:
 *          type: string
 *          description: Country of this Author (sample SPAIN)
 *        profileImage:
 *          type: string
 *          description: Profile image of this Author (sample http://balbblabla.com/image.jpg)
 */

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE", "ENGLAND", "COLOMBIA", "RUSSIA", "ARGENTINA", "CZECHOSLOVAKIA", "NIGERIA"];

export interface IAuthor {
  email: string;
  password: string;
  name: string;
  country: string;
  profileImage?: string;
}

// Creamos el schema del author
const authorSchema = new Schema<IAuthor>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
    name: {
      type: String,
      required: true,
      minLength: [3, "Dame algo más de detalle, al menos 3 letras para el nombre."],
      maxLength: [25, "Tampoco te pases... intenta resumir un poco el nombre, máximo 25 letras."],
      trim: true,
    },
    country: {
      type: String,
      required: true,
      enum: allowedCountries,
      uppercase: true,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

export const Author = mongoose.model<IAuthor>("Author", authorSchema);
