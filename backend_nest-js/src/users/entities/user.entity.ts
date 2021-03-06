import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  picture: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, default: Role.User })
  roles: Role[];

  @Column({
    default: new Date(),
  })
  created_at: Date;

  @Column({
    default: new Date(),
  })
  updated_at: Date;
}
