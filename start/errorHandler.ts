export const errorHandler = (error: any) => {
    if (process.env.DEBUG_ERRORS) {
        //additional error modifiers
    } else {
        if (error.query) error = {
            status: 500,
            message: "Something went wrong",
            routine: ""
        }
    }

    return error
}