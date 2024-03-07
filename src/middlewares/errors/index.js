import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.send({ status: "error", error: error.message });
            break;
        //agregar mas casos para los distintos items 
        default:
            res.send({ status: "error", error: error.message });

    }
}