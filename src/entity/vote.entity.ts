import { Candidate } from "../entity/candidate.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vote{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partyNumber: number;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'partyNumber'})
  candidate: Candidate;
}