import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Courses } from "./courses";

@Entity()
export class Students {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @ManyToOne(type => Courses, courses => courses.students)
    courses: Courses;
}
