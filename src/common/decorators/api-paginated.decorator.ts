import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { PagingModel, ResponseModel } from '../base/model';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  let type = null;
  switch (model.name) {
    case 'Boolean':
      type = 'boolean';
      break;

    case 'Number':
      type = 'number';
      break;

    case 'String':
      type = 'string';
      break;
  }
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        title: `${model.name}PaginationResponse`,
        allOf: [
          { $ref: getSchemaPath(ResponseModel) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PagingModel) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: type ? { type } : { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
