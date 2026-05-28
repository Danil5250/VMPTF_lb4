import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpecializationAutorepair } from './specialization-autorepair.entity';

@Entity('specializations')
export class Specialization {
    @PrimaryGeneratedColumn({ name: 'specialtion_id' })
    speciltionId: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @OneToMany(() => SpecializationAutorepair, (sa) => sa.specialization)
    specializationAutorepairs: SpecializationAutorepair[];
}
