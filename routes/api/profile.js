const express = require("express");
const router = express.Router();
const auth=require("../../middleware/auth");
const User=require("../../models/User");
const config=require("config");
const {check,validationResult}=require("express-validator");
const Profile=require("../../models/Profile");
const request = require("request");

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
   
    if(!errors.isEmpty)
    {
         console.log(errors.array());
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

//@route    GET api/profile
//@desc     Get all profiles
//@access   Public

router.get("/",async(req,res)=>{
    try {
        const profiles= await Profile.find().populate("user",["name","avatar"]);
        res.json(profiles);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route    GET api/profile/user/:user_id
//@desc     Get profile by user id
//@access   Public

router.get("/user/:user_id",async(req,res)=>{
    try {
        const profile= await Profile.findOne({user: req.params.user_id}).populate("user",["name","avatar"]);
        if(!profile) return res.status(400).json({msg:"Profile not found"});

        res.json(profile);
        
    } catch (error) {
        console.error(error);
        if(error.kind=="ObjectId") return res.status(400).send("Profile not found");
    }
});

//@route    DELETE api/profile
//@desc     Delete user, profile and posts by user_id
//@access   Private

router.delete("/",auth,
async(req,res)=>{
    try {
        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        
        //Remove User
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg:"User Deleted"});
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route    PUT api/profile/experience
//@desc     Add experience
//@access   Private

router.put("/experience",
[
    auth, 
    [
        check("title","Title is required").not().isEmpty(),
        check("company","Company is required").not().isEmpty(),
        check("from","From date is required").not().isEmpty()
    ]
    
],
async(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty) return res.status(400).json({errors: errors.array()});

    //Destructure and assign into a variable
    const newExp= {title, company,location,from,to,current,description}=req.body;

    try {
        const profile= await Profile.findOne({user : req.user.id});
        profile.experience.push(newExp); //unshift() can also be used.
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route    DELETE api/profile/experience/:expID
//@desc     Delete experience
//@access   Private

router.delete("/experience/:expID",auth, 
    async(req,res)=>{
    try {
        const profile= await Profile.findOne({user : req.user.id});
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.expID);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route    PUT api/profile/education
//@desc     Add education
//@access   Private

router.put("/education",
[
    auth, 
    [
        check("school","School is required").not().isEmpty(),
        check("degree","Degree is required").not().isEmpty(),
        check("fieldofstudy","Fieldofstudy is required").not().isEmpty(),
        check("from","From Date is required").not().isEmpty(),
    ]
    
],
async(req,res)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty) return res.status(400).json({errors: errors.array()});

    //Destructure and assign into a variable
    const newEdu= {school,degree,fieldofstudy,from,to,current,description}=req.body;

    try {
        const profile= await Profile.findOne({user : req.user.id});
        profile.education.push(newEdu); //unshift() can also be used.
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//@route    DELETE api/profile/education/:eduID
//@desc     Delete education
//@access   Private

router.delete("/education/:eduID",auth, 
    async(req,res)=>{
    try {
        const profile= await Profile.findOne({user : req.user.id});
        let indexRemove;
            for (let i = 0; i < profile.education.length; i++) {
              if(profile.education.id==req.params.eduID) {indexRemove=i;}
              }
       

        profile.education.splice(indexRemove,1);
        await profile.save();
        res.json(profile);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get("/github/:username",
async(req,res)=>{
try {
    const options={
        uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientID")}&client_secret=${config.get("githubSecret")}`,
        method:"GET",
        headers: {"user-agent": "node.js"}
    };
    request(options,(error,response,body)=>{
        if(error) console.error(error);
        console.log(response + " : it is response");
        console.log("this is body : "+body);
        if(response.statusCode!==200) res.status(400).send("No Github profile found");
        return res.json(JSON.parse(body));
    });
    
} catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
}
});


module.exports = router;
