import * as Joi from "joi";
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly schema) {
    }

    transform(value: any, metadata: ArgumentMetadata) {
        const {error} = Joi.validate(value, this.schema);
        if (error) {
            throw new BadRequestException(error && error.details ? error.details.map(err => err.message).join("; ") : "Validation failed");
        }
        return value;
    }
}
