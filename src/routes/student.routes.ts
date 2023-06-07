import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Students } from "../models/typeorm/students";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";
import { Courses } from "../models/typeorm/courses";

const studentRepository: Repository<Students> = AppDataSource.getRepository(Students);
const coursesRepository: Repository<Courses> = AppDataSource.getRepository(Courses);

// Router
export const studentRouter = Router();

// CRUD: READ
studentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students: Students[] = await studentRepository.find({ relations: ["courses"] });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const student = await studentRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["courses"],
    });

    if (!student) {
      res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
studentRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos student
    const newStudent = new Students();

    let coursesOfStudent;

    if (req.body.coursesId) {
      coursesOfStudent = await coursesRepository.findOne({
        where: {
          id: req.body.coursesId,
        },
      });

      if (!coursesOfStudent) {
        res.status(404).json({ error: "Courses not found" });
        return;
      }
    }

    // Asignamos valores
    Object.assign(newStudent, {
      ...req.body,
      courses: coursesOfStudent,
    });

    const studentsaved = await studentRepository.save(newStudent);

    res.status(201).json(studentsaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
studentRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const studentToRemove = await studentRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!studentToRemove) {
      res.status(404).json({ error: "Player not found" });
    } else {
      await studentRepository.remove(studentToRemove);
      res.json(studentToRemove);
    }
  } catch (error) {
    next(error);
  }
});

studentRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const studentToUpdate = await studentRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!studentToUpdate) {
      res.status(404).json({ error: "Player not found" });
    } else {
      let coursesOfStudent;

      if (req.body.coursesId) {
        coursesOfStudent = await coursesRepository.findOne({
          where: {
            id: req.body.coursesId,
          },
        });

        if (!coursesOfStudent) {
          res.status(404).json({ error: "Courses not found" });
          return;
        }
      }

      // Asignamos valores
      Object.assign(studentToUpdate, {
        ...req.body,
        courses: coursesOfStudent,
      });

      const updatedPlayer = await studentRepository.save(studentToUpdate);
      res.json(updatedPlayer);
    }
  } catch (error) {
    next(error);
  }
});
