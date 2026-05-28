import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Autorepair } from './autorepair.entity';
import { Service } from './service.entity';
import { VisitService } from './visit-service.entity';

@Entity('autorepair_services')
export class AutorepairService {
    @PrimaryGeneratedColumn({ name: 'autorepair_service_id' })
    autorepairServiceId: number;

    @Column({ name: 'autorepair_id' })
    autorepairId: number;

    @Column({ name: 'service_id' })
    serviceId: number;

    @Column({ name: 'service_price', type: 'decimal', precision: 10, scale: 2 })
    servicePrice: number;

    @Column({ name: 'garantie_term', type: 'integer', nullable: true })
    garantieTerm: number | null;

    @Column({ name: 'duration', type: 'integer' })
    duration: number;

    @ManyToOne(() => Autorepair, (autorepair) => autorepair.autorepairServices, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'autorepair_id' })
    autorepair: Autorepair;

    @ManyToOne(() => Service, (service) => service.autorepairServices, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @OneToMany(() => VisitService, (vs) => vs.autorepairService)
    visitServices: VisitService[];
}
