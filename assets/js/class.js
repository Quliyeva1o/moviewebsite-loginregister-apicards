 export class User {
    constructor(username, password, email,id) {
        this.id =id
        this.username = username
        this.password = password
        this.email = email
        this.isLoggedIn = false
    }
}