import { HttpStatus } from "@tivecs/core";
import Elysia from "elysia";
import { authMacro } from "@/internal/setups";
import {
  ExpenseDeletedError,
  ExpenseNotFoundError,
  ExpenseNotOwnedError,
} from "../errors";
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
})
  .error({
    ExpenseNotFound: ExpenseNotFoundError,
    ExpenseNotOwned: ExpenseNotOwnedError,
    ExpenseDeleted: ExpenseDeletedError,
  })
  .use(authMacro)
  .get(
    "/",
    async ({ query, user }) => {
      const result = await listExpensesUsecase({
        ...query,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        ownerId: user.id,
      });

      return result;
    },
    {
      auth: true,
      query: getExpensesRouteRequestSchema,
      response: {
        [HttpStatus.Ok]: getExpensesRouteResponseSchema,
      },
    },
  )
  .post(
    "/",
    async ({ body, user, set }) => {
      const result = await newExpenseUsecase({
        ...body,
        occurredAt: new Date(body.occurredAt),
        ownerId: user.id,
      });

      set.status = 201;
      return result;
    },
    {
      auth: true,
      body: postExpensesRouteRequestSchema,
      response: {
        [HttpStatus.Created]: postExpensesRouteResponseSchema,
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, user }) => {
      const result = await editExpenseUsecase({
        ...body,
        occurredAt: new Date(body.occurredAt),
        expenseId: id,
        ownerId: user.id,
      });

      return {
        ...result,
        updatedAt: result.updatedAt.toISOString(),
      };
    },
    {
      auth: true,
      body: putExpensesRouteRequestSchema,
      response: {
        200: putExpensesRouteResponseSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, user }) => {
      const result = await deleteExpenseUsecase({
        expenseId: id,
        ownerId: user.id,
      });

      return {
        ...result,
        deletedAt: result.deletedAt.toISOString(),
      };
    },
    {
      auth: true,
      response: {
        200: deleteExpensesRouteResponseSchema,
      },
    },
  );
