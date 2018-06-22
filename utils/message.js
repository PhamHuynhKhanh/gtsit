
module.exports = {
    ERROR_MESSAGE: {
        USER: {
            USER_ERROR: 'USER_ERROR',
            USER_EXIST: 'USER_EXIST',
            EMAIL_EXIST: 'EMAIL_EXIST',
            EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
            PASS_WRONG: 'PASS_WRONG',
            NOT_FOUND_USER: 'NOT_FOUND_USER',
            USER_IS_WAITED_FRIEND: 'USER_IS_WAITED_FRIEND',
            USER_DO_NOT_MAKE_FRIEND: 'USER_DO_NOT_MAKE_FRIEND'
        },
        MONGOOES: {
            NOT_CONNECT: 'NOT_CONNECT'
        },
        FILE: {
            AVATA_NOT_FOUND: 'AVATA_NOT_FOUND',
            FILE_NOT_FOUND: 'FILE_NOT_FOUND',
            CAN_NOT_UPLOAD: 'CAN_NOT_UPLOAD'
        },
        AUTH: {
            INVALID_TOKEN: 'INVALID_TOKEN',
            PERMISSION: 'PERMISSION',
            NOT_AUTHORIZED: 'NOT_AUTHORIZED',
            INVALID_LOGIN_CREDENTIALS: 'INVALID_LOGIN_CREDENTIALS',
            NOT_SEND_SMS: 'NOT_SEND_SMS'
        },
    },
    SUCCESS_MESSAGE: {
        USER: {
            CREATED: 'USER_CREATE',
            DELETED: 'USER_DELETE',
            SUCCES: 'SUCCES'
        },
        MONGOOES: {
            CONNECT_SUCCESS: 'CONNECT_SUCCESS'
        },
    },
    STATUS_CODE: {
        SUCCES: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NOT_FOUND: 404,
        ERROR: 400,
        ERROR_SERVER: 500
    }
}