import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import axios from 'axios';

export const HTTP_CODE_FROM_PRISMA: Record<string, { status: number; message: string }> = {
	// operation time out
	P1008: {
		status: HttpStatus.REQUEST_TIMEOUT,
		message: 'Request timeout',
	},
	// too long input
	P2000: { status: HttpStatus.BAD_REQUEST, message: 'Input Data is too long' },
	// searched entity not exists
	P2001: { status: HttpStatus.NO_CONTENT, message: 'Record does not exist' },
	// unique constraint or duplication
	P2002: {
		status: HttpStatus.CONFLICT,
		message: 'Reference Data already exists',
	},
	// foreign key constraint
	P2003: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	P2014: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	// update entity not found
	P2016: {
		status: HttpStatus.NOT_FOUND,
		message: 'The entity to update does not exist',
	},
	// out of range
	P2020: {
		status: HttpStatus.UNPROCESSABLE_ENTITY,
		message: 'The provided input can not be processed',
	},
	// internal server error
	P2021: {
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		message: 'Internal server error',
	},
	// not found error
	P2025: {
		status: HttpStatus.NOT_FOUND,
		message: 'The queried entity does not exist',
	},
};
export const HTTP_CODES: Record<number, number> = {
	[HttpStatus.OK]: HttpStatus.OK,
	[HttpStatus.BAD_GATEWAY]: HttpStatus.BAD_GATEWAY,
	[HttpStatus.UNPROCESSABLE_ENTITY]: HttpStatus.UNPROCESSABLE_ENTITY,
	[HttpStatus.REQUEST_TIMEOUT]: HttpStatus.REQUEST_TIMEOUT,
	[HttpStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
	[HttpStatus.CONFLICT]: HttpStatus.CONFLICT,
	[HttpStatus.FORBIDDEN]: HttpStatus.FORBIDDEN,
	[HttpStatus.PRECONDITION_REQUIRED]: HttpStatus.PRECONDITION_REQUIRED,
	[HttpStatus.METHOD_NOT_ALLOWED]: HttpStatus.METHOD_NOT_ALLOWED,
	[HttpStatus.PAYLOAD_TOO_LARGE]: HttpStatus.PAYLOAD_TOO_LARGE,
	[HttpStatus.NOT_IMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
	[HttpStatus.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
	[HttpStatus.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
	[HttpStatus.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
};
export const AXIOS_ERROR_MAPPING: Record<string, { status: number; message: string }> = {
  // 4xx Client Errors
  '400': { status: HttpStatus.BAD_REQUEST, message: 'Bad Request' },
  '401': { status: HttpStatus.UNAUTHORIZED, message: 'Unauthorized' },
  '402': { status: HttpStatus.PAYMENT_REQUIRED, message: 'Payment Required' },
  '403': { status: HttpStatus.FORBIDDEN, message: 'Forbidden' },
  '404': { status: HttpStatus.NOT_FOUND, message: 'Not Found' },
  '405': { status: HttpStatus.METHOD_NOT_ALLOWED, message: 'Method Not Allowed' },
  '406': { status: HttpStatus.NOT_ACCEPTABLE, message: 'Not Acceptable' },
  '407': { status: HttpStatus.PROXY_AUTHENTICATION_REQUIRED, message: 'Proxy Authentication Required' },
  '408': { status: HttpStatus.REQUEST_TIMEOUT, message: 'Request Timeout' },
  '409': { status: HttpStatus.CONFLICT, message: 'Conflict' },
  '410': { status: HttpStatus.GONE, message: 'Gone' },
  '411': { status: HttpStatus.LENGTH_REQUIRED, message: 'Length Required' },
  '412': { status: HttpStatus.PRECONDITION_FAILED, message: 'Precondition Failed' },
  '413': { status: HttpStatus.PAYLOAD_TOO_LARGE, message: 'Payload Too Large' },
  '414': { status: HttpStatus.URI_TOO_LONG, message: 'URI Too Long' },
  '415': { status: HttpStatus.UNSUPPORTED_MEDIA_TYPE, message: 'Unsupported Media Type' },
  '417': { status: HttpStatus.EXPECTATION_FAILED, message: 'Expectation Failed' },
  '418': { status: HttpStatus.I_AM_A_TEAPOT, message: "I'm a teapot" },
  '421': { status: HttpStatus.MISDIRECTED, message: 'Misdirected Request' },
  '422': { status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Unprocessable Entity' },
  '423': { status: HttpStatus.LOCKED, message: 'Locked' },
  '424': { status: HttpStatus.FAILED_DEPENDENCY, message: 'Failed Dependency' },
  '428': { status: HttpStatus.PRECONDITION_REQUIRED, message: 'Precondition Required' },
  '429': { status: HttpStatus.TOO_MANY_REQUESTS, message: 'Too Many Requests' },

  // 5xx Server Errors
  '500': { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal Server Error' },
  '501': { status: HttpStatus.NOT_IMPLEMENTED, message: 'Not Implemented' },
  '502': { status: HttpStatus.BAD_GATEWAY, message: 'Bad Gateway' },
  '503': { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'Service Unavailable' },
  '504': { status: HttpStatus.GATEWAY_TIMEOUT, message: 'Gateway Timeout' },
  '505': { status: HttpStatus.HTTP_VERSION_NOT_SUPPORTED, message: 'HTTP Version Not Supported' },
  '507': { status: HttpStatus.INSUFFICIENT_STORAGE, message: 'Insufficient Storage' },
  '508': { status: HttpStatus.LOOP_DETECTED, message: 'Loop Detected' },
};

@Catch(
	HttpException,
	Prisma.PrismaClientInitializationError,
	Prisma.PrismaClientValidationError,
	Prisma.PrismaClientKnownRequestError,
	Prisma.PrismaClientUnknownRequestError,
	Prisma.PrismaClientRustPanicError,
)
export class HttpExceptionFilter
	implements
		ExceptionFilter<
			| HttpException
			| Prisma.PrismaClientInitializationError
			| Prisma.PrismaClientValidationError
			| Prisma.PrismaClientKnownRequestError
			| Prisma.PrismaClientUnknownRequestError
			| Prisma.PrismaClientRustPanicError
			| Error
		>
{
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(
		exception: HttpException | Error,
		host: ArgumentsHost,
	): Response<string, Record<string, string>> {
		this.logger.error(exception.message, exception.stack);
		const request = host.switchToHttp().getRequest<Request>();
		const response = host.switchToHttp().getResponse<Response>();


    console.log('AXIOS_ERROR', exception)
    if (axios.isAxiosError(exception)) {
      const statusCode = exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorMessage = AXIOS_ERROR_MAPPING[String(statusCode)]?.message || 'Internal Server Error';

      this.logger.error(
        JSON.stringify({
          message: exception.message,
          method: request.method,
          url: request.url,
          body: request.body,
          axiosResponse: exception.response?.data,
        }),
        exception.stack,
      );

      return response.status(statusCode).json({
        error: errorMessage,
        method: request.method,
        url: request.url,
        body: request.body,
        details: exception.response?.data,
      });
    }

    if (
			exception instanceof Prisma.PrismaClientInitializationError ||
			exception instanceof Prisma.PrismaClientValidationError ||
			exception instanceof Prisma.PrismaClientKnownRequestError ||
			exception instanceof Prisma.PrismaClientUnknownRequestError ||
			exception instanceof Prisma.PrismaClientRustPanicError
		) {
			if ('code' in exception && exception.code && HTTP_CODE_FROM_PRISMA?.[exception.code]) {
				const mapper = HTTP_CODE_FROM_PRISMA[exception.code];
				const statusCode = mapper.status;
				const message = mapper.message;
				this.logger.error(
					JSON.stringify({
						message: exception.message,
						method: request.method,
						url: request.url,
						body: request.body,
					}),
					exception.stack,
				);
				return response.status(statusCode).json({
					error: message,
					method: request.method,
					url: request.url,
					body: request.body,
				});
			}
		}

		if (exception instanceof HttpException) {
			this.logger.error(
				JSON.stringify({
					method: request.method,
					url: request.url,
					body: request.body,
				}),
				exception.stack,
			);

			if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR)
				return response.status(500).json();
			if (Object.keys(HTTP_CODES).includes(String(exception.getStatus()))) {
				return response.status(exception.getStatus()).json({
					message: (exception.getResponse() as typeof exception & { message: any }).message,
					method: request.method,
					url: request.url,
					body: request.body,
				});
			}
		}

		this.logger.error(
			{
				request: {
					method: request.method,
					url: request.url,
					body: request.body,
				},
			},
			exception.stack,
		);
		return response.status(500).json();
	}
}
