import express, { type NextFunction, type Response, type Request } from "express";
import { sqlQuery } from "../databases/sql-db";
import { type TechCompanysBody } from "../models/sql/TechCompanys";
export const companyRouter = express.Router();

// CRUD: READ
companyRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await sqlQuery(`
      SELECT *
      FROM tech_companys
    `);
    const response = { data: rows };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
companyRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const rows = await sqlQuery(`
      SELECT *
      FROM tech_companys
      WHERE id=${id}
    `);

    if (rows?.[0]) {
      const response = { data: rows?.[0] };
      res.json(response);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
companyRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, foundedYear, employeesNumber, headquartes, ceo } = req.body as TechCompanysBody;

    const query: string = `
      INSERT INTO tech_companys (name, released_year, githut_rank, pypl_rank, tiobe_rank)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [name, foundedYear, employeesNumber, headquartes, ceo];

    const result = await sqlQuery(query, params);

    if (result) {
      return res.status(201).json({});
    } else {
      return res.status(500).json({ error: "Company not created" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
companyRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await sqlQuery(`
      DELETE FROM tech_companys
      WHERE id = ${id}
    `);

    res.json({ message: "Company deleted!" });
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
companyRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, foundedYear, employeesNumber, headquartes, ceo } = req.body as TechCompanysBody;

    const query = `
      UPDATE tech_companys
      SET name = ?, founded_year = ?, employees_number = ?, headquartes = ?, ceo = ?
      WHERE id = ?
    `;
    const params = [name, foundedYear, employeesNumber, headquartes, ceo, id];
    await sqlQuery(query, params);

    const rows = await sqlQuery(`
      SELECT *
      FROM tech_companys
      WHERE id=${id}
    `);

    if (rows?.[0]) {
      const response = { data: rows?.[0] };
      res.json(response);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});
