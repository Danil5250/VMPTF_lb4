import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity('category_services')
export class CategoryService {
    @PrimaryGeneratedColumn({ name: 'category_service_id' })
    categoryServiceId: number;

    @Column({ name: 'category_name', type: 'varchar', length: 255 })
    categoryName: string;

    @OneToMany(() => Service, (service) => service.category)
    services: Service[];
}
