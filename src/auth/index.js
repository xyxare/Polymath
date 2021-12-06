import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import prisma from "~/prisma/db";

import { getToken, COOKIE_OPTIONS, getRefreshToken } from "./authenticate";
import refreshRouter from "./refreshToken";

const router = express.Router();

router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		res.status(400).json({
			message: "Please provide all the required fields",
		});
	}
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
	});
	if (user) {
		res.status(409).send("User Already Exists");
	}
	const saltRounds = +process.env.SALT_ROUNDS;
	const hashedPassword = bcrypt.hashSync(password, saltRounds);
	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});
	const token = getToken({ id: newUser.id });
	const refreshToken = getRefreshToken({ id: newUser.id });
	await prisma.session.create({
		data: {
			user: {
				connect: {
					id: newUser.id,
				},
			},
			refreshToken,
		},
	});

	res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
	res.send({ success: true, token });
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) throw err;
		if (!user) {
			res.send(info);
		} else {
			req.logIn(user, async (error) => {
				if (error) throw error;
				const token = getToken({ id: user.id });
				const refreshToken = getRefreshToken({ id: user.id });
				await prisma.session.create({
					data: {
						user: {
							connect: {
								id: user.id,
							},
						},
						refreshToken,
					},
				});

				res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
				res.send({ success: true, token });
			});
		}
	})(req, res, next);
});

router.use("/", refreshRouter);

export default router;
