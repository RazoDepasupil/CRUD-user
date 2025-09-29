import passport from "passport";
import { Strategy } from "passport-local";
import User from "../schemas/model.js";
import { compareHashed } from "../utils/crypting.js";
export default passport.use(new Strategy(
    async(username,password,done)=>{
        try {
            const user = await User.findOne({username});
            if(!user) throw new Error("User not found!");
            const isMatched = compareHashed(password, user.password);
            if(!isMatched) throw new Error("Invalid Credentials")
            done(null,user);
        } catch (err) {
            done(err,null);
        }
    }
));

passport.serializeUser((_id,done)=>{
    done(null,_id);
});

passport.deserializeUser(async(_id,done) =>{
    try {
        const user = await User.findOne({_id});
        if(!user) throw new Error("User not found!");
        done(null,findUser);
    } catch (err) {
        done(err,null)
    }
});