-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_listCommentsId_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_movieCommentId_fkey";

-- DropForeignKey
ALTER TABLE "Votes" DROP CONSTRAINT "Votes_movieListId_fkey";

-- AlterTable
ALTER TABLE "Votes" ALTER COLUMN "movieListId" DROP NOT NULL,
ALTER COLUMN "listCommentsId" DROP NOT NULL,
ALTER COLUMN "movieCommentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_movieListId_fkey" FOREIGN KEY ("movieListId") REFERENCES "MovieList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_listCommentsId_fkey" FOREIGN KEY ("listCommentsId") REFERENCES "ListComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_movieCommentId_fkey" FOREIGN KEY ("movieCommentId") REFERENCES "MovieComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
