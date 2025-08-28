import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type AppDocument = HydratedDocument<App>;

@Schema({ strict: false, timestamps: true })
export class App {
  @Prop({ unique: true, required: true, default: () => randomUUID() })
  appid: string;
}

export const AppSchema = SchemaFactory.createForClass(App);
