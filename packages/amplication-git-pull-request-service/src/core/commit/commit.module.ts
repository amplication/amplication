import { Module } from '@nestjs/common';
import {CommitController} from "./commit.controller";

@Module({
    controllers: [CommitController],
    imports: [CommitController],
    providers: [CommitController],
})
export class CommitModule {}
