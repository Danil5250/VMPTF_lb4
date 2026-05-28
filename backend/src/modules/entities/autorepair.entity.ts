import {
    Check,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Visit } from './visit.entity';
import { AutorepairService } from './autorepair-service.entity';
import { ScheduleWorking } from './schedule-working.entity';
import { SpecializationAutorepair } from './specialization-autorepair.entity';

@Entity('autorepairs')
export class Autorepair {
    @PrimaryGeneratedColumn({ name: 'autorepair_id' })
    autorepairId: number;

    @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'adress', type: 'text', nullable: true })
    adress: string | null;

    @Column({ name: 'index', type: 'varchar', length: 20, nullable: true })
    index: string | null;

    @Column({ name: 'workers_amount', type: 'integer', default: 1 })
    workersAmount: number;

    @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
    phone: string | null;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email: string | null;

    @Column({ name: 'ranking', type: 'decimal', precision: 3, scale: 2, default: 0.00 })
    ranking: number;

    @Column({ name: 'password', type: 'varchar', length: 100, nullable: true })
    password: string | null;

    @OneToMany(() => Visit, (visit) => visit.autorepair)
    visits: Visit[];

    @OneToMany(() => AutorepairService, (as) => as.autorepair)
    autorepairServices: AutorepairService[];

    @OneToMany(() => ScheduleWorking, (sw) => sw.autorepair)
    scheduleWorkings: ScheduleWorking[];

    @OneToMany(() => SpecializationAutorepair, (sa) => sa.autorepair)
    specializationAutorepairs: SpecializationAutorepair[];
}
