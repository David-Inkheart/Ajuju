/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `downvotes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- DropTable
DROP TABLE "Vote";

-- DropEnum
DROP TYPE "VoteType";

-- CreateTable
CREATE TABLE "AnswerVote" (
    "id" SERIAL NOT NULL,
    "vote" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "AnswerVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionVote" (
    "id" SERIAL NOT NULL,
    "vote" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "QuestionVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerVote" ADD CONSTRAINT "AnswerVote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
