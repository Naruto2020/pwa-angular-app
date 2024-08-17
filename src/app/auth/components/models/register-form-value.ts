export class RegisterFormValue {
    personalInfo!: {
        profilePhoto?: File;
        firstName: string
        lastName: string,
    };
    companie!: string;
    oui?: string;
    non?: string;
    userRegion!: {
        city: string,
        country: string
    };
    phone!: string;
    loginInfo!: {
        email: string,
        password: string
    }
}