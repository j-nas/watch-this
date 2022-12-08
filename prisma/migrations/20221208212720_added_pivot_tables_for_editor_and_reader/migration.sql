/*
  Warnings:

  - You are about to drop the column `editorId` on the `MovieList` table. All the data in the column will be lost.
  - You are about to drop the column `readerId` on the `MovieList` table. All the data in the column will be lost.
  - You are about to drop the `Editor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reader` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_userId_fkey";

-- DropForeignKey
ALTER TABLE "MovieList" DROP CONSTRAINT "MovieList_editorId_fkey";

-- DropForeignKey
ALTER TABLE "MovieList" DROP CONSTRAINT "MovieList_readerId_fkey";

-- DropForeignKey
ALTER TABLE "Reader" DROP CONSTRAINT "Reader_userId_fkey";

-- AlterTable
ALTER TABLE "MovieList" DROP COLUMN "editorId",
DROP COLUMN "readerId";

-- DropTable
DROP TABLE "Editor";

-- DropTable
DROP TABLE "Reader";

-- CreateTable
CREATE TABLE "MoveListReader" (
    "movieListId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,

    CONSTRAINT "MoveListReader_pkey" PRIMARY KEY ("movieListId","readerId")
);

-- CreateTable
CREATE TABLE "MovieListEditor" (
    "movieListId" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,

    CONSTRAINT "MovieListEditor_pkey" PRIMARY KEY ("movieListId","editorId")
);

-- AddForeignKey
ALTER TABLE "MoveListReader" ADD CONSTRAINT "MoveListReader_movieListId_fkey" FOREIGN KEY ("movieListId") REFERENCES "MovieList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveListReader" ADD CONSTRAINT "MoveListReader_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieListEditor" ADD CONSTRAINT "MovieListEditor_movieListId_fkey" FOREIGN KEY ("movieListId") REFERENCES "MovieList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieListEditor" ADD CONSTRAINT "MovieListEditor_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
