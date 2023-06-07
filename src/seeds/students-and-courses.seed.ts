
import { AppDataSource } from "../databases/typeorm-datasource";
import { Students } from "../models/typeorm/students";
import { Courses } from "../models/typeorm/courses";

export const courseAndStudentSeed = async (): Promise<void> => {
  // Nos conectamos a la BBDD
  const dataSource = await AppDataSource.initialize();
  console.log(`Tenemos conexión!! Conectados a ${dataSource?.options?.database as string}`);

  // Eliminamos los datos existentes
  await AppDataSource.manager.delete(Students, {});
  await AppDataSource.manager.delete(Courses, {});
  console.log("Eliminados estudiantes y cursos");

  // Creamos dos players
  const student1 = {
    firstName: "Juan",
    lastName: "Perez"
  };

  const student2 = {
    firstName: "Ana",
    lastName: "Lopez",
  };

  // Creamos las entidades
  const student1Entity = AppDataSource.manager.create(Students, student1);
  const student2Entity = AppDataSource.manager.create(Students, student2);

  // Las guardamos en base de datos
  await AppDataSource.manager.save(student1Entity);
  await AppDataSource.manager.save(student2Entity);

  // Creamos equipo
  const courses = {
    name: "Matemáticas",
    department: "Números",
    students: [student1Entity, student2Entity]
  };

  // Creamos entidad equipo
  const courseEntity = AppDataSource.manager.create(Courses, courses);

  // Guardamos el equipo en BBDD
  await AppDataSource.manager.save(courseEntity);

  console.log("Creados los dos estudiantes y cursos");

  // Cerramos la conexión
  await AppDataSource.destroy();
  console.log("Cerrada conexión SQL");
}

void courseAndStudentSeed();
