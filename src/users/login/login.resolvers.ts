import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resolvers } from "../../types";
import { User } from "@prisma/client";

export const resolver: Resolvers = {
  Mutation: {
    login: async (_, { username, password }: User, { client }) => {
      // find user with args.username
      const loginUser = await client.user.findUnique({
        where: {
          username,
        },
      });
      if (!loginUser) {
        return {
          ok: false,
          error: "User not found.",
        };
      }

      // check password with args.password
      const passwordCheck = await bcrypt.compare(password, loginUser.password);
      if (!passwordCheck) {
        return {
          ok: false,
          error: "Wrong password.",
        };
      }

      // issue token and send it to the user
      const token = jwt.sign({ id: loginUser.id }, process.env.PRIVATE_KEY, {
        expiresIn: "1d",
      });
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolver;
