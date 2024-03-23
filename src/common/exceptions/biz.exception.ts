import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorEnum } from "src/constants/error-code.constant";
import { RESPONE_SUCCESS_CODE } from "src/constants/respone.constant";

export class BusinessException extends HttpException {
    private errorCode: number
    constructor(error: ErrorEnum | string) {
        if (!error.includes(':')) {
            super(
                HttpException.createBody({
                    code: RESPONE_SUCCESS_CODE,
                    message: error,
                }),
                HttpStatus.OK,
            )
            this.errorCode = RESPONE_SUCCESS_CODE
            return
        }
        const [code, message] = error.split(':');
        super(
            HttpException.createBody({
                code,
                message,
            }),
            HttpStatus.OK,
        )
        this.errorCode = Number(code)
    }
    getErrorCode(): number {
        return this.errorCode
    }
}

export { BusinessException as BizException }