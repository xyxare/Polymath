import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import prisma from "~/prisma/db";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export default function jstStrategy(passport) {
	passport.use(
		new JwtStrategy(opts, (jwtPayload, done) => {
			prisma.user
				.findFirst({
					where: {
						id: jwtPayload.id,
					},
				})
				.then((user) => {
					if (!user) {
						return done(null, false);
					}
					return done(null, user);
				});
		})
	);
}
