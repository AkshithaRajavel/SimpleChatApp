export interface userType{
    _id:string,
    email:string,
    password:string
}
export interface roomType{
    _id:string,
    name:string,
    description:string
}
export interface authType{
    userEmail:string
}
export interface test_db{
    users:userType[],
    rooms:roomType[]
}