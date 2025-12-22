import { HttpStatus, toFailureResponseStruct } from "@tivecs/core";
import Elysia from "elysia";
import { authMacro } from "@/internal/auth/auth.setup";
import {
  deleteExpenseUsecase,
  editExpenseUsecase,
  listExpensesUsecase,
  newExpenseUsecase,
} from "../usecases";
import {
  deleteExpensesRouteResponseSchema,
  getExpensesRouteRequestSchema,
  getExpensesRouteResponseSchema,
  postExpensesRouteRequestSchema,
  postExpensesRouteResponseSchema,
  putExpensesRouteRequestSchema,
  putExpensesRouteResponseSchema,
} from "./contracts";

export const expensesRoute = new Elysia({
  tags: ["Expenses"],
  prefix: "/expenses",
}).use(authMacro);

expensesRoute.get(
  "/",
  async ({ query, user }) => {
    const listExpensesResult = await listExpensesUsecase({
      ...query,
      ownerId: user.id,
    });

    if (!listExpensesResult.success) {
      return toFailureResponseStruct(listExpensesResult);
    }

    return {
      ...listExpensesResult.data,
    };
  },
  {
    auth: true,
    query: getExpensesRouteRequestSchema,
    response: {
      [HttpStatus.Ok]: getExpensesRouteResponseSchema,
    },
  },
);
expensesRoute.post(
  "/",
  async ({ body, user }) => {
    const newExpenseResult = await newExpenseUsecase({
      ...body,
      ownerId: user.id,
    });

    if (!newExpenseResult.success) {
      return toFailureResponseStruct(newExpenseResult);
    }

    return newExpenseResult.data;
  },
  {
    auth: true,
    body: postExpensesRouteRequestSchema,
    response: {
      [HttpStatus.Created]: postExpensesRouteResponseSchema,
    },
  },
);
expensesRoute.put(
  "/:id",
  async ({ params: { id }, body, user }) => {
    const editExpenseResult = await editExpenseUsecase({
      ...body,
      expenseId: id,
      ownerId: user.id,
    });

    if (!editExpenseResult.success) {
      return toFailureResponseStruct(editExpenseResult);
    }

    return editExpenseResult.data;
  },
  {
    auth: true,
    body: putExpensesRouteRequestSchema,
    response: {
      [HttpStatus.Ok]: putExpensesRouteResponseSchema,
    },
  },
);
expensesRoute.delete(
  "/:id",
  async ({ params: { id }, user }) => {
    const deleteExpenseResult = await deleteExpenseUsecase({
      expenseId: id,
      ownerId: user.id,
    });

    if (!deleteExpenseResult.success) {
      return toFailureResponseStruct(deleteExpenseResult);
    }

    return deleteExpenseResult.data;
  },
  {
    auth: true,
    response: {
      [HttpStatus.Ok]: deleteExpensesRouteResponseSchema,
    },
  },
);
