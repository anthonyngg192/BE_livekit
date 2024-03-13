import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PagingModel, ResponseModel } from './common/base/model';
import { RouterModule } from './router/router.module';

export default async function (app: NestExpressApplication) {
  const adminOptions = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const adminDocument = SwaggerModule.createDocument(app, adminOptions, {
    include: [RouterModule],
    deepScanRoutes: true,
    extraModels: [PagingModel, Boolean, String, ResponseModel, Number],
  });
  SwaggerModule.setup('docs', app, adminDocument);
}
