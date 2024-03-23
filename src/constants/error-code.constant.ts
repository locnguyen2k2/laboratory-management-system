export enum ErrorEnum {
    USER_EXISTS = "1001:User exists",
    PASSWORD_VERIFICATION_FAILED = "1002:Confirmation password does not match",
    USER_IS_BLOCKED = "1006:User is blocked",
    USER_NOT_FOUND = "1017:User is not existed",
    USER_INVALID = "1018:User not found or blocked",

    INVALID_LOGIN = "1101:Invalid login, please log in again",
    NO_PERMISSION = "1102:Access was denied",
    REQUEST_INVALIDATED = "1104:The current request has expired",
    INVALID_VERIFICATION_TOKEN = "1102:Invalid token",

    MISSION_EXECUTION_FAILED = "1201:Task execution failed",
}
