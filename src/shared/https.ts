import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

type Data = any | null;

abstract class ResponseObject {
  constructor(
    public success: boolean,
    public message: string,
    public data: Data = null,
  ) {}
}

export class SuccessResponseObject extends ResponseObject {
  constructor(message: string, data: Data = null) {
    super(true, message, data);
  }
}

export const ErrorResponseObject = (message: string, error: Error) => {
  if (error instanceof ConflictException) {
    throw new ConflictException(error.message || message);
  }
  if (error instanceof BadRequestException) {
    throw new BadRequestException(error.message || message);
  }
  if (error instanceof NotFoundException) {
    throw new NotFoundException(error.message || message);
  }
  if (error instanceof UnprocessableEntityException) {
    throw new UnprocessableEntityException(error.message || message);
  }
  if (error instanceof ForbiddenException) {
    throw new ForbiddenException(error.message || message);
  }
  if (error instanceof UnauthorizedException) {
    throw new UnauthorizedException(error.message || message);
  }

  throw new InternalServerErrorException(error.message || message);
};
