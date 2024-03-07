export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * first_name : needs to be a String, received : ${user.first_name}
    * last_name : needs to be a String, received : ${user.last_name}
    * email : needs to be a String, received : ${user.email}
    * age : needs to be a Number, received : ${user.age}
    `;
}

//agregar otra funcion con mensaje personalizado

export const generateLoginErrorInfo = (login) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * user : needs to be a String, received : ${login.username}
    * password : needs to be a String, received : ${login.password}`
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of requiered properties:
    * title : needs to be a String, received : ${product.title}
    * description : needs to be a String, received : ${product.description}
    * code : needs to be a String, received : ${product.code}
    * price : needs to be a Number, received : ${product.price}
    * category : needs to be a String, received : ${product.category}`
}