import {Module} from '@nestjs/common'
import { QueueTest } from "./QueueTest.service";
import { TestController } from "./QueueTest.controller";
import { RabbitMQTriggerService } from "src/rabbitmq/rabbitmq-trigger.service";
@Module({
  providers: [QueueTest, RabbitMQTriggerService],
  controllers: [TestController],
  exports: [QueueTest]
})
export class QueueModule {}