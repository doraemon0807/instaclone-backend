import jwt, { JwtPayload } from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

// Get current user info from token
export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }

    const { id } = jwt.verify(token, process.env.PRIVATE_KEY) as JwtPayload;

    const loggedInUser = await client.user.findUnique({
      where: {
        id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// Protector middleware to check if user is looged in
// export const protectedResolver =
//   (ourResolver: Resolver): Resolver =>
//   (root, args, context, info) => {
//     if (!context.loggedInUser) {
//       return {
//         ok: false,
//         error: "Please log in to perform this action.",
//       };
//     }
//     return ourResolver(root, args, context, info);
//   };

export function protectedResolver(ourResolver: Resolver): Resolver {
  return function (root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action.",
      };
    }
    return ourResolver(root, args, context, info);
  };
}
