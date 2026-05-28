import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from './car.entity';
import { Autorepair } from './autorepair.entity';
import { VisitService } from './visit-service.entity';

@Entity('visits')
export class Visit {
    @PrimaryGeneratedColumn({ name: 'visit_id' })
    visitId: number;

    @Column({ name: 'date_time', type: 'timestamp', nullable: true })
    dateTime: Date | null;

    @Column({ name: 'alternative_date_time', type: 'timestamp', nullable: true })
    alternativeDateTime: Date | null;

    @Column({ name: 'note', type: 'text', nullable: true })
    note: string | null;

    @Column({ name: 'payment_way', type: 'varchar', length: 10, default: 'готівка' })
    paymentWay: string;

    @Column({ name: 'payment_status', type: 'varchar', length: 15, default: 'не оплачено' })
    paymentStatus: string;

    @Column({ name: 'is_completed', type: 'boolean', default: false })
    isCompleted: boolean;

    @Column({ name: 'is_urgent', type: 'boolean', default: false })
    isUrgent: boolean;

    @Column({ name: 'car_id' })
    carId: number;

    @Column({ name: 'autorepair_id', nullable: true })
    autorepairId: number | null;

    @ManyToOne(() => Car, (car) => car.visits, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: Car;

    @ManyToOne(() => Autorepair, (autorepair) => autorepair.visits, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'autorepair_id' })
    autorepair: Autorepair | null;

    @OneToMany(() => VisitService, (vs) => vs.visit)
    visitServices: VisitService[];
}
