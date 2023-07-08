-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_questionId_fkey";

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "answerId" DROP NOT NULL,
ALTER COLUMN "questionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
