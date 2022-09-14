const express = require("express");
const router = express.Router();
const auth=require("../../middleware/auth");
const User=require("../../models/User");
const {check,validationResult}=require("express-validator");
const Profile=require("../../models/Profile");

//@route    GET api/profile/me
//@desc     Get current user profile
//@access   Private
router.get("/me", auth, async(req, res) => 
{
    try {
        const profile= await Profile.findOne({user: req.user.id}).populate("user",["name","avatar"]);
        if(!profile){
            return res.status(400).json({msg:"The profile is unavailable for this user"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
    
});

//@route    POST api/profile
//@desc     Create or update user profile
//@access   Private
router.post("/",
[
    auth,
    [
        check("status","Status is required").not().isEmpty(),
        check("skills","Skills is required").not().isEmpty()
    ]
],
    async(req,res)=>
{
    const errors=validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty)
    {
        return res.status(400).json({errors: errors.array()});
    }
    
    //destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    }=req.body;

    //Build profile object
    const profileFields={
        user : req.user.id,
        company,
        website,
        location,
        bio,
        status,
        githubusername
    };
    if(skills)
    {
        profileFields.skills=skills.split(",").map(skill => skill.trim());
    
    }

    //Build social object
    profileFields.social={
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    };

    try {
        let profile= await Profile.findOne({user: req.user.id});
        if(profile){

            //Update
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new : true});

        return res.json(profile);
        }


        //Create
        profile=new Profile(profileFields);
        await profile.save();

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
   

});




module.exports = router;
