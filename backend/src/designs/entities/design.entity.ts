import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Template } from '../../templates/entities/template.entity';

@Entity('designs')
export class Design {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  canvasData: any; // Fabric.js JSON format

  @Column({ type: 'int', default: 800 })
  width: number;

  @Column({ type: 'int', default: 600 })
  height: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  isTemplate: boolean;

  @ManyToOne(() => User, (user) => user.designs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: Template;

  @Column({ nullable: true })
  templateId: string;

  @Column({ nullable: true })
  thumbnail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
