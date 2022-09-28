const router = require("express").Router();
const { User, validate } = require("../model/user");
const bcrypt = require("bcrypt");
const axios= require("axios")
const express = require("express");
const app = express();
const cors = require('cors');



//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({extended: true}));
// To parse the incoming requests with JSON payloads
app.use(express.json());
//app.use(cors());

router.get("/", (req, res) => {
	//console.log("this req body " + req.body);
	res.json({user: 'made'})

})


router.post("/", async (req, res) => {

    //console.log(req.body);
	console.log("email: " + req.body.email);
	console.log("password: " + req.body.password);
	try {
		
		const { error } = validate(req.body);
		
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		console.log("this salt: " + salt);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;