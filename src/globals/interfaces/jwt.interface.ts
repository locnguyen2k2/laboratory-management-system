import { Expose, Transform } from "class-transformer";

export class JwtInterface {
    @Expose()
    id: number;
    @Expose()
    email: string;
    @Expose()
    firstName: string;
    @Expose()
    lastName: string;
    // @Expose()
    // @Transform(({ obj }) => obj.firstName + ' ' + obj.lastName)
    // fullName: string;
}