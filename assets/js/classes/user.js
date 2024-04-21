export class User {
    constructor(username, fullName, email, password, isAdmin) {
        this.fullName = fullName
        this.username = username
        this.password = password
        this.email = email
        this.isAdmin = isAdmin
        this.favorites=[];
    }
}
