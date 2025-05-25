import { UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class Base {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
    deleted_at!: Date;
}
