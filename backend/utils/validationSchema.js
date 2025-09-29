export const validationSchema = {
    name:{
        notEmpty:{
            errorMessage:"name Cannot be Empty",
        },
        isString:{
            errorMessage:"name must be a string"
        }
    },
    username:{
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage: "Username must be at least 5 characters with max of 32 characters",
        },
        notEmpty:{
            errorMessage:"Username Cannot be Empty",
        },
        isString:{
            errorMessage:"Username must be a string"
        }
    },
    password:{
        isLength:{
            options:{
                min:6,
                max:40
            }
        },
        notEmpty:true,
        isString:true
    }
}
export default validationSchema;