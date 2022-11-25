/*
  Warnings:

  - Made the column `votedAgainstId` on table `Vote` required. This step will fail if there are existing NULL values in that column.
  - Made the column `votedForId` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Vote` MODIFY `votedAgainstId` INTEGER NOT NULL,
    MODIFY `votedForId` INTEGER NOT NULL;
