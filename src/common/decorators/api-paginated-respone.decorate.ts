import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PageDto } from "../dtos/page.dto";

export const ApiPaginatedRespone = <TModel extends Type<any>>(
    model: TModel,
) => {  
    return applyDecorators(
        ApiExtraModels(PageDto, model),
        ApiOkResponse({
            description: "Successfully received model list",
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PageDto) },
                    {
                        properties: {
                            data: {
                                type: "array",
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
};