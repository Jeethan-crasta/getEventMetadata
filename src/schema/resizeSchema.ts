import { FastifySchema } from "fastify";

export const resizeSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["source", "target"],
    additionalProperties: false,
    properties: {
      source: {
        type: "object",
        required: ["bucket", "key", "region"],
        additionalProperties: false,
        properties: {
          bucket: {
            type: "string",
            minLength: 1
          },
          key: {
            type: "string",
            minLength: 1
          },
          region: {
            type: "string",
            minLength: 1
          }
        }
      },
      target: {
        type: "object",
        required: ["bucket", "key", "region", "width"],
        additionalProperties: false,
        properties: {
          bucket: {
            type: "string",
            minLength: 1
          },
          key: {
            type: "string",
            minLength: 1
          },
          region: {
            type: "string",
            minLength: 1
          },
          width: {
            type: "number",
            minimum: 1
          }
        }
      }
    }
  },
  response: {
    200: {
      type: "object",
      required: ["status", "message"],
      additionalProperties: false,
      properties: {
        status: { type: "string" },
        message: { type: "string" }
      }
    }
  }
};
