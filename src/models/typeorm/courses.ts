import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Students } from "./students";

@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @Column()
    department: string;

  // JUGADORES
  @OneToMany(type => Students, students => students.courses, { cascade: true })
    students: Students[];
}
