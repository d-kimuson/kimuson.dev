import { BrowserContext, Page } from "@playwright/test";
import { setTimeout } from "node:timers/promises";
import { ulid } from "ulid";

const MAX_CONCURRENT_REQUESTS = Number(
  process.env["VRT_MAX_CONCURRENT_REQUESTS"] ?? "10"
);

export const browserController = (context: BrowserContext) => {
  const taskQueue = new Map<
    string,
    {
      status: "pending" | "error";
      task: (page: Page) => Promise<unknown>;
    }
  >();

  const startNextTask = async () => {
    const nextKey = taskQueue.keys().next().value;

    if (nextKey === undefined) {
      return {
        status: "empty",
      } as const;
    }

    const pageCount = context.pages().length;

    if (pageCount >= MAX_CONCURRENT_REQUESTS) {
      return {
        status: "wait",
      } as const;
    }

    const page = await context.newPage();

    const task = taskQueue.get(nextKey)!;
    taskQueue.delete(nextKey);
    void task.task(page);

    return {
      status: "continue",
    } as const;
  };

  const taskLoop = async () => {
    while (true) {
      const { status } = await startNextTask();
      if (status === "continue") {
        continue;
      } else if (status === "wait") {
        await setTimeout(1000);
        continue;
      } else if (status === "empty") {
        break;
      }
    }
  };

  const enqueue = <T>(task: (page: Page) => Promise<T>) => {
    let promiseResolve: (value: Awaited<T>) => void;
    let rejectPromise: (reason?: unknown) => void;

    const taskPromise = new Promise<Awaited<T>>((resolve, reject) => {
      promiseResolve = resolve;
      rejectPromise = reject;
    });

    const taskId = ulid();

    taskQueue.set(taskId, {
      status: "pending",
      task: async (page) => {
        try {
          const ret = await task(page);
          promiseResolve(ret);
          return ret;
        } catch (error) {
          rejectPromise(error);
          throw error;
        } finally {
          await page.close();
        }
      },
    });

    return {
      taskPromise,
    };
  };

  const runWithPage = async <T>(
    callback: (page: Page) => Promise<T>
  ): Promise<T> => {
    const { taskPromise } = enqueue(callback);
    return await taskPromise;
  };

  return {
    runWithPage,
    taskLoop,
  } as const;
};
