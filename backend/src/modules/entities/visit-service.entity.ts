import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Visit } from './visit.entity';
import { AutorepairService } from './autorepair-service.entity';

@Entity('visit_services')
export class VisitService {
    @PrimaryGeneratedColumn({ name: 'visit_service_id' })
    visitServiceId: number;

    @Column({ name: 'problem_description', type: 'text', nullable: true })
    problemDescription: string | null;

    @Column({ name: 'visit_id' })
    visitId: number;

    @Column({ name: 'autorepair_service_id', nullable: true })
    autorepairServiceId: number | null;

    @ManyToOne(() => Visit, (visit) => visit.visitServices, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'visit_id' })
    visit: Visit;

    @ManyToOne(() => AutorepairService, (as) => as.visitServices, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'autorepair_service_id' })
    autorepairService: AutorepairService | null;
}
