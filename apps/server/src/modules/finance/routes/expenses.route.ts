import {
  failureResultResponseSchema,
  HttpStatus,
  toFailureResponseStruct,
  zodIsoDateSchema,
} from "@tivecs/core";
import Elysia from "elysia";
import { authMacro } from "@/internal/setups";
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
  .use(authMacro)
  .get(
    "/",
    async ({ query, user }) => {
      const listExpensesResult = await listExpensesUsecase({
        ...query,
        startDate: query.startDate
          ? zodIsoDateSchema.decode(query.startDate)
          : undefined,
        endDate: query.endDate
          ? zodIsoDateSchema.decode(query.endDate)
          : undefined,
        ownerId: user.id,
      });

      if (!listExpensesResult.success) {
        return toFailureResponseStruct(listExpensesResult);
      }

      return listExpensesResult.data;
    },
    {
      auth: true,
      query: getExpensesRouteRequestSchema,
      response: {
        [HttpStatus.Ok]: getExpensesRouteResponseSchema,
        [HttpStatus.BadRequest]: failureResultResponseSchema,
      },
    },
  )
  .post(
    "/",
    async ({ body, user }) => {
      const newExpenseResult = await newExpenseUsecase({
        ...body,
        occurredAt: zodIsoDateSchema.decode(body.occurredAt),
        ownerId: user.id,
      });

      if (!newExpenseResult.success) {
        return newExpenseResult;
      }

      return newExpenseResult.data;
    },
    {
      auth: true,
      body: postExpensesRouteRequestSchema,
      response: {
        [HttpStatus.Created]: postExpensesRouteResponseSchema,
        [HttpStatus.BadRequest]: failureResultResponseSchema,
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, user }) => {
      const editExpenseResult = await editExpenseUsecase({
        ...body,
        occurredAt: zodIsoDateSchema.decode(body.occurredAt),
        expenseId: id,
        ownerId: user.id,
      });

      if (!editExpenseResult.success) {
        return editExpenseResult;
      }

      return {
        ...editExpenseResult.data,
        updatedAt: editExpenseResult.data.updatedAt.toISOString(),
      };
    },
    {
      auth: true,
      body: putExpensesRouteRequestSchema,
      response: {
        [HttpStatus.Ok]: putExpensesRouteResponseSchema,
        [HttpStatus.BadRequest]: failureResultResponseSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, user }) => {
      const deleteExpenseResult = await deleteExpenseUsecase({
        expenseId: id,
        ownerId: user.id,
      });

      if (!deleteExpenseResult.success) {
        return deleteExpenseResult;
      }

      return {
        ...deleteExpenseResult.data,
        deletedAt: deleteExpenseResult.data.deletedAt.toISOString(),
      };
    },
    {
      auth: true,
      response: {
        [HttpStatus.Ok]: deleteExpensesRouteResponseSchema,
        [HttpStatus.BadRequest]: failureResultResponseSchema,
      },
    },
  );
