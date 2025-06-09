import { catchError } from "../../middleware/catchError.js"
import { appError } from "../../utils/appError.js"


export const deleteOne = (model)=>{
    return catchError( async (req, res, next)=>{
        let document = await model.findByIdAndDelete(req.params.id)
        !document && next(new appError("Document not found :(", 404))
        document && res.json({message:"Success", document})
    })
}