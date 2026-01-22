import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Design } from '../../designs/entities/design.entity';

export enum TemplateCategory {
  RESUME = 'resume',
  BUSINESS_CARD = 'business_card',
  INSTAGRAM_POST = 'instagram_post',
  INVITATION = 'invitation',
  MENU = 'menu',
  FLYER = 'flyer',
  POSTER = 'poster',
  LOGO = 'logo',
  OTHER = 'other',
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  canvasData: any; // Fabric.js JSON format

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({
    type: 'enum',
    enum: TemplateCategory,
    default: TemplateCategory.OTHER,
  })
  category: TemplateCategory;

  @Column({ default: false })
  isPremium: boolean;

  @Column()
  thumbnail: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @OneToMany(() => Design, (design) => design.template)
  designs: Design[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
