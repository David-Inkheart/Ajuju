/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `QuestionVote` table. All the data in the column will be lost.
  - You are about to drop the column `vote` on the `QuestionVote` table. All the data in the column will be lost.
  - You are about to drop the `AnswerVote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `voteType` to the `QuestionVote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- DropForeignKey
ALTER TABLE "AnswerVote" DROP CONSTRAINT "AnswerVote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AnswerVote" DROP CONSTRAINT "AnswerVote_userId_fkey";

-- AlterTable
ALTER TABLE "QuestionVote" DROP COLUMN "updatedAt",
DROP COLUMN "vote",
ADD COLUMN     "voteType" "VoteType" NOT NULL;

-- DropTable
DROP TABLE "AnswerVote";
