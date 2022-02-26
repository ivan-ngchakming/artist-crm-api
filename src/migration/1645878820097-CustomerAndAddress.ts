import {MigrationInterface, QueryRunner} from "typeorm";

export class CustomerAndAddress1645878820097 implements MigrationInterface {
    name = 'CustomerAndAddress1645878820097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "lineOne" character varying NOT NULL, "lineTwo" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "preferredName" character varying, "instagram" character varying, "email" character varying, "addressId" integer, "correspondenceAddressId" integer, CONSTRAINT "REL_7697a356e1f4b79ab3819839e9" UNIQUE ("addressId"), CONSTRAINT "REL_e778874fe6fc10e02b83618f78" UNIQUE ("correspondenceAddressId"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_7697a356e1f4b79ab3819839e95" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_e778874fe6fc10e02b83618f78f" FOREIGN KEY ("correspondenceAddressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_e778874fe6fc10e02b83618f78f"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_7697a356e1f4b79ab3819839e95"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
