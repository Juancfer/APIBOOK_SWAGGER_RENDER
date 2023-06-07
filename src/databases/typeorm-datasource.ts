import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Students } from "../models/typeorm/students";
import { Courses } from "../models/typeorm/courses";
dotenv.config();

const SQL_HOST: string = process.env.SQL_HOST as string;
const SQL_USER: string = process.env.SQL_USER as string;
const SQL_PASSWORD: string = process.env.SQL_PASSWORD as string;
const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

export const AppDataSource = new DataSource({
  host: SQL_HOST,
  username: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DATABASE,
  type: "mysql",
  port: 3306,
  synchronize: true,
  logging: false,
  entities: [Students, Courses], // TODO
  migrations: [], // TODO
  subscribers: [], // TODO
});
