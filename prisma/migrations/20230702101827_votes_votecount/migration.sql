/*
  Warnings:

  - You are about to drop the column `downvote` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "downvote",
DROP COLUMN "upvote",
ADD COLUMN     "voteCount" INTEGER NOT NULL DEFAULT 0;
