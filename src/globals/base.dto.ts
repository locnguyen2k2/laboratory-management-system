import { Expose, Transform, plainToClass } from "class-transformer";

export class BaseDto {

    @Expose()
    @Transform(() => new Date())
    created_at: Date;
    @Expose()
    @Transform(() => new Date())
    updated_at: Date;

    static plainToClass<T>(this: new (...args: any[]) => T, obj: T): T {
        return plainToClass(this, obj, { excludeExtraneousValues: true })
    }
}