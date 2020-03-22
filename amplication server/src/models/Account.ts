import {Field,  ObjectType } from "type-graphql";
import { User } from "./";
//import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn , UpdateDateColumn } from 'typeorm';
import { Column, Model, Table,CreatedAt,UpdatedAt,PrimaryKey,DataType } from 'sequelize-typescript';


@ObjectType({
  isAbstract: true,
  description: undefined,
})
@Table
export class AccountDB  extends Model<Account>{ // 
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID
  })
  id!: string;

  @CreatedAt
  @Column
  createdAt!: Date;


  @UpdatedAt
  @Column
  updatedAt!: Date;


  @Column({
    allowNull:false
  })
  email!: string;


  @Column({
    allowNull:false
  })
  firstName!: string;


  @Column({
    allowNull:false
  })
  lastName!: string;

  @Column({
    allowNull:false
  })
  password!: string;
}




@ObjectType({
  isAbstract: true,
  description: undefined,
})
@Table
export class Account  { // extends Model<Account>
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  @CreatedAt
  @Column
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  @UpdatedAt
  @Column
  updatedAt!: Date;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  @Column({
    allowNull:false
  })
  email!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  @Column({
    allowNull:false
  })
  firstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  @Column({
    allowNull:false
  })
  lastName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  @Column({
    allowNull:false
  })
  password!: string;

  users?: User[] | null;
}
