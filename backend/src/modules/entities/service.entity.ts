import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryService } from './category-service.entity';
import { AutorepairService } from './autorepair-service.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn({ name: 'service_id' })
    serviceId: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'category_services_id', nullable: true })
    categoryServicesId: number | null;

    @ManyToOne(() => CategoryService, (cs) => cs.services, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'category_services_id' })
    category: CategoryService | null;

    @OneToMany(() => AutorepairService, (as) => as.service)
    autorepairServices: AutorepairService[];
}
