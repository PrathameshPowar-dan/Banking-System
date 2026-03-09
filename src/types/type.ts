type UserType = {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    GenerateAuthToken: () => string;
}

type OptionsType = {
    maxAge: number;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none";
    secure: boolean;
}

export type { UserType, OptionsType };