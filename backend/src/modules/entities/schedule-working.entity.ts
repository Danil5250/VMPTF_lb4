import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Autorepair } from './autorepair.entity';

@Entity('schedule_workings')
export class ScheduleWorking {
    @PrimaryGeneratedColumn({ name: 'schedule_id' })
    scheduleId: number;

    @Column({ name: 'day_of_week', type: 'varchar', length: 2 })
    dayOfWeek: string;

    @Column({ name: 'start_time_working', type: 'time', default: '08:00' })
    startTimeWorking: string;

    @Column({ name: 'end_time_working', type: 'time', default: '18:00' })
    endTimeWorking: string;

    @Column({ name: 'comment', type: 'text', nullable: true })
    comment: string | null;

    @Column({ name: 'autorepair_id' })
    autorepairId: number;

    @ManyToOne(() => Autorepair, (autorepair) => autorepair.scheduleWorkings, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'autorepair_id' })
    autorepair: Autorepair;
}
