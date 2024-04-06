export enum ErrorEnum {
    USER_EXISTS = "400:Email already exist",
    ROOM_IS_USED = "400:Room is registrated",
    TOKEN_IS_REQUIRE = "400:Token is required",
    CTUET_EMAIL = "400:This email must have the extension 'ctuet.edu.vn'!",
    
    USER_UNCONFIRMED = "401:Confirmation your email before!",
    
    USER_IS_BLOCKED = "403:User is blocked",
    USER_INVALID = "403:User not found or blocked",
    NO_PERMISSION = "403:Access was denied",

    INVALID_DATE = "404:Date invalid",
    ROLE_NOT_FOUND = "404:Role not found",
    USER_NOT_FOUND = "404:User not found",
    INVALID_VERIFICATION_TOKEN = "404:Invalid token",
    RECORD_NOT_FOUND = "404:This record does not exist",
    RECORD_IS_EXISTED = "404:This record already exist",
    MISSION_EXECUTION_FAILED = "404:Task execution failed",
    INVALID_LOGIN = "404:Invalid login, please log in again",
    PASSWORD_VERIFICATION_FAILED = "404:Confirmation password does not match",
    REQUEST_INVALIDATED = "408:The current request has expired",
}
