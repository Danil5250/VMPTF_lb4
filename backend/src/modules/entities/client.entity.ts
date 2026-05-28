import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Car } from './car.entity';

@Entity('clients')
@Unique(['name', 'email'])
export class Client {
    @PrimaryGeneratedColumn({ name: 'client_id' })
    clientId: number;

    @Column({ name: 'name', type: 'varchar', length: 255, default: 'UNKNOWN' })
    name: string;

    @Column({ name: 'surname', type: 'varchar', length: 255, nullable: true })
    surname: string | null;

    @Column({ name: 'middlename', type: 'varchar', length: 255, nullable: true })
    middlename: string | null;

    @Column({ name: 'email', type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
    phone: string | null;

    @Column({ name: 'login', type: 'varchar', length: 100, unique: true, nullable: true })
    login: string | null;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
    password: string | null;

    @OneToMany(() => Car, (car) => car.client)
    cars: Car[];
}
