import { Expose, Transform, plainToClass } from "class-transformer";

export class BaseDto {

    @Expose()
    @Transform(() => new Date())
    createdAt: Date;
    @Expose()
    @Transform(() => new Date())
    updatedAt: Date;

    static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToClass(this, obj, { excludeExtraneousValues: true })
    }
}