export enum ErrorEnum {
    USER_EXISTS = "400:Email already exist",
    PASSWORD_VERIFICATION_FAILED = "404:Confirmation password does not match",
    USER_IS_BLOCKED = "403:User is blocked",
    USER_NOT_FOUND = "404:User not found",
    USER_INVALID = "403:User not found or blocked",
    USER_UNCONFIRMED = "401:Confirmation your email before!",
    INVALID_LOGIN = "404:Invalid login, please log in again",
    NO_PERMISSION = "403:Access was denied",
    INVALID_DATE = "404:Date invalid",
    RECORD_NOT_FOUND = "404:This record does not exist",
    RECORD_IS_EXISTED = "404:This record already exist",
    REQUEST_INVALIDATED = "408:The current request has expired",
    INVALID_VERIFICATION_TOKEN = "404:Invalid token",
    TOKEN_IS_REQUIRE = "400:Token is required",
    ROLE_NOT_FOUND = "404:Role not found",
    MISSION_EXECUTION_FAILED = "404:Task execution failed",
    CTUET_EMAIL = "400:This email must have the extension 'ctuet.edu.vn'!",

    ROOM_IS_USED = "400:Room is registrated"
}
