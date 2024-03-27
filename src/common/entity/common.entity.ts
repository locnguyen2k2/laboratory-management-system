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
    @Column({ name: 'created_by', update: false })
    createdBy: number

    @Exclude()
    @Column({ name: 'updated_by' })
    updatedBy: number

    @VirtualColumn({ query: alias => `SELECT email FROM user_entity WHERE id = ${alias}.created_by` })
    creator: string

    @VirtualColumn({ query: alias => `SELECT email FROM user_entity WHERE id = ${alias}.updated_by` })
    updater: string

}