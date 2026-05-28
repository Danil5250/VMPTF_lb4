import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Autorepair } from './autorepair.entity';
import { Specialization } from './specialization.entity';

@Entity('specialization_autorepairs')
export class SpecializationAutorepair {
    @PrimaryGeneratedColumn({ name: 'specialtion_autorepair_id' })
    speciltionAutorepairId: number;

    @Column({ name: 'model', type: 'varchar', length: 100, nullable: true })
    model: string | null;

    @Column({ name: 'engine_type', type: 'varchar', length: 50, nullable: true })
    engineType: string | null;

    @Column({ name: 'year', type: 'integer', nullable: true })
    year: number | null;

    @Column({ name: 'autorepair_id' })
    autorepairId: number;

    @Column({ name: 'specialtion_id' })
    speciltionId: number;

    @ManyToOne(() => Autorepair, (autorepair) => autorepair.specializationAutorepairs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'autorepair_id' })
    autorepair: Autorepair;

    @ManyToOne(() => Specialization, (specialization) => specialization.specializationAutorepairs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'specialtion_id' })
    specialization: Specialization;
}
