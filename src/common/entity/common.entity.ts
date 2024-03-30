import { Exclude } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VirtualColumn } from "typeorm";

export abstract class CommonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}

export abstract class ExtendedEntity extends CommonEntity {
    @Exclude()
    @Column({ name: 'create_by', update: false })
    createBy: number

    @Exclude()
    @Column({ name: 'update_by' })
    updateBy: number

    @VirtualColumn({ query: alias => `SELECT email FROM user_entity WHERE id = ${alias}.create_by` })
    creator: string

    @VirtualColumn({ query: alias => `SELECT email FROM user_entity WHERE id = ${alias}.update_by` })
    updater: string

}