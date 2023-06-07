import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Courses } from "../models/typeorm/courses";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const coursesRepository: Repository<Courses> = AppDataSource.getRepository(Courses);

// Router
export const coursesRouter = Router();

// CRUD: READ
coursesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses: Courses[] = await coursesRepository.find({ relations: ["students"] });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const courses = await coursesRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["students"],
    });

    if (!courses) {
      res.status(404).json({ error: "Courses not found" });
    }

    res.json(courses);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
coursesRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construimos courses
    const newCourses = new Courses();

    // Asignamos valores
    Object.assign(newCourses, req.body);

    const coursesSaved = await coursesRepository.save(newCourses);

    res.status(201).json(coursesSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
coursesRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const coursesToRemove = await coursesRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["players"]
    });

    if (!coursesToRemove) {
      res.status(404).json({ error: "Team not found" });
    } else {
      // Quitar a los jugadores este equipo
      for (const students of coursesToRemove.students) {
        students.courses = null as any;
        await AppDataSource.manager.save(students);
      }

      await coursesRepository.remove(coursesToRemove);
      res.json(coursesToRemove);
    }
  } catch (error) {
    next(error);
  }
});

coursesRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const coursesToUpdate = await coursesRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!coursesToUpdate) {
      res.status(404).json({ error: "Team not found" });
    } else {
      // Asignamos valores
      Object.assign(coursesToUpdate, req.body);

      const updatedCourses = await coursesRepository.save(coursesToUpdate);
      res.json(updatedCourses);
    }
  } catch (error) {
    next(error);
  }
});
