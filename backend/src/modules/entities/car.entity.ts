import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Visit } from './visit.entity';

@Entity('cars')
export class Car {
    @PrimaryGeneratedColumn({ name: 'car_id' })
    carId: number;

    @Column({ name: 'brand', type: 'varchar', length: 100, nullable: true })
    brand: string | null;

    @Column({ name: 'model', type: 'varchar', length: 100, nullable: true })
    model: string | null;

    @Column({ name: 'engine_type', type: 'varchar', length: 50, nullable: true })
    engineType: string | null;

    @Column({ name: 'year', type: 'integer', nullable: true })
    year: number | null;

    @Column({ name: 'insurance', type: 'timestamp', nullable: true })
    insurance: Date | null;

    @Column({ name: 'license_plate', type: 'varchar', length: 15, unique: true })
    licensePlate: string;

    @Column({ name: 'vin', type: 'varchar', length: 50, unique: true })
    vin: string;

    @Column({ name: 'client_id' })
    clientId: number;

    @ManyToOne(() => Client, (client) => client.cars, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @OneToMany(() => Visit, (visit) => visit.car)
    visits: Visit[];
}
