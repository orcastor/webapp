// * 登录模块
export namespace Login {
    export interface ReqLoginForm {
        username: string;
        password: string;
    }
    export interface ResLogin {
        access_token: string;
        user: any;
    }
    export interface ResAuthButtons {
        [key: string]: any;
    }
}